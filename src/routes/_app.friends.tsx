import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Avatar } from "@/components/AppShell";
import { getLocalLensDataFn } from "@/lib/data";
import { getStoredSelectedCity } from "@/lib/placeSelection";
import { UserPlus, MessageCircle, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/friends")({
  head: () => ({ meta: [{ title: "Friends · LocalLens" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    city: typeof search.city === "string" ? search.city : undefined,
  }),
  loader: async () => await getLocalLensDataFn(),
  component: FriendsPage,
});

function FriendsPage() {
  const { users, friendIds, currentUser, cities } = Route.useLoaderData();
  const search = Route.useSearch();
  const storedCity = getStoredSelectedCity();
  const city =
    search.city && cities.includes(search.city)
      ? search.city
      : storedCity && cities.includes(storedCity)
        ? storedCity
        : "";
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const friends = users.filter((u) => friendIds.includes(u.id) && (!city || u.city === city));
  const suggestions = users.filter(
    (u) => u.id !== currentUser.id && !friendIds.includes(u.id) && (!city || u.city === city),
  );

  return (
    <>
      <PageHeader
        title={city ? `Your circle in ${city}` : "Your circle"}
        subtitle="The people whose word means more than a star rating."
      />

      <div className="px-6 md:px-10 py-8 max-w-5xl">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
          Friends ({friends.length})
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((u) => (
            <div key={u.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <Avatar initials={u.avatar} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{u.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    📍 {u.city}
                    {u.online && " · online"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{u.bio}</p>
              <Link
                to="/chat/$friendId"
                params={{ friendId: u.id }}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border hover:bg-muted"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Message
              </Link>
            </div>
          ))}
        </div>

        {suggestions.length > 0 && (
          <>
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground mt-12 mb-4">
              Suggested
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((u) => (
                <div key={u.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar initials={u.avatar} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">📍 {u.city}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{u.bio}</p>
                  <button
                    onClick={() => setAdded({ ...added, [u.id]: true })}
                    disabled={added[u.id]}
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition ${
                      added[u.id]
                        ? "bg-teal/15 text-teal"
                        : "gradient-ocean text-white hover:opacity-95"
                    }`}
                  >
                    {added[u.id] ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Request sent
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3.5 w-3.5" /> Add friend
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
