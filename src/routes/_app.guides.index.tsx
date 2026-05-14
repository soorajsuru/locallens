import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Avatar } from "@/components/AppShell";
import { getLocalLensDataFn } from "@/lib/data";
import { getStoredSelectedCity, storeSelectedCity } from "@/lib/placeSelection";
import { Plus, MapPin } from "lucide-react";

export const Route = createFileRoute("/_app/guides/")({
  head: () => ({ meta: [{ title: "Friend guides · LocalLens" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    city: typeof search.city === "string" ? search.city : undefined,
  }),
  loader: async () => await getLocalLensDataFn(),
  component: GuidesIndex,
});

function GuidesIndex() {
  const { guides, cities, usersById, currentUser } = Route.useLoaderData();
  const search = Route.useSearch();
  const storedCity = getStoredSelectedCity();
  const initialFilter =
    search.city && cities.includes(search.city)
      ? search.city
      : storedCity && cities.includes(storedCity)
        ? storedCity
        : "All";
  const [filter, setFilter] = useState<string>(initialFilter);
  const visible = filter === "All" ? guides : guides.filter((g) => g.city === filter);

  return (
    <>
      <PageHeader
        title="Friend guides"
        subtitle="Personal city playbooks from people, not algorithms."
        action={
          <Link
            to="/guides/new"
            className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-md gradient-ocean text-white"
          >
            <Plus className="h-4 w-4" /> New guide
          </Link>
        }
      />

      <div className="px-6 md:px-10 py-6 flex gap-2 flex-wrap">
        {["All", ...cities].map((c) => (
          <button
            key={c}
            onClick={() => {
              setFilter(c);
              storeSelectedCity(c === "All" ? "" : c);
            }}
            className={`text-xs px-3 py-1.5 rounded-full transition ${
              filter === c
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="px-6 md:px-10 pb-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map((g) => {
          const author = usersById[g.authorId] ?? currentUser;
          return (
            <Link
              key={g.id}
              to="/guides/$guideId"
              params={{ guideId: g.id }}
              className="group rounded-2xl border border-border bg-card p-5 hover:border-teal/60 transition"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <MapPin className="h-3.5 w-3.5" /> {g.city}
                <span>·</span>
                <span>Updated {g.updatedAt}</span>
              </div>
              <h3 className="text-lg font-display text-primary leading-snug mb-3 group-hover:text-teal transition">
                {g.title}
              </h3>
              <div className="flex items-center gap-2.5 mt-5">
                <Avatar initials={author.avatar} size={28} />
                <div className="text-xs">
                  <p className="font-medium text-foreground">{author.name}</p>
                  <p className="text-muted-foreground">{author.city}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
