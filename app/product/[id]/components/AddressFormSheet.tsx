"use client";

import { useEffect, useState } from "react";

import { X } from "lucide-react";

import { apiAuthFetch } from "@/lib/api/apiAuthFetch";

import type { ShippingInfo } from "@/types/checkout";

type Props = {
  open: boolean;

  address: ShippingInfo | null;

  onClose: () => void;

  onSaved: () => void;
};

export default function AddressFormSheet({
  open,
  address,
  onClose,
  onSaved,
}: Props) {
  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      phone: "",
      country: "",
      region: "",
      district: "",
      ward: "",
      address_line: "",
      postal_code: "",
    });

  useEffect(() => {
    if (!address) {
      setForm({
        name: "",
        phone: "",
        country: "",
        region: "",
        district: "",
        ward: "",
        address_line: "",
        postal_code: "",
      });

      return;
    }

    setForm({
      name: address.name,
      phone: address.phone,
      country: address.country,
      region: address.region,
      district: address.district ?? "",
      ward: address.ward ?? "",
      address_line: address.address_line,
      postal_code:
        address.postal_code ?? "",
    });
  }, [address]);

  if (!open) {
    return null;
  }

  async function save() {
    try {
      setSaving(true);

      const method =
        address ? "PUT" : "POST";

      const body = address
        ? {
            id: address.id,
            ...form,
          }
        : form;

      const res =
        await apiAuthFetch(
          "/api/address",
          {
            method,
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(body),
          }
        );

      if (!res.ok) {
        throw new Error();
      }

      onSaved();

      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-black/40"
        onClick={onClose}
      />

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-[71]
          rounded-t-3xl
          bg-[var(--background)]
          p-5
        "
      >
        <div className="mb-5 flex items-center justify-between">

          <h2 className="font-semibold text-lg">
            {address
              ? "Edit Address"
              : "Add Address"}
          </h2>

          <button
            onClick={onClose}
          >
            <X />
          </button>

        </div>

        {[
          "name",
          "phone",
          "country",
          "region",
          "district",
          "ward",
          "address_line",
          "postal_code",
        ].map((key) => (
          <input
            key={key}
            value={
              form[
                key as keyof typeof form
              ]
            }
            onChange={(e) =>
              setForm({
                ...form,
                [key]:
                  e.target.value,
              })
            }
            placeholder={key}
            className="
              mb-3
              w-full
              rounded-lg
              border
              p-3
            "
          />
        ))}

        <button
          disabled={saving}
          onClick={save}
          className="
            w-full
            rounded-xl
            bg-blue-600
            py-3
            text-white
          "
        >
          {saving
            ? "Saving..."
            : "Save"}
        </button>
      </div>
    </>
  );
}
