type CartHeaderProps = {
  t: Record<string, string>;
  itemCount: number;
};

export default function CartHeader({
  t,
  itemCount,
}: CartHeaderProps) {
  return (
    <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-sm">
      <div className="flex items-end justify-between gap-3">
        <h1 className="text-xl font-bold">
          {t.cart ?? "Cart"}
        </h1>

        <p className="text-xs text-[var(--text-muted)]">
          {itemCount} {t.products ?? "Products"}
        </p>
      </div>
    </section>
  );
}
