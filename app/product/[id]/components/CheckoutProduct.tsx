"use client";

import Image from "next/image";

import { formatPi } from "@/lib/pi";

import type { CheckoutItem } from "@/types/checkout";

export interface CheckoutProductProps {
  item: CheckoutItem;

  qty: string;

  quantity: number;

  maxStock: number;

  total: number;

  onQtyChange: (
    value: string
  ) => void;

  onIncrease: () => void;

  onDecrease: () => void;
}

export default function CheckoutProduct({
  item,
  qty,
  quantity,
  maxStock,
  total,
  onQtyChange,
  onIncrease,
  onDecrease,
}: CheckoutProductProps) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src={
          item.thumbnail ??
          "/placeholder.png"
        }
        alt={item.name}
        width={64}
        height={64}
        className="h-16 w-16 rounded-lg object-cover"
        style={{
          border:
            "1px solid var(--nav-border)",
        }}
      />

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 font-medium">
          {item.name}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onDecrease}
            disabled={quantity <= 1}
            className="h-8 w-8 rounded-lg"
            style={{
              border:
                "1px solid var(--nav-border)",
              background:
                "var(--card-bg)",
            }}
          >
            -
          </button>

          <input
            type="text"
            inputMode="numeric"
            value={qty}
            onChange={(e) => {
              const value =
                e.target.value.replace(
                  /\D/g,
                  ""
                );

              if (
                value &&
                Number(value) >
                  maxStock
              ) {
                return;
              }

              onQtyChange(value);
            }}
            className="w-12 rounded-lg text-center"
            style={{
              border:
                "1px solid var(--nav-border)",
              background:
                "var(--card-bg)",
              color:
                "var(--foreground)",
            }}
          />

          <button
            type="button"
            onClick={onIncrease}
            disabled={
              quantity >= maxStock
            }
            className="h-8 w-8 rounded-lg"
            style={{
              border:
                "1px solid var(--nav-border)",
              background:
                "var(--card-bg)",
            }}
          >
            +
          </button>
        </div>

        <div
          className="mt-2 text-right font-bold"
          style={{
            color:
              "var(--color-primary)",
          }}
        >
          {formatPi(total)} π
        </div>
      </div>
    </div>
  );
}
