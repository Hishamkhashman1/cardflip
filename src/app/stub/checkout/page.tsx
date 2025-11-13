export default function StubCheckout({ searchParams }: { searchParams: { orderId?: string } }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4">
      <section className="panel glow-border space-y-4 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Test checkout</p>
        <h1 className="text-3xl font-bold">Stripe stub session</h1>
        <p className="text-sm text-[var(--muted)]">
          Stripe keys are not configured in this environment. Use this stub flow to simulate a successful payment, then update the order status manually to continue testing.
        </p>
        <div className="rounded-2xl border border-dashed border-[var(--color-border)]/60 bg-[color:var(--background)]/60 p-4 font-mono text-sm">
          Order ID: {searchParams.orderId ?? "unknown"}
        </div>
      </section>
      <section className="panel space-y-3 p-6 text-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Next steps</p>
        <ol className="space-y-2 text-[var(--muted)]">
          <li>1. Confirm the order exists in Prisma and remains in <strong>REQUIRES_PAYMENT</strong>.</li>
          <li>2. Mark the order as <strong>PAID</strong> or <strong>SHIPPED</strong> via the Orders dashboard or API.</li>
          <li>3. Continue the conversation inside the auto-created thread tied to this order.</li>
        </ol>
        <p className="text-xs text-[var(--muted)]">Replace this page with a real Checkout session + webhook handler in production.</p>
      </section>
    </div>
  );
}
