"use client";

import type {
  Message,
} from "@/types/checkout";

type CheckoutMessageProps = {
  message: Message | null;
};

export default function CheckoutMessage({
  message,
}: CheckoutMessageProps) {
  if (!message) {
    return null;
  }

  const background =
    message.type === "success"
      ? "rgba(34,197,94,.15)"
      : message.type === "info"
      ? "rgba(59,130,246,.15)"
      : message.type === "error"
      ? "rgba(239,68,68,.15)"
      : "rgba(107,114,128,.15)";

  const color =
    message.type === "success"
      ? "var(--success)"
      : message.type === "info"
      ? "var(--info)"
      : message.type === "error"
      ? "var(--danger)"
      : "var(--foreground)";

  return (
    <div
      role="alert"
      className="
        mb-3
        rounded-xl
        px-4
        py-3
        text-sm
      "
      style={{
        background,
        color,
      }}
    >
      {message.text}
    </div>
  );
}
