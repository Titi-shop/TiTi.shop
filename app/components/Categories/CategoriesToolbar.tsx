"use client";
import React from "react";

export default function CategoriesToolbar({
  categories,
  selectedCategory,
  setSelectedCategory,
  sortType,
  setSortType,
  t,
}: {
  categories: Array<any>;
  selectedCategory: number | "all";
  setSelectedCategory: (v: number | "all") => void;
  sortType: "popular" | "sale" | "latest";
  setSortType: (v: "popular" | "sale" | "latest") => void;
  t: Record<string, string>;
}) {
  return (
    <section className="space-y-4 px-4 py-4 sm:px-6">
      <div className="rounded-[32px] border border-surface-2 bg-[var(--card-bg)] p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">{t.categories || "Categories"}</p>
            <p className="mt-2 text-sm text-[var(--foreground)]">
              {t.choose_your_category || "Choose a category to refine the list."}
            </p>
          </div>
          <div className="hidden rounded-3xl bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-muted)] sm:block">
            {t.swipe_horizontal || "Swipe horizontally on mobile"}
          </div>
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`min-w-[96px] rounded-3xl border px-4 py-3 text-left transition ${
              selectedCategory === "all"
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                : "border-transparent bg-[var(--surface)] text-[var(--foreground)]"
            }`}
          >
            <p className="text-sm font-semibold">{t.all || "All"}</p>
            <p className="text-xs text-[var(--text-muted)]">{t.view_all || "View all products"}</p>
          </button>

          {categories.map((category: any) => {
            const active = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`min-w-[96px] rounded-3xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "border-transparent bg-[var(--surface)] text-[var(--foreground)]"
                }`}
              >
                <p className="text-sm font-semibold">{t[category.key] || category.key}</p>
                <p className="text-xs text-[var(--text-muted)]">{category.count ?? ""}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[32px] border border-surface-2 bg-[var(--card-bg)] p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">{t.sort_by || "Sort by"}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {[
            { key: "popular", label: t.best_seller || "Best Seller" },
            { key: "sale", label: t.flash_sale || "Flash Sale" },
            { key: "latest", label: t.new_arrivals || "New" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSortType(item.key as any)}
              className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                sortType === item.key
                  ? "bg-[var(--color-primary)] text-white"
                  : "border border-surface-3 bg-[var(--surface)] text-[var(--foreground)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
