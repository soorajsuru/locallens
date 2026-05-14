import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in · LocalLens" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // UI-only scaffold — wire to Lovable Cloud auth later.
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthFrame title="Welcome back" subtitle="Pick up where your trip left off.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="you@somewhere.com"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="••••••••"
          />
        </Field>
        <button
          type="submit"
          className="w-full gradient-ocean text-white text-sm font-medium py-2.5 rounded-md hover:opacity-95 transition"
        >
          Log in
        </button>
      </form>
      <p className="text-sm text-muted-foreground mt-6 text-center">
        New here?{" "}
        <Link to="/signup" className="text-teal hover:underline">
          Create an account
        </Link>
      </p>
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
          <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-4">From a friend in Jaipur</p>
          <p className="text-2xl font-display leading-snug max-w-sm">
            "Skip Chokhi Dhani if it's just one night — too touristy. Try LMB on MI Road, ground floor only."
          </p>
          <p className="text-sm text-white/70 mt-4">— Aarav, on LocalLens · 2 hours ago</p>
        </div>
        <p className="text-xs text-white/60">© LocalLens</p>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-display text-primary">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1.5 mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-foreground/80 mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
