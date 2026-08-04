"use client";

import AddressEditor from "./AddressEditor";

import type { ShippingInfo } from "@/types/checkout";

export interface AddressEditViewProps {
  shipping: ShippingInfo | null;

  t: Record<string, string>;

  onCancel: () => void;

  onSaved: (
    address: ShippingInfo
  ) => void;
}

export default function AddressEditView({
  shipping,
  t,
  onCancel,
  onSaved,
}: AddressEditViewProps) {
  return (
    <div
      className="
        flex
        h-full
        flex-col
      "
      style={{
        background: "var(--card-bg)",
        color: "var(--foreground)",
      }}
    >
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          p-4
        "
        style={{
          borderColor:
            "var(--nav-border)",
        }}
      >
        <h2 className="text-lg font-semibold">
          {shipping
            ? t.edit_address ??
              "Edit Address"
            : t.add_address ??
              "Add Address"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AddressEditor
          shipping={shipping}
          t={t}
          onCancel={onCancel}
          onSaved={onSaved}
        />
      </div>
    </div>
  );
}
