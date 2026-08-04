"use client";

import type {
  Message,
  ShippingInfo,
} from "@/types/checkout";
import CheckoutMessage from "../shared/CheckoutMessage";
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
  

  return (
  <div
    className="p-4"
    style={{
      borderTop: "1px solid var(--nav-border)",
      background: "var(--card-bg)",
    }}
  >
    <CheckoutMessage
      message={message}
    />

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
