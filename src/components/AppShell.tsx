import { UserButton, useUser } from "@clerk/tanstack-react-start";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Compass, Home, Map, MessageCircle, BookOpen, Users, User, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const nav = [
  { to: "/dashboard", label: "Feed", icon: Home },
  { to: "/map", label: "Nearby", icon: Map },
  { to: "/guides", label: "Guides", icon: BookOpen },
  { to: "/friends", label: "Friends", icon: Users },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell() {
  const { pathname } = useLocation();
  const { user } = useUser();
  const displayName = user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "You";
  const displayCity = user?.publicMetadata?.city;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-sidebar/88 text-sidebar-foreground border-r border-sidebar-border/80 backdrop-blur-xl">
        <Link to="/dashboard" className="px-6 py-7 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl gradient-ocean shadow-lg shadow-teal/15">
            <Compass className="h-5 w-5 text-white" />
          </span>
          <span className="text-2xl font-display tracking-tight">LocalLens</span>
        </Link>
        <nav className="px-4 flex flex-col gap-1.5">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/72 hover:bg-sidebar-accent/12 hover:text-sidebar-foreground"
                }`}
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-lg transition ${
                    active
                      ? "bg-white/16"
                      : "bg-sidebar-foreground/5 group-hover:bg-sidebar-foreground/8"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-sidebar-border/80 bg-background/45 p-3.5 soft-card">
            <UserButton />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                📍 {typeof displayCity === "string" ? displayCity : "Jaipur"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="relative flex-1 min-w-0 pb-24 md:pb-0 app-surface">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-teal/8 to-transparent"
        />
        <div className="relative flex justify-end px-6 md:px-10 pt-6 pb-2">
          <ThemeToggle />
        </div>
        <div className="relative">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 rounded-2xl border border-sidebar-border/90 bg-sidebar/94 text-sidebar-foreground flex justify-around px-2 py-2 z-50 shadow-2xl backdrop-blur-xl">
        {nav.map(({ to, icon: Icon, label }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={`flex min-w-11 flex-col items-center rounded-xl text-[10px] px-2 py-1.5 transition ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70"
              }`}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

const themeStorageKey = "locallens:theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(themeStorageKey) as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme =
      stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
    setTheme(nextTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/86 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-teal/60 hover:bg-muted"
    >
      {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-teal" />}
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mx-4 md:mx-6 mt-4 rounded-[1.75rem] border border-border/80 bg-surface/72 px-6 py-6 md:px-8 md:py-7 backdrop-blur-xl soft-shell">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-teal">
            LocalLens
          </p>
          <h1 className="text-3xl md:text-5xl font-display text-primary leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}

export function Avatar({ initials, size = 40 }: { initials: string; size?: number }) {
  return (
    <div
      className="rounded-full bg-secondary text-secondary-foreground grid place-items-center font-medium shrink-0 shadow-sm ring-2 ring-background"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
