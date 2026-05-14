import { SignUp } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";
import { AuthFrame } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up · LocalLens" }] }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <AuthFrame title="Join LocalLens" subtitle="Start with one city. Trust grows from there.">
      <SignUp path="/signup" signInUrl="/login" forceRedirectUrl="/dashboard" />
    </AuthFrame>
  );
}
