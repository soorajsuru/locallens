import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/tanstack-react-start";
import { Avatar } from "@/components/AppShell";
import { getLocalLensDataFn } from "@/lib/data";
import { type Message } from "@/lib/db.server";
import { ArrowLeft, Send, MapPin } from "lucide-react";

export const Route = createFileRoute("/_app/chat/$friendId")({
  head: () => ({ meta: [{ title: "Chat · LocalLens" }] }),
  loader: async ({ params }) => {
    const data = await getLocalLensDataFn();
    const friend =
      data.usersById[params.friendId] ?? {
        id: params.friendId,
        name: `Friend`,
        city: "Unknown",
        bio: "",
        avatar: params.friendId.slice(0, 2).toUpperCase(),
      };
    return {
      friend,
    };
  },
  component: ChatRoom,
});

function ChatRoom() {
  const { friend } = Route.useLoaderData();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [channelReady, setChannelReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [chatUrl, setChatUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy link");
  const scrollRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const currentUser = {
    id: user?.id ?? "u_demo",
    name: user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "Demo User",
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setChatUrl(`${window.location.origin}/chat/${friend.id}`);
    }
  }, [friend.id]);

  function copyChatLink() {
    if (!chatUrl) return;
    navigator.clipboard.writeText(chatUrl).then(
      () => setCopyStatus("Copied!"),
      () => setCopyStatus("Copy failed")
    );
    setTimeout(() => setCopyStatus("Copy link"), 2000);
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    let active = true;

    async function initLocalChat() {
      try {
        const historyResponse = await fetch(`/api/chat/history/${friend.id}`);
        const historyData = await historyResponse.json();
        if (active && Array.isArray(historyData.messages)) {
          setMessages(historyData.messages);
        }
      } catch (error) {
        console.error("Failed to load chat history", error);
      }

      const source = new EventSource(`/api/chat/stream/${friend.id}`);
      source.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed?.type === "message") {
            const message = parsed.message as Message;
            setMessages((prev) => {
              if (prev.some((m) => m.id === message.id)) return prev;
              return [...prev, message];
            });
          } else if (parsed?.type === "typing") {
            setIsTyping(parsed.friendId === friend.id);
            setTimeout(() => setIsTyping(false), 1200);
          }
        } catch (error) {
          console.error("Failed to parse SSE chat event", error);
        }
      };

      source.onerror = (error) => {
        console.error("Chat stream error", error);
        source.close();
      };

      eventSourceRef.current = source;
      setChannelReady(true);
    }

    initLocalChat();

    return () => {
      active = false;
      eventSourceRef.current?.close();
    };
  }, [friend.id]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) {
      console.warn("[Chat] Cannot send message: draft is empty");
      return;
    }

    const text = draft.trim();
    setDraft("");

    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          friendId: friend.id,
          fromId: currentUser.id,
          text,
          id: `m_${Date.now()}`,
        }),
      });
    } catch (error) {
      console.error("[Chat] Message send failed", error);
      setDraft(text);
    }
  }

  return (
    <div className="flex flex-col h-screen md:h-screen">
      <header className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-border bg-surface/60 backdrop-blur">
        <Link to="/chat" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Avatar initials={friend.avatar} size={36} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{friend.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            📍 {friend.city}
            {friend.online ? " · online" : " · offline"}
          </p>
        </div>
        <button
          type="button"
          onClick={copyChatLink}
          className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground"
        >
          {copyStatus}
        </button>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-3 bg-background"
      >
        {messages.map((m) => {
          const mine = m.fromId === currentUser.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                  mine
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border rounded-bl-sm"
                }`}
              >
                {m.contextPlace && (
                  <Link
                    to="/guides"
                    search={{ city: undefined }}
                    className={`flex items-center gap-1 text-[11px] mb-1.5 px-2 py-1 rounded-md ${
                      mine ? "bg-white/15" : "bg-accent/30 text-primary"
                    }`}
                  >
                    <MapPin className="h-3 w-3" /> About: {m.contextPlace}
                  </Link>
                )}
                <p>{m.body}</p>
                <p
                  className={`text-[10px] mt-1 ${mine ? "text-white/60" : "text-muted-foreground"}`}
                >
                  {m.at}
                </p>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[50%] rounded-2xl bg-card border border-border px-4 py-2.5 text-[15px] leading-relaxed rounded-bl-sm">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-teal animate-pulse" /> Typing...
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={send} className="border-t border-border bg-card p-3 flex flex-col gap-2">
        {initError && (
          <div className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded">
            ⚠️ Chat initialization issue: {initError}
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Ask ${friend.name.split(" ")[0]}...`}
            className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            title={!channelReady ? "Connecting to chat..." : "Send message"}
            className="h-10 w-10 grid place-items-center rounded-full gradient-ocean text-white disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
