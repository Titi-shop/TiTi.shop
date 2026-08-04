"use client";

type QuantitySelectorProps = {
  qty: string;

  quantity: number;

  maxStock: number;

  onQtyChange: (
    value: string
  ) => void;

  onIncrease: () => void;

  onDecrease: () => void;
};

export default function QuantitySelector({
  qty,
  quantity,
  maxStock,
  onQtyChange,
  onIncrease,
  onDecrease,
}: QuantitySelectorProps) {
  return (
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
  );
}
