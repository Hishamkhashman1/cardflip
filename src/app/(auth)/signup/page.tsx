import { SignUpForm } from "@/components/signup-form";

export const metadata = { title: "Join CardFlip" };

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <SignUpForm />
    </div>
  );
}
