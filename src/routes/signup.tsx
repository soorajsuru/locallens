import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthFrame, Field } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up · LocalLens" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", city: "", password: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthFrame title="Join LocalLens" subtitle="Start with one city. Trust grows from there.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name">
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Maya Patel"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Home city">
          <input
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Lisbon"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </Field>
        <button
          type="submit"
          className="w-full gradient-ocean text-white text-sm font-medium py-2.5 rounded-md hover:opacity-95 transition"
        >
          Create account
        </button>
      </form>
      <p className="text-sm text-muted-foreground mt-6 text-center">
        Already a member?{" "}
        <Link to="/login" className="text-teal hover:underline">
          Log in
        </Link>
      </p>
    </AuthFrame>
  );
}
