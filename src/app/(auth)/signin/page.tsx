import { SignInForm } from "@/components/signin-form";
import { env } from "@/env";

export const metadata = { title: "Sign in — CardFlip" };

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <SignInForm googleEnabled={Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)} />
    </div>
  );
}
