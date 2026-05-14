import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader, Avatar } from "@/components/AppShell";
import { getLocalLensDataFn } from "@/lib/data";
import { MessageCircle, MapPin, Clock, Check, X, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/_app/guides/$guideId")({
  head: () => ({ meta: [{ title: "Guide · LocalLens" }] }),
  component: GuideDetail,
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <p className="text-muted-foreground">Guide not found.</p>
      <Link to="/guides" className="text-teal hover:underline text-sm">
        Back to guides
      </Link>
    </div>
  ),
  loader: async ({ params }) => {
    const data = await getLocalLensDataFn();
    const guide = data.guides.find((x) => x.id === params.guideId);
    if (!guide) throw notFound();
    return { guide, author: data.usersById[guide.authorId] ?? data.currentUser };
  },
});

function GuideDetail() {
  const { guide, author } = Route.useLoaderData();

  return (
    <>
      <PageHeader title={guide.title} subtitle={`A guide to ${guide.city}`} />
      <div className="px-6 md:px-10 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
          <Avatar initials={author.avatar} size={48} />
          <div className="flex-1">
            <p className="text-sm font-medium">{author.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Lives in {author.city} · Updated {guide.updatedAt}
            </p>
          </div>
          <Link
            to="/chat/$friendId"
            params={{ friendId: author.id }}
            className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-md border border-border hover:bg-muted transition"
          >
            <MessageCircle className="h-4 w-4" /> Ask {author.name.split(" ")[0]}
          </Link>
        </div>

        <Section
          title="Must visit"
          items={guide.mustVisit}
          icon={<MapPin className="h-4 w-4" />}
          accent="teal"
        />
        <Section
          title="Hidden spots"
          items={guide.hiddenSpots}
          icon={<Lightbulb className="h-4 w-4" />}
          accent="accent"
        />
        <div className="my-6 rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
            <Clock className="h-3.5 w-3.5" /> Best timings
          </p>
          <p className="text-[15px]">{guide.bestTimings}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <ListBox title="Do's" items={guide.dos} icon={<Check className="h-4 w-4 text-teal" />} />
          <ListBox
            title="Don'ts"
            items={guide.donts}
            icon={<X className="h-4 w-4 text-destructive" />}
          />
        </div>

        <Section
          title="Tips"
          items={guide.tips}
          icon={<Lightbulb className="h-4 w-4" />}
          accent="accent"
        />
      </div>
    </>
  );
}

function Section({
  title,
  items,
  icon,
  accent,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  accent: "teal" | "accent";
}) {
  return (
    <section className="my-8">
      <h2 className="text-xl font-display text-primary flex items-center gap-2 mb-4">
        <span
          className={`inline-grid place-items-center h-7 w-7 rounded-md ${accent === "teal" ? "bg-teal/15 text-teal" : "bg-accent/40 text-primary"}`}
        >
          {icon}
        </span>
        {title}
      </h2>
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="rounded-lg border border-border bg-card px-4 py-3 text-[15px]">
            {it}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ListBox({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-sm font-medium mb-3">{title}</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-0.5 shrink-0">{icon}</span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
