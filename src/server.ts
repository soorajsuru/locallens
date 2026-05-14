import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

type ChatMessage = {
  id: string;
  friendId: string;
  fromId: string;
  toId: string;
  body: string;
  at: string;
};

type ChatEvent =
  | { type: "message"; message: ChatMessage }
  | { type: "typing"; friendId: string };

type ChatClient = {
  send: (payload: string) => void;
  close: () => void;
};

type ChatServiceState = {
  messages: Map<string, ChatMessage[]>;
  clients: Map<string, Set<ChatClient>>;
};

declare global {
  var __localLensChatState__: ChatServiceState | undefined;
}

function getChatServiceState(): ChatServiceState {
  if (!globalThis.__localLensChatState__) {
    globalThis.__localLensChatState__ = {
      messages: new Map(),
      clients: new Map(),
    };
  }
  return globalThis.__localLensChatState__;
}

function serializeSse(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

function broadcastChatEvent(friendId: string, event: ChatEvent) {
  const state = getChatServiceState();
  const clients = state.clients.get(friendId);
  if (!clients) return;
  const payload = serializeSse(event);
  for (const client of Array.from(clients)) {
    try {
      client.send(payload);
    } catch (error) {
      client.close();
      clients.delete(client);
    }
  }
}

function addChatMessage(message: ChatMessage) {
  const state = getChatServiceState();
  const messages = state.messages.get(message.friendId) ?? [];
  if (!messages.some((m) => m.id === message.id)) {
    messages.push(message);
    state.messages.set(message.friendId, messages);
  }
}

function getEnvValue(env: unknown, key: string): string | undefined {
  if (env && typeof env === "object" && key in env) {
    return (env as Record<string, string | undefined>)[key];
  }
  return typeof process !== "undefined" && typeof process.env !== "undefined"
    ? process.env[key]
    : undefined;
}

function base64UrlEncode(value: ArrayBuffer | string) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : new Uint8Array(value);
  const binary = Array.from(bytes)
    .map((byte) => String.fromCharCode(byte))
    .join("");
  const base64 =
    typeof globalThis.btoa === "function"
      ? globalThis.btoa(binary)
      : Buffer.from(bytes).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64Encode(value: string) {
  return typeof globalThis.btoa === "function"
    ? globalThis.btoa(value)
    : Buffer.from(value, "utf8").toString("base64");
}

async function ensureStreamUsers(apiKey: string, apiSecret: string, users: Record<string, { name: string }>) {
  const response = await fetch("https://chat.stream-io-api.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${base64Encode(`${apiKey}:${apiSecret}`)}`,
    },
    body: JSON.stringify({ users }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Stream user upsert failed: ${response.status} ${errorText}`);
  }
}

async function hmacSha256(key: string, message: string) {
  const text = new TextEncoder().encode(message);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", cryptoKey, text);
}

async function createStreamToken(userId: string, secret: string) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(JSON.stringify({ user_id: userId, iat: Math.floor(Date.now() / 1000) }));
  const signature = await hmacSha256(secret, `${header}.${payload}`);
  return `${header}.${payload}.${base64UrlEncode(signature)}`;
}

async function handleChatToken(request: Request, env: unknown) {
  const body = await request.json();
  const userId = body.userId as string | undefined;
  const userName = body.name as string | undefined;
  const friendId = body.friendId as string | undefined;
  const friendName = body.friendName as string | undefined;

  if (!userId || !userName) {
    return new Response(JSON.stringify({ error: "userId and name are required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const apiKey = getEnvValue(env, "GETSTREAM_API_KEY");
  const apiSecret = getEnvValue(env, "GETSTREAM_API_SECRET");
  if (!apiKey || !apiSecret) {
    return new Response(JSON.stringify({ error: "Chat API credentials are not configured" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const users: Record<string, { name: string }> = {
    [userId]: { name: userName },
  };

  if (friendId) {
    users[friendId] = { name: friendName ?? friendId };
  }

  await ensureStreamUsers(apiKey, apiSecret, users);

  const userToken = await createStreamToken(userId, apiSecret);
  return new Response(JSON.stringify({ apiKey, userToken, userId }), {
    headers: { "content-type": "application/json" },
  });
}

async function handleChatStream(request: Request, url: URL) {
  const friendId = url.pathname.split("/").pop();
  if (!friendId) {
    return new Response("Missing friendId", { status: 400 });
  }

  const state = getChatServiceState();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const client: ChatClient = {
        send(payload) {
          controller.enqueue(encoder.encode(payload));
        },
        close() {
          controller.close();
        },
      };

      const friends = state.clients.get(friendId) ?? new Set();
      friends.add(client);
      state.clients.set(friendId, friends);

      const cleanup = () => {
        friends.delete(client);
        controller.close();
      };

      request.signal.addEventListener("abort", cleanup);
    },
    cancel() {
      const friends = state.clients.get(friendId);
      if (!friends) return;
      for (const client of friends) {
        client.close();
      }
      state.clients.delete(friendId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

async function handleChatSend(request: Request) {
  const payload = await request.json();
  const friendId = payload.friendId as string | undefined;
  const fromId = payload.fromId as string | undefined;
  const text = payload.text as string | undefined;
  const incomingId = (payload.id as string | undefined) ?? `m_${Date.now()}`;

  if (!friendId || !fromId || !text) {
    return new Response(JSON.stringify({ error: "friendId, fromId, and text are required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const userMessage: ChatMessage = {
    id: incomingId,
    friendId,
    fromId,
    toId: friendId,
    body: text,
    at: new Date().toLocaleTimeString(),
  };

  addChatMessage(userMessage);
  broadcastChatEvent(friendId, { type: "message", message: userMessage });
  broadcastChatEvent(friendId, { type: "typing", friendId });

  setTimeout(() => {
    const reply: ChatMessage = {
      id: `m_${Date.now()}_r`,
      friendId,
      fromId: friendId,
      toId: fromId,
      body: `Sure — I saw your message and I’m checking the best local options for you.`,
      at: new Date().toLocaleTimeString(),
    };
    addChatMessage(reply);
    broadcastChatEvent(friendId, { type: "message", message: reply });
  }, 1200);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);

      if (url.pathname === "/api/chat/token" && request.method === "POST") {
        return await handleChatToken(request, env);
      }

      if (url.pathname.startsWith("/api/chat/stream/")) {
        return await handleChatStream(request, url);
      }

      if (url.pathname === "/api/chat/send" && request.method === "POST") {
        return await handleChatSend(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
