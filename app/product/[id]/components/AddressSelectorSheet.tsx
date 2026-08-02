"use client";

import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";

import { apiAuthFetch } from "@/lib/api/apiAuthFetch";

import type { ShippingInfo } from "@/types/checkout";

type Props = {
  open: boolean;

  selectedId: string | null;

  onClose: () => void;

  onSelect: (address: ShippingInfo) => void;

  onAdd: () => void;

  onEdit: (address: ShippingInfo) => void;
};
export default function AddressSelectorSheet({
  open,
  selectedId,
  onClose,
  onSelect,
  onAdd,
  onEdit,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [addresses, setAddresses] =
    useState<ShippingInfo[]>([]);

  useEffect(() => {
    if (!open) return;

    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        const res =
          await apiAuthFetch(
            "/api/address"
          );

        if (!res.ok) {
          return;
        }

        const data =
          await res.json();

        if (!mounted) {
          return;
        }

        setAddresses(
          Array.isArray(
            data.addresses
          )
            ? data.addresses
            : []
        );
      } catch (err) {
        console.error(
          "[ADDRESS_SELECTOR]",
          err
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
      />

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          rounded-t-3xl
          bg-[var(--background)]
          p-4
          shadow-xl
          max-h-[80vh]
          overflow-y-auto
        "
      >
        <div className="mb-4 flex items-center justify-between">

          <h2 className="text-lg font-semibold">
            Shipping address
          </h2>

          <button
            type="button"
            onClick={onClose}
          >
            <X size={22} />
          </button>

        </div>

        <button
          type="button"
          onClick={onAdd}
          className="
            mb-4
            w-full
            rounded-xl
            border
            border-dashed
            p-3
            text-sm
            font-medium
          "
        >
          + Add new address
        </button>

        {loading && (
          <div className="py-10 text-center">
            Loading...
          </div>
        )}

        {!loading &&
          addresses.length === 0 && (
            <div className="py-10 text-center opacity-70">
              No address
            </div>
          )}

        {!loading &&
          addresses.map(
            (address) => (
              <button
                key={address.id}
                type="button"
                onClick={() =>
                  onSelect(address)
                }
                className="
                  mb-3
                  w-full
                  rounded-xl
                  border
                  p-4
                  text-left
                "
              >
                <div className="flex items-start justify-between">

                  <div>

                    <div className="font-semibold">
                      {address.name}
                    </div>

                    <div className="text-sm mt-1">
                      {address.phone}
                    </div>

                    <div className="mt-2 text-sm opacity-80">
                      {address.address_line}
                    </div>

                    <div className="text-sm opacity-70">
                      {[
                        address.ward,
                        address.district,
                        address.region,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>

                    <div className="text-sm opacity-70">
                      {address.country}
                    </div>

                  </div>

                  <div className="flex flex-col items-end gap-2">

                    {selectedId ===
                      address.id && (
                      <Check
                        size={20}
                        className="text-green-600"
                      />
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        onEdit(
                          address
                        );
                      }}
                      className="
                        text-sm
                        text-blue-600
                      "
                    >
                      Edit
                    </button>

                  </div>

                </div>

              </button>
            )
          )}
      </div>
    </>
  );
}
