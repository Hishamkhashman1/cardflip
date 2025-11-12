export default function PolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-4">
      <h1 className="text-3xl font-bold">Content policy</h1>
      <p>
        We are serious about staying free of trademarked names, logos, or likenesses. Every upload must be original and
        non-infringing. Automatic filters block known marks (e.g. Pokémon, Nintendo) and the mod team performs manual
        reviews.
      </p>
      <ol className="list-decimal space-y-2 pl-6 text-sm text-foreground/80">
        <li>Do not reference real brands, franchises, or characters.</li>
        <li>Only upload artwork and photography you created yourself.</li>
        <li>Explicit or hateful imagery is not allowed.</li>
        <li>We reserve the right to remove listings or accounts that violate these rules.</li>
      </ol>
      <p className="text-sm text-foreground/70">Need help? Email compliance@cardflip.local.</p>
    </div>
  );
}
