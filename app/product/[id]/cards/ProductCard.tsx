"use client";

import Image from "next/image";

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

          <div
            className="
              mt-4
              flex
              items-center
              gap-2
            "
          >
            <button
              type="button"
              onClick={onDecrease}
              disabled={quantity <= 1}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-[var(--border-color)]
                disabled:opacity-40
              "
            >
              −
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
              className="
                h-9
                w-14
                rounded-lg
                border
                border-[var(--border-color)]
                bg-[var(--card-bg)]
                text-center
                outline-none
              "
            />

            <button
              type="button"
              onClick={onIncrease}
              disabled={
                quantity >= maxStock
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-[var(--border-color)]
                disabled:opacity-40
              "
            >
              +
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
