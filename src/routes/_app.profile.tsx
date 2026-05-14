import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Avatar } from "@/components/AppShell";
import { getLocalLensDataFn } from "@/lib/data";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile · LocalLens" }] }),
  loader: async () => await getLocalLensDataFn(),
  component: Profile,
});

function Profile() {
  const { currentUser, guides, posts } = Route.useLoaderData();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [city, setCity] = useState(currentUser.city);
  const [bio, setBio] = useState(currentUser.bio);

  const myGuides = guides.filter((g) => g.authorId === currentUser.id);
  const myPosts = posts.filter((p) => p.authorId === currentUser.id);

  return (
    <>
      <PageHeader
        title="Your profile"
        subtitle="The face people see when you write a guide or drop a tip."
        action={
          <button
            onClick={() => setEditing((v) => !v)}
            className="text-sm px-4 py-2 rounded-md border border-border hover:bg-muted"
          >
            {editing ? "Done" : "Edit"}
          </button>
        }
      />

      <div className="px-6 md:px-10 py-8 max-w-3xl">
        <div className="rounded-2xl border border-border bg-card p-6 flex gap-5 items-start">
          <Avatar initials={currentUser.avatar} size={72} />
          <div className="flex-1 space-y-3">
            {editing ? (
              <>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-lg font-medium rounded-md border border-input bg-background px-3 py-2"
                />
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                  />
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </>
            ) : (
              <>
                <h2 className="text-xl font-medium">{name}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {city}
                </p>
                <p className="text-sm text-foreground/85">{bio}</p>
              </>
            )}
          </div>
        </div>

        <Stat label="Guides written" count={myGuides.length} />
        <div className="grid gap-3 mb-8">
          {myGuides.length === 0 ? (
            <Empty>
              <Link to="/guides/new" className="text-teal hover:underline">
                Write your first guide →
              </Link>
            </Empty>
          ) : (
            myGuides.map((g) => (
              <Link
                key={g.id}
                to="/guides/$guideId"
                params={{ guideId: g.id }}
                className="rounded-xl border border-border bg-card p-4 hover:border-teal/50"
              >
                <p className="font-medium">{g.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {g.city} · {g.updatedAt}
                </p>
              </Link>
            ))
          )}
        </div>

        <Stat label="Live updates posted" count={myPosts.length} />
        <div className="grid gap-3">
          {myPosts.length === 0 ? (
            <Empty>No posts yet.</Empty>
          ) : (
            myPosts.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-4 text-sm">
                <p>{p.body}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {p.area}, {p.city} · {p.createdAt}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

function Stat({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-baseline justify-between mt-10 mb-3">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground">{label}</h3>
      <span className="text-xs text-muted-foreground">{count}</span>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
