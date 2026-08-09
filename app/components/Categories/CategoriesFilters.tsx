"use client";
import React from "react";
import type { Category } from "@/types/category";

export default function CategoriesFilters({
  open,
  onClose,
  categories,
  selectedCategory,
  setSelectedCategory,
  sortType,
  setSortType,
  search,
  setSearch,
  t,
}: {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: number | "all";
  setSelectedCategory: (value: number | "all") => void;
  sortType: "popular" | "sale" | "latest";
  setSortType: (value: "popular" | "sale" | "latest") => void;
  search: string;
  setSearch: (value: string) => void;
  t: Record<string, string>;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-surface-2 bg-[var(--background)] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">{t.filters || "Filters"}</p>
            <h2 className="mt-2 text-2xl font-black text-[var(--foreground)]">{t.refine_search || "Refine your search"}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-surface-2 bg-[var(--card-bg)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--card-secondary)]"
          >
            {t.close || "Close"}
          </button>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="space-y-3 rounded-3xl border border-surface-2 bg-[var(--card-bg)] p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">{t.search || "Search"}</p>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search_placeholder || "Search products..."}
              className="w-full rounded-3xl border border-surface-3 bg-transparent px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>

          <div className="space-y-3 rounded-3xl border border-surface-2 bg-[var(--card-bg)] p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">{t.sort_by || "Sort by"}</p>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "popular", label: t.best_seller || "Best Seller" },
                { key: "sale", label: t.flash_sale || "Flash Sale" },
                { key: "latest", label: t.new_arrivals || "New" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSortType(item.key as any)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    sortType === item.key
                      ? "bg-[var(--color-primary)] text-white"
                      : "border border-surface-3 bg-[var(--card-bg)] text-[var(--foreground)]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-surface-2 bg-[var(--card-bg)] p-4">
          <p className="text-sm font-semibold text-[var(--foreground)]">{t.categories || "Categories"}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-4 py-2 text-sm transition ${
                selectedCategory === "all"
                  ? "bg-[var(--color-primary)] text-white"
                  : "border border-surface-3 bg-[var(--card-bg)] text-[var(--foreground)]"
              }`}
            >
              {t.all || "All"}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedCategory === category.id
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-surface-3 bg-[var(--card-bg)] text-[var(--foreground)]"
                }`}
              >
                {t[category.key] || category.key}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
