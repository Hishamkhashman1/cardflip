export default function StubCheckout({ searchParams }: { searchParams: { orderId?: string } }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-4">
      <h1 className="text-3xl font-bold">Test checkout</h1>
      <p>
        Stripe keys are not configured, so this stub simulates a successful payment. Confirm the flow manually and then
        mark the order as paid in your database or via tests.
      </p>
      <p className="rounded border border-[var(--color-border)] bg-[color:var(--background)]/70 p-4">
        Order ID: {searchParams.orderId ?? "unknown"}
      </p>
      <p className="text-sm text-foreground/70">TODO: Replace with real Checkout session + webhooks.</p>
    </div>
  );
}
