import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Avatar } from "@/components/AppShell";
import { conversations, getUser } from "@/lib/mockData";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/_app/chat/")({
  head: () => ({ meta: [{ title: "Chat · LocalLens" }] }),
  component: ChatList,
});

function ChatList() {
  return (
    <>
      <PageHeader title="Chats" subtitle="Conversations stay tied to the places you discuss." />
      <div className="px-6 md:px-10 py-6 max-w-2xl">
        {conversations.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            <MessageCircle className="h-6 w-6 mx-auto mb-2 opacity-60" />
            No chats yet. Start one from a friend or guide.
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
            {conversations.map((c) => {
              const u = getUser(c.friendId);
              return (
                <li key={c.friendId}>
                  <Link
                    to="/chat/$friendId"
                    params={{ friendId: c.friendId }}
                    className="flex items-center gap-3 p-4 hover:bg-muted/50 transition"
                  >
                    <Avatar initials={u.avatar} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-medium truncate">{u.name}</p>
                        <p className="text-xs text-muted-foreground shrink-0">{c.at}</p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{c.lastMessage}</p>
                    </div>
                    {c.unread && (
                      <span className="bg-teal text-teal-foreground text-[10px] rounded-full h-5 min-w-5 px-1.5 grid place-items-center">
                        {c.unread}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
