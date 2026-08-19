import Link from "next/link";

type CartEmptyStateProps = {
  t: Record<string, string>;
};

export default function CartEmptyState({
  t,
}: CartEmptyStateProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4">
      <div className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--card-secondary)] text-2xl">
          🛒
        </div>

        <p className="mb-4 text-[var(--text-muted)]">
          {t.empty_cart ?? "Cart is empty"}
        </p>

        <Link
          href="/"
          className="inline-flex rounded-xl bg-primary px-5 py-2.5 font-semibold text-white"
        >
          {t.back_to_shop ?? "Back to shop"}
        </Link>
      </div>
    </main>
  );
}
