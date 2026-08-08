"use client";
import React from "react";
import type { Category } from "@/types/category";

export default function HomeV2Categories({
  categories,
  selectedCategory,
  setSelectedCategory,
  t,
}: {
  categories: Category[];
  selectedCategory: number | "all";
  setSelectedCategory: (v: number | "all") => void;
  t: Record<string, string>;
}) {
  return (
    <section className="mt-3 px-3">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold leading-tight">{t.categories || "Categories"}</h2>
          <p className="text-[10px] text-[var(--text-muted)]">{t.shop_by_category || "Shop by category"}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex min-w-[72px] flex-col items-center gap-1.5 rounded-xl px-2 py-2 transition-all duration-200 ${
            selectedCategory === "all" ? "scale-[1.03] shadow-md" : ""
          }`}
          style={{
            background: selectedCategory === "all" ? "var(--color-primary)" : "var(--card-bg)",
            border: selectedCategory === "all" ? "2px solid var(--color-primary)" : "1px solid var(--nav-border)",
          }}
        >
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ background: selectedCategory === "all" ? "rgba(255,255,255,0.15)" : "var(--card-secondary)" }}
          >
            <span className="text-[22px]">🛍️</span>
          </div>

          <span
            className="text-[10px] font-medium text-center leading-tight"
            style={{ color: selectedCategory === "all" ? "#fff" : "var(--foreground)" }}
          >
            {t.all || "All"}
          </span>
        </button>

        {categories.map((category) => {
          const active = Number(selectedCategory) === Number(category.id);

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(Number(category.id))}
              className={`flex min-w-[72px] flex-col items-center gap-1.5 rounded-xl px-2 py-2 transition-all duration-200 ${
                active ? "scale-[1.03] shadow-md" : ""
              }`}
              style={{
                background: active ? "var(--color-primary)" : "var(--card-bg)",
                border: active ? "2px solid var(--color-primary)" : "1px solid var(--nav-border)",
              }}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: active ? "rgba(255,255,255,0.15)" : "var(--card-secondary)" }}
              >
                <span className="text-[22px]">{category.icon}</span>
              </div>

              <span
                className="line-clamp-2 text-center text-[10px] font-medium leading-tight"
                style={{ color: active ? "#fff" : "var(--foreground)" }}
              >
                {t[category.key] || category.key}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
