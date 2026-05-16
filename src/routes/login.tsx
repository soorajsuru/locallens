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
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex gradient-ocean text-white p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Compass className="h-6 w-6" />
          <span className="text-xl font-display">LocalLens</span>
        </Link>
        <div>
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
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
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
