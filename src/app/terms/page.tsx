export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-4">
      <h1 className="text-3xl font-bold">Terms of use</h1>
      <p>
        CardFlip is a marketplace for original creature trading cards. By using the platform you agree to trade only
        assets that you created or have explicit rights to distribute. We remove anything that references third-party
        intellectual property.
      </p>
      <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-foreground/80">
        <li>Platform fee is 7.5% and charged automatically on each order.</li>
        <li>Sellers are responsible for packaging, shipping, and providing tracking within 3 business days.</li>
        <li>Buyers must confirm delivery or open a dispute within 72 hours of receipt.</li>
        <li>We use Stripe Connect for payouts. Failing to onboard with Stripe will block withdrawals.</li>
      </ul>
      <p className="text-sm text-foreground/70">
        TODO: Escrowed shipping labels + dispute mediation UI for the next iteration.
      </p>
    </div>
  );
}
