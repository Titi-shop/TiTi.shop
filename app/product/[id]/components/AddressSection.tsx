"use client";

import type { ShippingInfo } from "@/types/checkout";

type AddressSectionProps = {
  shipping: ShippingInfo | null;
  loading: boolean;
  t: Record<string, string>;

  onAdd: () => void;
  onChange: () => void;
};

export default function AddressSection({
  shipping,
  loading,
  t,
  onAdd,
  onChange,
}: AddressSectionProps) {
  if (loading) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-[var(--border-color)]
          bg-[var(--card-bg)]
          p-4
          animate-pulse
        "
      >
        <div className="h-4 w-36 rounded bg-[var(--surface-3)]" />
        <div className="mt-3 h-3 w-52 rounded bg-[var(--surface-3)]" />
        <div className="mt-2 h-3 w-full rounded bg-[var(--surface-3)]" />
      </div>
    );
  }

  if (!shipping) {
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
        <div className="flex items-center justify-between">
          <div className="font-semibold">
            📍 {t.shipping_address ?? "Shipping address"}
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="
              rounded-lg
              bg-[var(--color-primary)]
              px-3
              py-1.5
              text-xs
              font-medium
              text-white
            "
          >
            {t.add ?? "Add"}
          </button>
        </div>

        <p className="mt-3 text-sm text-[var(--text-muted)]">
          {t.no_shipping_address ??
            "Please add a shipping address"}
        </p>
      </div>
    );
  }

  const fullAddress = [
    shipping.address_line,
    shipping.ward,
    shipping.district,
    shipping.region,
    shipping.country,
  ]
    .filter(Boolean)
    .join(", ");

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
      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 flex-1 gap-3">

          <div className="text-lg">
            📍
          </div>

          <div className="min-w-0 flex-1">

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-2
                gap-y-1
              "
            >
              <span className="font-semibold">
                {shipping.name}
              </span>

              <span className="text-xs opacity-40">
                •
              </span>

              <span className="text-sm text-[var(--text-muted)]">
                {shipping.phone}
              </span>
            </div>

            <div
              className="
                mt-1
                text-sm
                leading-5
                text-[var(--text-muted)]
                break-words
              "
            >
              {fullAddress}
            </div>

          </div>
        </div>

        <button
          type="button"
          onClick={onChange}
          className="
            shrink-0
            text-sm
            font-medium
            text-[var(--color-primary)]
          "
        >
          {t.change ?? "Change"}
        </button>

      </div>
    </div>
  );
}
