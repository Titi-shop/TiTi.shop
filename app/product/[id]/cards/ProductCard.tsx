"use client";

import Image from "next/image";
import QuantitySelector from "../shared/QuantitySelector";
type ProductCardProps = {
  item: {
    name: string;
    thumbnail?: string;
  };

  qty: string;

  quantity: number;

  maxStock: number;

  onQtyChange: (
    value: string
  ) => void;

  onIncrease: () => void;

  onDecrease: () => void;
};

export default function ProductCard({
  item,
  qty,
  quantity,
  maxStock,
  onQtyChange,
  onIncrease,
  onDecrease,
}: ProductCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[var(--border-color)]
        bg-[var(--card-bg)]
        p-4
      "
    >
      <div className="flex gap-3">

        <Image
          src={
            item.thumbnail ??
            "/placeholder.png"
          }
          alt={item.name}
          width={72}
          height={72}
          className="
            h-[72px]
            w-[72px]
            rounded-xl
            object-cover
          "
        />

                <div className="flex-1">

          <p className="font-medium leading-5">
            {item.name}
          </p>

          <QuantitySelector
            qty={qty}
            quantity={quantity}
            maxStock={maxStock}
            onQtyChange={onQtyChange}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />

        </div>

      </div>
    </div>
  );
}
