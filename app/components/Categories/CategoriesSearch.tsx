"use client";
import React from "react";

export default function CategoriesSearch({
  search,
  setSearch,
  onOpenFilters,
  t,
}: {
  search: string;
  setSearch: (s: string) => void;
  onOpenFilters: () => void;
  t: Record<string, string>;
}) {
  return (
    <section className="px-4 py-3 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <label htmlFor="categories-search" className="sr-only">
            {t.search_placeholder || "Search products..."}
          </label>
          <input
            id="categories-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search_placeholder || "Search products..."}
            className="w-full rounded-3xl border border-surface-2 bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        </div>

        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex items-center justify-center rounded-3xl border border-surface-2 bg-[var(--card-bg)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--color-primary)] hover:bg-[var(--card-secondary)]"
        >
          {t.filter || "Filter"}
        </button>
      </div>
    </section>
  );
}
