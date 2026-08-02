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
  onEdit,
  onChange,
}: AddressSectionProps) {
  if (loading) {
    return (
      <div className="rounded-xl border p-4 animate-pulse">
        <div className="h-4 w-40 rounded bg-gray-200" />
        <div className="mt-3 h-3 w-64 rounded bg-gray-200" />
        <div className="mt-2 h-3 w-48 rounded bg-gray-200" />
      </div>
    );
  }

  if (!shipping) {
    return (
      <div className="rounded-xl border p-4">
        <div className="font-semibold">
          {t.shipping_address ?? "Shipping address"}
        </div>

        <p className="mt-2 text-sm opacity-70">
          {t.no_shipping_address ?? "No shipping address"}
        </p>

        <button
          type="button"
          onClick={onAdd}
          className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          {t.add_address ?? "Add address"}
        </button>
      </div>
    );
  }

  return (
 <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4">

  <div className="flex items-center justify-between">

    <div className="flex items-center gap-2">
      <span>📍</span>

      <span className="text-sm font-semibold">
        {t.shipping_address ?? "Shipping address"}
      </span>
    </div>

    <button
      type="button"
      onClick={onChange}
      className="
        text-xs
        font-medium
        text-[var(--color-primary)]
      "
    >
      {t.change ?? "Change"}
    </button>

  </div>

  <div className="mt-3">

    <div className="text-sm font-medium">
      {shipping.name}
      <span className="mx-2 opacity-40">•</span>
      {shipping.phone}
    </div>

    <div
      className="
        mt-1
        text-xs
        leading-5
        text-[var(--text-muted)]
      "
    >
      {[
        shipping.address_line,
        shipping.ward,
        shipping.district,
        shipping.region,
        shipping.country,
      ]
        .filter(Boolean)
        .join(", ")}
    </div>

  </div>

</div>

      <button
        type="button"
        onClick={onEdit}
        className="mt-3 text-sm text-blue-600"
      >
        {t.edit ?? "Edit"}
      </button>
    </div>
  );
}
