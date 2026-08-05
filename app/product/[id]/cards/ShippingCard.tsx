"use client";

import { formatPi } from "@/lib/pi";

import {
  getCountryDisplay,
} from "../checkout.api";

import type {
  ShippingRate,
} from "@/types/Product";

import type {
  ShippingInfo,
} from "@/types/checkout";

import type {
  PreviewData,
} from "../components/CheckoutView";

type ShippingCardProps = {
  t: Record<string, string>;
  shipping: ShippingInfo | null;
 preview: PreviewData | undefined;
  resolvedRegion: ShippingRate | null;
};

export default function ShippingCard({
  t,
  shipping,
  preview,
  resolvedRegion,
}: ShippingCardProps) {
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
    <div
      className="
        rounded-2xl
        border
        border-[var(--border-color)]
        bg-[var(--card-bg)]
        p-4
      "
    >
      <div className="flex items-center gap-2">

        <span className="text-lg">
          🌍
        </span>

        <span className="font-semibold">
          {t.shipping_zone ??
            "Shipping Zone"}
        </span>

      </div>

      {!resolvedRegion ? (
        <p
          className="
            mt-3
            text-sm
          "
          style={{
            color:
              "var(--danger)",
          }}
        >
          {t.no_shipping_zone ??
            "Shipping unavailable"}
        </p>
      ) : (
        <>
          <div
            className="
              mt-3
              font-medium
            "
          >
            {zoneLabel(
              resolvedRegion
            )}
          </div>

          <div
            className="
              mt-1
              text-sm
              text-[var(--text-muted)]
            "
          >
            {getCountryDisplay(
              shipping?.country
            )}

            {" · "}

            {formatPi(
              preview?.shipping_fee ??
                0
            )}{" "}
            π
          </div>
        </>
      )}
    </div>
  );
}
