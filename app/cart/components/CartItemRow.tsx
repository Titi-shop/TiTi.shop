import Image from "next/image";
import Link from "next/link";

import { formatPi } from "@/lib/pi";
import type { CartItem } from "@/app/context/CartContext";

type CartItemRowProps = {
  item: CartItem;
  checked: boolean;
  t: Record<string, string>;
  onToggle: (id: string) => void;
  onDecrease: (id: string, quantity: number) => void;
  onIncrease: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

export default function CartItemRow({
  item,
  checked,
  t,
  onToggle,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemRowProps) {
  const unit =
    item.final_price ??
    item.sale_price ??
    item.price;

  const hasSale =
    Number.isFinite(item.final_price) &&
    item.final_price < item.price;

  const options = [
    item.option_1,
    item.option_2,
    item.option_3,
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <article className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-3 shadow-sm sm:p-4">
      <div className="flex gap-3">
        <div className="pt-8">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggle(item.id)}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
        </div>

        <Link
          href={`/product/${item.product_id}`}
          className="relative block shrink-0"
        >
          <Image
            src={item.thumbnail || "/placeholder.png"}
            alt={item.name}
            width={96}
            height={96}
            className="h-24 w-24 rounded-xl border border-[var(--nav-border)] object-cover"
          />

          {hasSale && (
            <div className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              SALE
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={`/product/${item.product_id}`}
            className="block"
          >
            <p className="line-clamp-2 text-sm font-semibold hover:text-orange-500">
              {item.name}
            </p>
          </Link>

          {options.length > 0 && (
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {options}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {hasSale && (
              <span className="text-xs text-muted line-through">
                π{formatPi(item.price)}
              </span>
            )}

            <span className="pi-price text-sm">
              π{formatPi(unit)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center overflow-hidden rounded-xl border border-[var(--nav-border)]">
              <button
                onClick={() =>
                  onDecrease(
                    item.id,
                    item.quantity - 1
                  )
                }
                disabled={item.quantity <= 1}
                className="h-11 min-w-11 bg-[var(--card-secondary)] px-3 text-lg disabled:opacity-30"
              >
                -
              </button>

              <div className="px-4 text-sm font-semibold">
                {item.quantity}
              </div>

              <button
                onClick={() =>
                  onIncrease(
                    item.id,
                    item.quantity + 1
                  )
                }
                className="h-11 min-w-11 bg-[var(--card-secondary)] px-3 text-lg"
              >
                +
              </button>
            </div>

            <div className="text-right">
              <p className="pi-price text-sm">
                π{formatPi(unit * item.quantity)}
              </p>
            </div>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="mt-2 text-xs text-red-500"
          >
            {t.delete ?? "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}
