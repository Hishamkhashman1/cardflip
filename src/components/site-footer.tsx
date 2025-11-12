import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[color:var(--background)]/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm md:flex-row md:items-center md:justify-between">
        <p className="text-foreground/70">
          © {new Date().getFullYear()} CardFlip — community marketplace for original creature trading cards.
        </p>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:text-[var(--color-accent-strong)]">
            Terms
          </Link>
          <Link href="/policy" className="hover:text-[var(--color-accent-strong)]">
            Content policy
          </Link>
          <a
            href="https://stripe.com/connect"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--color-accent-strong)]"
          >
            Stripe powered
          </a>
        </div>
      </div>
    </footer>
  );
}
