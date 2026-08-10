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
    <section className="px-4 pb-3">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-black text-slate-900">{t.categories || "Categories"}</h2>
          <p className="text-[12px] text-slate-500">{t.shop_by_category || "Shop by category"}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`rounded-[22px] border p-3 text-center transition-all duration-200 ${
            selectedCategory === "all"
              ? "border-orange-200 bg-orange-50 shadow-sm"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${selectedCategory === "all" ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"}`}>
            <span className="text-[20px]">🛍️</span>
          </div>
          <p className={`mt-2 text-[11px] font-semibold ${selectedCategory === "all" ? "text-orange-600" : "text-slate-600"}`}>
            {t.all || "All"}
          </p>
        </button>

        {categories.map((category) => {
          const active = Number(selectedCategory) === Number(category.id);

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(Number(category.id))}
              className={`rounded-[22px] border p-3 text-center transition-all duration-200 ${
                active ? "border-orange-200 bg-orange-50 shadow-sm" : "border-slate-200 bg-white"
              }`}
            >
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${active ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                <span className="text-[20px]">{category.icon}</span>
              </div>
              <p className={`mt-2 text-[11px] font-semibold leading-4 ${active ? "text-orange-600" : "text-slate-600"}`}>
                {t[category.key] || category.key}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
