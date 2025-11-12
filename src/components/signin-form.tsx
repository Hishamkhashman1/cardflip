"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SignInForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
      callbackUrl,
    });
    setLoading(false);
    if (result?.error) {
      alert(result.error);
      return;
    }
    router.push(callbackUrl);
  }

  return (
    <div className="space-y-6 rounded-2xl border border-[var(--color-border)] bg-[color:var(--background)]/70 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-foreground/70">Welcome back, collector.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="space-y-1 text-sm">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="w-full rounded border border-[var(--color-border)] bg-transparent px-3 py-2"
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className="w-full rounded border border-[var(--color-border)] bg-transparent px-3 py-2"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[var(--color-accent-strong)] px-4 py-2 font-semibold text-white"
        >
          {loading ? "Signing in..." : "Continue"}
        </button>
      </form>
      {googleEnabled ? (
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full rounded-full border border-[var(--color-border)] px-4 py-2 text-sm"
        >
          Continue with Google
        </button>
      ) : null}
      <p className="text-sm text-foreground/70">
        Need an account? <Link href="/signup" className="underline">Sign up</Link>
      </p>
    </div>
  );
}
