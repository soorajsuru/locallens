import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Avatar } from "@/components/AppShell";
import { getLocalLensDataFn } from "@/lib/data";
import { type Post } from "@/lib/db.server";
import { getStoredSelectedCity, storeSelectedCity } from "@/lib/placeSelection";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Car,
  Cloud,
  Map,
  MapPin,
  MessageCircle,
  Search,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

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
  const {
    posts: initialPosts,
    currentUser,
    cities,
    users,
    friendIds,
    guides,
    nearbyByCity,
    usersById,
  } = Route.useLoaderData();
  const storedCity = getStoredSelectedCity();
  const initialCity = cities.includes(storedCity) ? storedCity : "";
  const [city, setCity] = useState(initialCity);
  const [placeQuery, setPlaceQuery] = useState(initialCity);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [draft, setDraft] = useState("");
  const [tag, setTag] = useState<Post["tag"]>("tip");

  const filtered = posts.filter((p) => p.city === city);
  const nearbyFriends = nearbyByCity[city] ?? [];
  const cityGuides = guides.filter((guide) => guide.city === city);
  const cityFriends = users.filter((user) => user.city === city && friendIds.includes(user.id));
  const citySuggestions = users.filter(
    (user) => user.city === city && user.id !== currentUser.id && !friendIds.includes(user.id),
  );
  const hasSelectedPlace = city.length > 0;

  function searchPlace(e: React.FormEvent) {
    e.preventDefault();
    const normalized = placeQuery.trim().toLowerCase();
    const nextCity =
      cities.find((candidate) => candidate.toLowerCase() === normalized) ??
      cities.find((candidate) => candidate.toLowerCase().includes(normalized)) ??
      city;

    setCity(nextCity);
    setPlaceQuery(nextCity);
    storeSelectedCity(nextCity);
  }

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
        title="Where do you want to go?"
        subtitle="Search a place to see live updates, nearby friends, guides, and trusted locals."
      />

      <div className="px-6 md:px-10 pt-8 max-w-6xl">
        <form onSubmit={searchPlace} className="relative max-w-3xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={placeQuery}
            onChange={(e) => setPlaceQuery(e.target.value)}
            list="city-options"
            placeholder="Search a city like Bengaluru, Mumbai, Delhi..."
            className="h-14 w-full rounded-xl border border-border bg-card pl-12 pr-32 text-base outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
          />
          <datalist id="city-options">
            {cities.map((candidate) => (
              <option key={candidate} value={candidate} />
            ))}
          </datalist>
          <button
            type="submit"
            className="absolute right-2 top-1/2 inline-flex h-10 -translate-y-1/2 items-center gap-1.5 rounded-lg gradient-ocean px-4 text-sm font-medium text-white"
          >
            <Search className="h-4 w-4" /> Search
          </button>
        </form>
        {hasSelectedPlace && (
          <Link
            to="/storybook"
            search={{ city }}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-primary transition hover:border-teal/60 hover:bg-muted"
          >
            <BookOpen className="h-4 w-4" /> Storybook for {city}
          </Link>
        )}
      </div>

      <div className="px-6 md:px-10 py-8 grid lg:grid-cols-[1fr_320px] gap-8 max-w-6xl">
        <div className="space-y-5">
          <div className="grid sm:grid-cols-3 gap-3">
            <SummaryLink
              to="/map"
              city={city}
              disabled={!hasSelectedPlace}
              icon={<Map className="h-4 w-4" />}
              label="Nearby"
              value={`${nearbyFriends.length} friends`}
            />
            <SummaryLink
              to="/guides"
              city={city}
              disabled={!hasSelectedPlace}
              icon={<BookOpen className="h-4 w-4" />}
              label="Guides"
              value={`${cityGuides.length} guides`}
            />
            <SummaryLink
              to="/friends"
              city={city}
              disabled={!hasSelectedPlace}
              icon={<Users className="h-4 w-4" />}
              label="People"
              value={`${cityFriends.length + citySuggestions.length} locals`}
            />
          </div>

          <form onSubmit={publish} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <Avatar initials={currentUser.avatar} />
              <div className="flex-1">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={
                    hasSelectedPlace
                      ? `What's happening in ${city} right now?`
                      : "Search a city first to post a local update."
                  }
                  disabled={!hasSelectedPlace}
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
                    disabled={!hasSelectedPlace || !draft.trim()}
                    className="inline-flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-md gradient-ocean text-white disabled:opacity-40"
                  >
                    <Send className="h-3.5 w-3.5" /> Post
                  </button>
                </div>
              </div>
            </div>
          </form>

          {hasSelectedPlace && (
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-teal">Choose a guide</p>
                  <h2 className="mt-1 text-2xl font-display text-primary">
                    Build a travel itinerary for {city}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select one local guide to compare their recommendations with the city top ten.
                  </p>
                </div>
                <span className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                  {cityGuides.length} guides
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {cityGuides.map((guide) => {
                  const author = usersById[guide.authorId] ?? currentUser;

                  return (
                    <Link
                      key={guide.id}
                      to="/travel-itinerary"
                      search={{ city, guideId: guide.id }}
                      className="group rounded-xl border border-border bg-surface p-4 transition hover:border-teal/60 hover:bg-muted/50"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar initials={author.avatar} size={38} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-snug text-foreground">
                            {guide.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {author.name} · Updated {guide.updatedAt}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {guide.mustVisit.slice(0, 2).map((place) => (
                              <span
                                key={place}
                                className="rounded-full bg-card px-2 py-1 text-[11px] text-muted-foreground"
                              >
                                {place.split(" at ")[0].split(" for ")[0]}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ArrowRight className="mt-1 h-4 w-4 text-teal transition group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              {hasSelectedPlace
                ? `No live updates from ${city} yet. Be the first.`
                : "Search a city to see the local feed."}
            </div>
          ) : (
            filtered.map((p) => (
              <PostCard key={p.id} post={p} author={usersById[p.authorId] ?? currentUser} />
            ))
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-medium text-foreground mb-3">
              {hasSelectedPlace ? `Nearby in ${city}` : "Nearby"}
            </h3>
            <div className="space-y-3">
              {nearbyFriends.slice(0, 4).map((friend) => {
                const user = usersById[friend.id] ?? currentUser;

                return (
                  <Link
                    key={friend.id}
                    to="/map"
                    search={{ city }}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/70"
                  >
                    <Avatar initials={user.avatar} size={32} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{friend.place}</p>
                    </div>
                  </Link>
                );
              })}
              {nearbyFriends.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {hasSelectedPlace
                    ? "No nearby friends here yet."
                    : "Search a city to see nearby friends."}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border gradient-shore p-5">
            <h3 className="text-sm font-medium text-foreground mb-3">
              {hasSelectedPlace ? `Guides for ${city}` : "Guides"}
            </h3>
            <div className="space-y-3">
              {cityGuides.slice(0, 3).map((guide) => (
                <Link
                  key={guide.id}
                  to="/guides/$guideId"
                  params={{ guideId: guide.id }}
                  className="block rounded-lg border border-border bg-card/70 p-3 hover:bg-card"
                >
                  <p className="text-sm font-medium leading-snug">{guide.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Updated {guide.updatedAt}</p>
                </Link>
              ))}
              {cityGuides.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {hasSelectedPlace
                    ? "No guides for this place yet."
                    : "Search a city to see matching guides."}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-medium text-foreground mb-3">Friends and locals</h3>
            <div className="space-y-3">
              {[...cityFriends, ...citySuggestions].slice(0, 4).map((user) => (
                <Link
                  key={user.id}
                  to="/chat/$friendId"
                  params={{ friendId: user.id }}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/70"
                >
                  <Avatar initials={user.avatar} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.bio}</p>
                  </div>
                  <MessageCircle className="h-4 w-4 text-teal" />
                </Link>
              ))}
              {cityFriends.length + citySuggestions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {hasSelectedPlace
                    ? `No people found for ${city} yet.`
                    : "Search a city to see friends and locals."}
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function SummaryLink({
  to,
  city,
  disabled,
  icon,
  label,
  value,
}: {
  to: "/map" | "/guides" | "/friends";
  city: string;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  if (disabled) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 opacity-60">
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          {icon} {label}
        </div>
        <p className="text-lg font-display text-primary">{value}</p>
      </div>
    );
  }

  return (
    <Link
      to={to}
      search={{ city }}
      className="rounded-xl border border-border bg-card p-4 hover:border-teal/50"
    >
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <p className="text-lg font-display text-primary">{value}</p>
    </Link>
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
