import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

const requireAuth = createServerFn().handler(async () => {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    throw redirect({ to: "/login" });
  }

  return { userId };
});

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => await requireAuth(),
  component: AppShell,
});
