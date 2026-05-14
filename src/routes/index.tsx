import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, MapPin, MessageCircle, BookOpen, ArrowRight } from "lucide-react";

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
      { property: "og:description", content: "Friend guides, live local feed, and chat tied to places you're about to visit." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg gradient-ocean">
            <Compass className="h-5 w-5 text-white" />
          </span>
          <span className="text-xl font-display tracking-tight text-primary">LocalLens</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="text-sm px-4 py-2 rounded-md hover:bg-muted transition-colors">
            Log in
          </Link>
          <Link
            to="/signup"
            className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="relative px-6 md:px-12 pt-12 md:pt-24 pb-20 overflow-hidden">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-teal mb-5">Human-powered local guidance</p>
          <h1 className="text-5xl md:text-7xl font-display leading-[1.02] text-primary">
            Travel by the people who actually live there.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            LocalLens replaces algorithmic suggestions with real friends, real-time updates, and personal city
            guides written by people you trust.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md gradient-ocean text-white text-sm font-medium hover:opacity-95 transition"
            >
              Try the demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/guides" className="px-5 py-3 rounded-md text-sm border border-border hover:bg-muted transition">
              Browse friend guides
            </Link>
          </div>
        </div>

        {/* Decorative rings */}
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-20 h-[640px] w-[640px] rounded-full gradient-ocean opacity-10 blur-3xl" />
      </section>

      <section className="px-6 md:px-12 pb-24 grid md:grid-cols-3 gap-5">
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

      <footer className="border-t border-border px-6 md:px-12 py-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} LocalLens · Built for explorers, by their friends.
      </footer>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="h-10 w-10 rounded-lg bg-accent/30 text-primary grid place-items-center mb-4">{icon}</div>
      <h3 className="text-lg font-display text-primary mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
