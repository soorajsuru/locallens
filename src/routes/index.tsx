import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, MapPin, MessageCircle, BookOpen, ArrowRight } from "lucide-react";
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

      <section className="relative overflow-hidden px-6 pb-20 pt-12 md:px-12 md:pt-24">
        <div className="relative z-10 mx-auto max-w-7xl">
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
        </div>

        {/* Decorative rings */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-20 h-[640px] w-[640px] rounded-full gradient-ocean opacity-12 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-8 right-10 hidden h-72 w-72 rounded-[3rem] border border-border/70 bg-card/35 shadow-2xl backdrop-blur-xl md:block"
        />
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-24 md:grid-cols-3 md:px-12">
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
