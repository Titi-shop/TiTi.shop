"use client";
import React from "react";

export default function CategoriesEmpty({ t }: { t: Record<string, string> }) {
  return (
    <div className="rounded-[32px] border border-surface-2 bg-[var(--card-bg)] p-8 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface)] text-3xl">
        🛒
      </div>
      <h2 className="mt-6 text-xl font-semibold text-[var(--foreground)]">{t.no_products || "No products found"}</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{t.try_different_keywords || "Try a different search or filter to discover more items."}</p>
    </div>
  );
}
