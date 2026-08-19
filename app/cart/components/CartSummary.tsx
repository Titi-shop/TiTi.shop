import { formatPi } from "@/lib/pi";

type CartSummaryProps = {
  t: Record<string, string>;
  total: number;
  selectedCount: number;
  canCheckout: boolean;
  onCheckout: () => void;
  compact?: boolean;
};

export default function CartSummary({
  t,
  total,
  selectedCount,
  canCheckout,
  onCheckout,
  compact = false,
}: CartSummaryProps) {
  return (
    <section
      className={`rounded-2xl border border-[var(--nav-border)] bg-[var(--card-bg)] shadow-sm ${
        compact ? "p-3" : "p-5"
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted)]">
            {t.total ?? "Total"}
          </span>
          <span className="pi-price text-xl">
            π{formatPi(total)}
          </span>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          {selectedCount} {t.products ?? "Products"}
        </p>
      </div>

      <button
        onClick={onCheckout}
        className="mt-4 w-full rounded-xl bg-primary py-3 font-bold text-white"
      >
        {canCheckout
          ? (t.pay_now ?? "Checkout")
          : (t.login_to_checkout ??
            "Login to Checkout")}
      </button>
    </section>
  );
}
