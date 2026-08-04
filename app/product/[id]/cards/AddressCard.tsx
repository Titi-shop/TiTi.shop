"use client";

import { countries } from "@/data/countries";

import type {
  ShippingInfo,
} from "@/types/checkout";

type AddressCardProps = {
  t: Record<string, string>;

  shipping: ShippingInfo | null;

  loading: boolean;

  onEdit: () => void;
};

export default function AddressCard({
  t,
  shipping,
  loading,
  onEdit,
}: AddressCardProps) {
  if (loading) {
    return (
      <div
        className="
          animate-pulse
          rounded-2xl
          border
          border-[var(--border-color)]
          bg-[var(--card-bg)]
          p-4
        "
      >
        <div className="h-4 w-40 rounded bg-gray-200/60" />

        <div className="mt-3 h-3 w-56 rounded bg-gray-200/60" />

        <div className="mt-2 h-3 w-full rounded bg-gray-200/60" />
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
            onClick={onEdit}
            className="
              rounded-xl
              bg-[var(--color-primary)]
              px-3
              py-2
              text-sm
              font-medium
              text-white
            "
          >
            {t.add_address ?? "Add"}
          </button>

        </div>

        <p className="mt-3 text-sm text-[var(--text-muted)]">
          {t.no_shipping_address ??
            "Please add a shipping address"}
        </p>
      </div>
    );
  }

  const country = countries.find(
    (item) =>
      item.code === shipping.country
  );

  const fullAddress = [
    shipping.address_line,
    shipping.ward,
    shipping.district,
    shipping.region,
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
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <span className="text-lg">
            📍
          </span>

          <span className="font-semibold">
            {t.shipping_address ??
              "Shipping address"}
          </span>

        </div>

        <button
          type="button"
          onClick={onEdit}
          className="
            text-sm
            font-medium
            text-[var(--color-primary)]
          "
        >
          {t.change ?? "Change"}
        </button>

      </div>

      <div
        className="
          mt-3
          flex
          flex-wrap
          items-center
          gap-2
        "
      >
        <span className="font-semibold">
          {shipping.name}
        </span>

        <span className="opacity-40">
          •
        </span>

        <span className="text-sm">
          {shipping.phone}
        </span>
      </div>

      <div
        className="
          mt-2
          text-sm
          leading-5
          text-[var(--text-muted)]
        "
      >
        {fullAddress}
      </div>

      <div
        className="
          mt-2
          flex
          flex-wrap
          items-center
          gap-x-4
          gap-y-1
          text-xs
          text-[var(--text-muted)]
        "
      >
        <span>
          {country?.flag ?? "🌍"}{" "}
          {country?.name ??
            shipping.country}
        </span>

        {shipping.postal_code && (
          <span>
            ZIP: {shipping.postal_code}
          </span>
        )}
      </div>

    </div>
  );
}
