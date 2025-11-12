"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", handle: "", name: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!response.ok) {
      const body = await response.json();
      alert(body.error ?? "Failed to sign up");
      return;
    }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/listings/new");
  }

  return (
    <div className="space-y-6 rounded-2xl border border-[var(--color-border)] bg-[color:var(--background)]/70 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <p className="text-sm text-foreground/70">Start trading your own original creatures.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="space-y-1 text-sm">
          <span>Name</span>
          <input
            required
            className="w-full rounded border border-[var(--color-border)] bg-transparent px-3 py-2"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>Handle</span>
          <input
            required
            pattern="[A-Za-z0-9_]+"
            className="w-full rounded border border-[var(--color-border)] bg-transparent px-3 py-2"
            value={form.handle}
            onChange={(event) => setForm((prev) => ({ ...prev, handle: event.target.value }))}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>Email</span>
          <input
            type="email"
            required
            className="w-full rounded border border-[var(--color-border)] bg-transparent px-3 py-2"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>Password</span>
          <input
            type="password"
            required
            minLength={8}
            className="w-full rounded border border-[var(--color-border)] bg-transparent px-3 py-2"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[var(--color-accent-strong)] px-4 py-2 font-semibold text-white"
        >
          {loading ? "Creating..." : "Join CardFlip"}
        </button>
      </form>
      <p className="text-sm text-foreground/70">
        Already have an account? <Link href="/signin" className="underline">Sign in</Link>
      </p>
    </div>
  );
}
