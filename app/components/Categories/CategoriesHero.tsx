"use client";
import type { ReactNode } from "react";

export default function CategoriesHero({ count, t }: { count: number; t: Record<string, string> }) {
  return (
    <section className="px-2 pt-1">
      <div className="overflow-hidden rounded-[24px] p-5 text-white" style={{ background: `linear-gradient(135deg, var(--hero-from), var(--hero-via), var(--hero-to))` }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-xl">
              <span className="">✨</span>
              {t.smart_catalog || "Smart Catalog"}
            </div>

            <h1 className="mt-3 text-2xl font-black leading-tight">{t.explore_categories || "Explore Categories"}</h1>

            <p className="mt-3 max-w-sm text-sm text-white/70">{t.find_products_fast || "Find products faster with category filters and smart discovery."}</p>
          </div>

          <div className="shrink-0 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-center backdrop-blur-md">
            <p className="text-lg font-black leading-none">{count}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-white/70">{t.products || "Products"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
