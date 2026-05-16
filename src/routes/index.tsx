import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  MapPin,
  MessageCircle,
  BookOpen,
  ArrowRight,
  Search,
  Cloud,
  Car,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LocalLens — A human-powered local travel companion" },
      {
        name: "description",
        content:
          "Real-time, human-centric local insights from friends and trusted locals. Skip the algorithms — travel by people you know.",
      },
      { property: "og:title", content: "LocalLens — Travel by people, not algorithms" },
      {
        property: "og:description",
        content: "Friend guides, live local feed, and chat tied to places you're about to visit.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/82 px-6 py-4 backdrop-blur-xl md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl gradient-ocean shadow-lg shadow-teal/15">
              <Compass className="h-5 w-5 text-white" />
            </span>
            <span className="text-2xl font-display tracking-tight text-primary">LocalLens</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded-md hover:bg-muted transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 pb-20 pt-12 md:px-12 md:pt-20">
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)]">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-teal mb-5">
              Human-powered local guidance
            </p>
            <h1 className="text-5xl md:text-7xl font-display leading-[1.02] text-primary">
              Travel by the people who actually live there.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              LocalLens replaces algorithmic suggestions with real friends, real-time updates, and
              personal city guides written by people you trust.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl gradient-ocean px-5 py-3 text-sm font-medium text-white shadow-lg shadow-teal/20 transition hover:-translate-y-0.5 hover:opacity-95"
              >
                Try the demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/guides"
                className="rounded-xl border border-border/80 bg-card/70 px-5 py-3 text-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-muted"
              >
                Browse friend guides
              </Link>
            </div>
          </div>
          <HeroPreview />
        </div>

        {/* Decorative rings */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-20 h-[640px] w-[640px] rounded-full gradient-ocean opacity-12 blur-3xl"
        />
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-10 md:grid-cols-3 md:px-12">
        <Feature
          icon={<BookOpen className="h-5 w-5" />}
          title="Friend Guides"
          body="Personal city guides — must-visit, hidden spots, do's & don'ts, written by the locals you trust."
        />
        <Feature
          icon={<MapPin className="h-5 w-5" />}
          title="Live Local Feed"
          body="Real-time, location-tagged updates: traffic, weather, sunset alerts, scams, openings."
        />
        <Feature
          icon={<MessageCircle className="h-5 w-5" />}
          title="Context-aware chat"
          body='One tap to ask a friend "what about this place?" — chats stay tied to the spots you discuss.'
        />
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-24 md:grid-cols-3 md:px-12">
        <Metric value="8 min" label="to find a trusted local tip" />
        <Metric value="42" label="friend-written guide points" />
        <Metric value="Live" label="city feed before you arrive" />
      </section>

      <footer className="border-t border-border/80 px-6 py-8 text-xs text-muted-foreground md:px-12">
        © {new Date().getFullYear()} LocalLens · Built for explorers, by their friends.
      </footer>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card/82 p-6 backdrop-blur soft-card transition hover:-translate-y-1 hover:border-teal/50">
      <div className="h-10 w-10 rounded-xl bg-accent/30 text-primary grid place-items-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-display text-primary mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="relative hidden lg:block">
      <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-teal/20 blur-3xl" />
      <div className="absolute -right-8 bottom-8 h-36 w-36 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative rounded-[2rem] border border-border/80 bg-card/86 p-5 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-teal">Live city lens</p>
            <h2 className="mt-1 text-2xl font-display text-primary">Jaipur this evening</h2>
          </div>
          <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-medium text-teal">
            12 friends nearby
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-background/70 p-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4 text-teal" />
            Search a city, market, cafe, or monument
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <CityPill label="Jaipur" active />
            <CityPill label="Mumbai" />
            <CityPill label="Delhi" />
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <LiveUpdate
            icon={<Car className="h-4 w-4" />}
            label="Traffic"
            title="MI Road is slow after 6:30"
            body="Aarav says take the parallel lane near Panch Batti."
          />
          <LiveUpdate
            icon={<Cloud className="h-4 w-4" />}
            label="Weather"
            title="Rooftops are clear tonight"
            body="Good visibility for Nahargarh sunset, but book before 5."
          />
        </div>

        <div className="mt-4 rounded-2xl border border-border/80 gradient-shore p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Trusted locals</p>
            <Users className="h-4 w-4 text-teal" />
          </div>
          <div className="flex -space-x-2">
            {["AK", "MS", "RN", "VP"].map((initials) => (
              <span
                key={initials}
                className="grid h-10 w-10 place-items-center rounded-full border-2 border-background bg-secondary text-xs font-semibold text-secondary-foreground"
              >
                {initials}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Ask the people you know before you choose where to go next.
          </p>
        </div>
      </div>
    </div>
  );
}

function CityPill({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-center text-xs font-medium ${
        active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      }`}
    >
      {label}
    </span>
  );
}

function LiveUpdate({
  icon,
  label,
  title,
  body,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-background/68 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-teal">
        {icon} {label}
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-surface/72 p-5 backdrop-blur soft-card">
      <p className="text-3xl font-display text-primary">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
