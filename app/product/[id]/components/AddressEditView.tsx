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

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[var(--nav-border)]
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

      <div className="flex-1 overflow-hidden">

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
