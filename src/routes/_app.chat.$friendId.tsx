import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Avatar } from "@/components/AppShell";
import { getLocalLensDataFn } from "@/lib/data";
import { type Message } from "@/lib/db.server";
import { ArrowLeft, Send, MapPin } from "lucide-react";

export const Route = createFileRoute("/_app/chat/$friendId")({
  head: () => ({ meta: [{ title: "Chat · LocalLens" }] }),
  loader: async ({ params }) => {
    const data = await getLocalLensDataFn();
    const friend = data.usersById[params.friendId];
    if (!friend) throw notFound();
    return {
      currentUser: data.currentUser,
      friend,
      initialMessages: data.messagesByFriend[friend.id] ?? [],
    };
  },
  component: ChatRoom,
});

function ChatRoom() {
  const { currentUser, friend, initialMessages } = Route.useLoaderData();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    const msg: Message = {
      id: "m_" + Date.now(),
      fromId: currentUser.id,
      toId: friend.id,
      body: draft.trim(),
      at: "now",
    };
    setMessages([...messages, msg]);
    setDraft("");
    // simulated reply
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: "m_" + Date.now() + "_r",
          fromId: friend.id,
          toId: currentUser.id,
          body: "Got it — let me think and send a few options 👀",
          at: "now",
        },
      ]);
    }, 1200);
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
            {friend.online && " · online"}
          </p>
        </div>
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
      </div>

      <form onSubmit={send} className="border-t border-border bg-card p-3 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Ask ${friend.name.split(" ")[0]}...`}
          className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="h-10 w-10 grid place-items-center rounded-full gradient-ocean text-white disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
