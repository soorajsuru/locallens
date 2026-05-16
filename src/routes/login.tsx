import { SignIn } from "@clerk/tanstack-react-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { ThemeToggle } from "@/components/AppShell";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in · LocalLens" }] }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthFrame title="Welcome back" subtitle="Pick up where your trip left off.">
      <SignIn path="/login" signUpUrl="/signup" forceRedirectUrl="/dashboard" />
    </AuthFrame>
  );
}

export function AuthFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-background text-foreground md:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden gradient-ocean p-12 text-white md:flex md:flex-col md:justify-between">
        <div
          aria-hidden
          className="absolute -right-28 top-16 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute bottom-24 left-10 h-56 w-56 rounded-full bg-teal/20 blur-3xl"
        />
        <Link to="/" className="flex items-center gap-2">
          <Compass className="h-6 w-6" />
          <span className="text-xl font-display">LocalLens</span>
        </Link>
        <div className="relative rounded-[2rem] border border-white/18 bg-white/10 p-8 shadow-2xl backdrop-blur">
          <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-4">
            From a friend in Jaipur
          </p>
          <p className="text-2xl font-display leading-snug max-w-sm">
            "Skip Chokhi Dhani if it's just one night — too touristy. Try LMB on MI Road, ground
            floor only."
          </p>
          <p className="text-sm text-white/70 mt-4">— Aarav, on LocalLens · 2 hours ago</p>
        </div>
        <p className="text-xs text-white/60">© LocalLens</p>
      </div>
      <div className="app-surface flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-md rounded-[2rem] border border-border/80 bg-card/82 p-6 shadow-2xl shadow-primary/5 backdrop-blur-xl md:p-8">
          <div className="flex justify-end mb-6">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-display text-primary">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1.5 mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
