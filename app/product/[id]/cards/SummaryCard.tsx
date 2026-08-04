"use client";

import { formatPi } from "@/lib/pi";

type SummaryCardProps = {
  t: Record<string, string>;

  total: number;
};

export default function SummaryCard({
  t,
  total,
}: SummaryCardProps) {
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
      <div className="flex items-center justify-between">

        <span
          className="
            text-sm
            text-[var(--text-muted)]
          "
        >
          {t.total ?? "Total"}
        </span>

        <span
          className="
            text-xl
            font-bold
          "
          style={{
            color:
              "var(--color-primary)",
          }}
        >
          {formatPi(total)} π
        </span>

      </div>

      <div
        className="
          mt-2
          text-xs
          text-[var(--text-muted)]
        "
      >
        {t.total_includes_shipping ??
          "Total includes shipping fee (if applicable)."}
      </div>

    </div>
  );
}
