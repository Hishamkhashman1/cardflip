import Link from "next/link";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "Catalog", href: "/" },
      { label: "Create listing", href: "/listings/new" },
      { label: "Orders", href: "/orders" },
      { label: "Messages", href: "/messages" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Content policy", href: "/policy" },
      { label: "Stripe powered", href: "https://stripe.com/connect", external: true },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)]/60 bg-[color:var(--background-alt)]/50 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr,1fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">CardFlip</p>
            <h2 className="text-lg font-semibold leading-tight">
              Trade original creature cards with transparent payouts and built-in compliance.
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Built for small-batch creators. No third-party IP. No hidden fees.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
              <span className="pill border-[var(--color-border)]">Stripe Connect ready</span>
              <span className="pill border-[var(--color-border)]">Manual moderation</span>
              <span className="pill border-[var(--color-border)]">Secure checkout</span>
            </div>
          </div>
          {footerLinks.map((column) => (
            <div key={column.heading} className="space-y-3 text-sm">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">{column.heading}</p>
              <ul className="space-y-2">
                {column.links.map((item) => (
                  <li key={item.label}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--color-foreground)] transition hover:text-[var(--color-accent-strong)]"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-[var(--color-foreground)] transition hover:text-[var(--color-accent-strong)]"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-dashed border-[var(--color-border)]/60 pt-6 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CardFlip. Crafted for the indie TCG community.</p>
          <p className="font-mono text-[0.75rem]">Platform fee locked at 7.5% · Support: compliance@cardflip.local</p>
        </div>
      </div>
    </footer>
  );
}
