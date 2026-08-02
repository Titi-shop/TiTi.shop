"use client";

import { useEffect, useState } from "react";

import AddressForm, {
  type AddressFormData,
} from "@/components/address/AddressForm";

import type {
  ShippingInfo,
} from "@/types/checkout";
import {
  createAddress,
  updateAddress,
  setDefaultAddress,
} from "../checkout.api";
type AddressEditorProps = {
  shipping: ShippingInfo | null;
  t: Record<string, string>;
  onCancel: () => void;
  onSaved: (
    address: ShippingInfo
) => void;
};

export default function AddressEditor({
  shipping,
  onCancel,
  onSaved,
}: AddressEditorProps) {
  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState<AddressFormData>({
      full_name: "",
      phone: "",
      country: "",
      region: "",
      district: "",
      ward: "",
      address_line: "",
      postal_code: "",
    });

  useEffect(() => {
    if (!shipping) {
      return;
    }

    setForm({
  full_name: shipping.name,
  phone: shipping.phone,
  country: shipping.country,
  region: shipping.region,
  district: shipping.district ?? "",
  ward: shipping.ward ?? "",
  address_line: shipping.address_line,
  postal_code: shipping.postal_code ?? "",
});
  }, [shipping]);

  const handleSubmit = async () => {
  setSaving(true);

  try {
    const payload = {
      ...(shipping?.id
        ? { id: shipping.id }
        : {}),

      full_name: form.full_name,
      phone: form.phone,

      country: form.country,

      region: form.region,
      district: form.district,
      ward: form.ward,

      address_line: form.address_line,

      postal_code:
        form.postal_code || null,

      label: "home" as const,
    };

    const saved = shipping?.id
      ? await updateAddress(payload)
      : await createAddress(payload);

    if (!shipping?.id) {
      await setDefaultAddress(saved.id);
    }

    onSaved(saved);

  } catch (err) {
    console.error(
      "[ADDRESS SAVE]",
      err
    );
  } finally {
    setSaving(false);
  }
};

  return (
    <div
      className="
        rounded-2xl
        border
        border-[var(--border-color)]
        bg-[var(--card-bg)]
        overflow-hidden
      "
    >
      <AddressForm
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        saving={saving}
      />

      <div
        className="
          border-t
          border-[var(--border-color)]
          p-4
        "
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="
            w-full
            rounded-xl
            border
            px-4
            py-3
          "
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
