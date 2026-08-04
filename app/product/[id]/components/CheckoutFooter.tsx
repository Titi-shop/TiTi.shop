"use client";

import type {
  Message,
  ShippingInfo,
} from "@/types/checkout";

export interface CheckoutFooterProps {
  t: Record<string, string>;

  message: Message | null;

  processing: boolean;

  shipping: ShippingInfo | null;

  onCheckout: () => void;
}

export default function CheckoutFooter({
  t,
  message,
  processing,
  shipping,
  onCheckout,
}: CheckoutFooterProps) {
  const background =
    message?.type === "success"
      ? "rgba(34,197,94,.15)"
      : message?.type === "info"
      ? "rgba(59,130,246,.15)"
      : message?.type === "error"
      ? "rgba(239,68,68,.15)"
      : "rgba(107,114,128,.15)";

  const color =
    message?.type === "success"
      ? "var(--success)"
      : message?.type === "info"
      ? "var(--info)"
      : message?.type === "error"
      ? "var(--danger)"
      : "var(--foreground)";

  return (
    <div
      className="p-4"
      style={{
        borderTop: "1px solid var(--nav-border)",
        background: "var(--card-bg)",
      }}
    >
      {message && (
        <div
          role="alert"
          className="mb-3 rounded-xl px-4 py-3 text-sm"
          style={{
            background,
            color,
          }}
        >
          {message.text}
        </div>
      )}

      <button
        type="button"
        onClick={onCheckout}
        disabled={processing || !shipping}
        className="
          w-full
          rounded-xl
          py-3
          font-bold
          text-white
          transition-all
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
        style={{
          background: "var(--color-primary)",
        }}
      >
        {processing
          ? t.processing ?? "Processing..."
          : t.pay_now ?? "Pay Now"}
      </button>
    </div>
  );
}
