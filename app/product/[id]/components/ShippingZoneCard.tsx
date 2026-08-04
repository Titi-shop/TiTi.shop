"use client";

import { formatPi } from "@/lib/pi";

import { getCountryDisplay } from "../checkout.api";

import type { ShippingRate } from "@/types/Product";

export interface PreviewData {
  buyer_zone?: string;
  shipping_zone?: string;
  shipping_fee?: number;
}

interface ShippingZoneCardProps {
  t: Record<string, string>;

  shippingCountry?: string;

  preview?: PreviewData;

  resolvedRegion: ShippingRate | null;
}

export default function ShippingZoneCard({
  t,
  shippingCountry,
  preview,
  resolvedRegion,
}: ShippingZoneCardProps) {
  const zoneLabel = (
    region: ShippingRate
  ) => {
    if (region.zone === "domestic") {
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
            color: "var(--danger)",
          }}
        >
          {t.no_shipping_zone}
        </p>
      ) : (
        <>
          <div className="text-sm font-semibold">
            {zoneLabel(resolvedRegion)}
          </div>

          <div className="mt-1 text-xs opacity-70">
            {getCountryDisplay(
              shippingCountry
            )}{" "}
            ·{" "}
            {formatPi(
              preview?.shipping_fee ?? 0
            )}{" "}
            π
          </div>
        </>
      )}
    </div>
  );
}
