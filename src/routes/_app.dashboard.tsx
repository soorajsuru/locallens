import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Avatar } from "@/components/AppShell";
import { getLocalLensDataFn } from "@/lib/data";
import { type Post } from "@/lib/db.server";
import { AlertTriangle, Cloud, Sparkles, CalendarDays, Car, Send } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Live local feed · LocalLens" }] }),
  loader: async () => await getLocalLensDataFn(),
  component: Dashboard,
});

const tagMeta = {
  traffic: {
    icon: Car,
    label: "Traffic",
    color: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  weather: { icon: Cloud, label: "Weather", color: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
  tip: { icon: Sparkles, label: "Tip", color: "bg-teal/20 text-teal" },
  event: {
    icon: CalendarDays,
    label: "Event",
    color: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  },
  warning: { icon: AlertTriangle, label: "Warning", color: "bg-destructive/15 text-destructive" },
} as const;

function Dashboard() {
  const { posts: initialPosts, currentUser, cities, usersById } = Route.useLoaderData();
  const [city, setCity] = useState(currentUser.city);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [draft, setDraft] = useState("");
  const [tag, setTag] = useState<Post["tag"]>("tip");

  const filtered = posts.filter((p) => p.city === city);

  function publish(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    const post: Post = {
      id: "p_" + Date.now(),
      authorId: currentUser.id,
      city,
      area: "Nearby",
      body: draft.trim(),
      tag,
      createdAt: "just now",
    };
    setPosts([post, ...posts]);
    setDraft("");
  }

  return (
    <>
      <PageHeader
        title="Live in your city"
        subtitle="Real-time, location-tagged updates from people you trust."
        action={
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        }
      />

      <div className="px-6 md:px-10 py-8 grid lg:grid-cols-[1fr_320px] gap-8 max-w-6xl">
        <div className="space-y-5">
          {/* Composer */}
          <form onSubmit={publish} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <Avatar initials={currentUser.avatar} />
              <div className="flex-1">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`What's happening in ${city} right now?`}
                  className="w-full resize-none bg-transparent outline-none text-sm leading-relaxed min-h-[60px]"
                />
                <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                  <div className="flex gap-1.5 flex-wrap">
                    {(Object.keys(tagMeta) as Post["tag"][]).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTag(t)}
                        className={`text-[11px] px-2.5 py-1 rounded-full transition ${
                          tag === t
                            ? tagMeta[t].color
                            : "bg-muted text-muted-foreground hover:bg-muted/70"
                        }`}
                      >
                        {tagMeta[t].label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="inline-flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-md gradient-ocean text-white disabled:opacity-40"
                  >
                    <Send className="h-3.5 w-3.5" /> Post
                  </button>
                </div>
              </div>
            </div>
          </form>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No live updates from {city} yet. Be the first.
            </div>
          ) : (
            filtered.map((p) => (
              <PostCard key={p.id} post={p} author={usersById[p.authorId] ?? currentUser} />
            ))
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-medium text-foreground mb-3">Do's & Don'ts in {city}</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-teal">✓</span> Carry small change — autos rarely have it.
              </li>
              <li className="flex gap-2">
                <span className="text-teal">✓</span> Bargain in bazaars — start at 40% of quoted.
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span> Don't accept "free" gem tours from
                touts.
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span> Don't drink tap water — bottled or
                filtered only.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border gradient-shore p-5">
            <h3 className="text-sm font-medium text-foreground mb-1">3 friends are in {city}</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Tap to see where they are right now.
            </p>
            <Link to="/map" className="inline-block text-sm text-teal hover:underline">
              Open nearby map →
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

function PostCard({ post, author }: { post: Post; author: { avatar: string; name: string } }) {
  const meta = tagMeta[post.tag];
  const Icon = meta.icon;
  return (
    <article className="rounded-2xl border border-border bg-card p-5 hover:border-teal/40 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <Avatar initials={author.avatar} size={36} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate">
            {author.name}{" "}
            <span className="text-muted-foreground font-normal">
              · {post.area}, {post.city}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">{post.createdAt}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full ${meta.color}`}
        >
          <Icon className="h-3 w-3" /> {meta.label}
        </span>
      </div>
      <p className="text-[15px] leading-relaxed text-foreground/90">{post.body}</p>
    </article>
  );
}
