"use client";

import AddressEditor from "./AddressEditor";

import type {
  ShippingInfo,
} from "@/types/checkout";

type AddressEditViewProps = {
  shipping: ShippingInfo | null;

  t: Record<string, string>;

  onCancel: () => void;

  onSaved: (
    address: ShippingInfo
  ) => void;
};

export default function AddressEditView({
  shipping,
  t,
  onCancel,
  onSaved,
}: AddressEditViewProps) {
  return (
    <div className="flex h-full flex-col">

      {/* Header */}
      <div
        className="
          sticky
          top-0
          z-10
          border-b
          border-[var(--nav-border)]
          bg-[var(--card-bg)]
          px-4
          py-3
        "
      >
        <h2 className="text-base font-semibold">
          {shipping
            ? t.edit_address ??
              "Edit Address"
            : t.add_address ??
              "Add Address"}
        </h2>
      </div>

      {/* Content */}
      <div
        className="
          flex-1
          overflow-y-auto
          p-4
        "
      >
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
