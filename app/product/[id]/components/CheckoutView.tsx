"use client";

import Image from "next/image";
import AddressSection from "./AddressSection";
import CheckoutFooter from "./CheckoutFooter";
import { formatPi } from "@/lib/pi";
import { getCountryDisplay } from "../checkout.api";
import type { ShippingRate } from "@/types/Product";

import type {
  CheckoutItem,
  ShippingInfo,
} from "@/types/checkout";

export interface PreviewData {
  buyer_zone?: string;
  shipping_zone?: string;
  shipping_fee?: number;
}

export interface CheckoutViewProps {
  t: Record<string, string>;

  shipping: ShippingInfo | null;

  loadingAddress: boolean;

  preview?: PreviewData;

  resolvedRegion: ShippingRate | null;

  item: CheckoutItem;

  qty: string;

  quantity: number;

  maxStock: number;

  total: number;

  message: Message | null;

  processing: boolean;

  onQtyChange: (
    value: string
  ) => void;

  onIncrease: () => void;

  onDecrease: () => void;

  onCheckout: () => void;

  onEditAddress: () => void;
}

export default function CheckoutView({
  t,

  shipping,

  loadingAddress,

  preview,

  resolvedRegion,

  item,

  qty,

  quantity,

  maxStock,

  total,

  message,

  processing,

  onQtyChange,

  onIncrease,

  onDecrease,

  onCheckout,

  onEditAddress,
}: CheckoutViewProps) {
  const zoneLabel = (
    region: ShippingRate
  ) => {
    if (
      region.zone === "domestic"
    ) {
      return `${t.domestic_country ?? "Domestic"} (${region.domestic_country_code ?? "—"})`;
    }

    return (
      t[
        `shipping_${region.zone}` as keyof typeof t
      ] ?? region.zone
    );
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        <AddressSection
  shipping={shipping}
  loading={loadingAddress}
  t={t}
  onAdd={onEditAddress}
  onEdit={onEditAddress}
  onChange={onEditAddress}
/>
        <div
          className="rounded-xl p-3"
          style={{
            border:
              "1px solid var(--nav-border)",
            background:
              "var(--card-bg)",
          }}
        >
          <p className="mb-2 font-medium">
            🌍 {t.shipping_zone}
          </p>

          {!resolvedRegion ? (
            <p
              className="text-sm"
              style={{
                color:
                  "var(--danger)",
              }}
            >
              {t.no_shipping_zone}
            </p>
          ) : (
            <>
              <div className="font-semibold text-sm">
                {zoneLabel(
                  resolvedRegion
                )}
              </div>

              <div className="mt-1 text-xs opacity-70">
                {getCountryDisplay(
                  shipping?.country
                )}{" "}
                ·{" "}
                {formatPi(
                  preview?.shipping_fee ??
                    0
                )}{" "}
                π
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">

          <Image
            src={
              item.thumbnail ??
              "/placeholder.png"
            }
            alt={item.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-lg object-cover"
            style={{
              border:
                "1px solid var(--nav-border)",
            }}
          />

          <div className="flex-1">

            <p className="font-medium line-clamp-2">
              {item.name}
            </p>

            <div className="mt-2 flex items-center gap-2">

              <button
                type="button"
                onClick={onDecrease}
                disabled={
                  quantity <= 1
                }
                className="w-8 h-8 rounded-lg"
                style={{
                  border:
                    "1px solid var(--nav-border)",
                  background:
                    "var(--card-bg)",
                }}
              >
                -
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
                className="w-12 rounded-lg text-center"
                style={{
                  border:
                    "1px solid var(--nav-border)",
                  background:
                    "var(--card-bg)",
                  color:
                    "var(--foreground)",
                }}
              />

              <button
                type="button"
                onClick={onIncrease}
                disabled={
                  quantity >=
                  maxStock
                }
                className="w-8 h-8 rounded-lg"
                style={{
                  border:
                    "1px solid var(--nav-border)",
                  background:
                    "var(--card-bg)",
                }}
              >
                +
              </button>
                      
             </div>

        <div
  className="mt-2 text-right font-bold"
  style={{
    color:
      "var(--color-primary)",
  }}
>
  {formatPi(total)} π
</div>

            </div>

          </div>

        </div>

      </div>

           <CheckoutFooter
        t={t}
        message={message}
        processing={processing}
        shipping={shipping}
        onCheckout={onCheckout}
      />
    </>
  );
}


