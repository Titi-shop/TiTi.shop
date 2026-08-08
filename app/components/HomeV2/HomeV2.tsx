"use client";
import React from "react";
import type { Product } from "@/types/Product";
import type { Category } from "@/types/category";
import HomeV2Hero from "./HomeV2Hero";
import HomeV2Categories from "./HomeV2Categories";
import HomeV2ProductGrid from "./HomeV2ProductGrid";

export default function HomeV2({
  categories,
  selectedCategory,
  setSelectedCategory,
  trendingProducts,
  flashSaleProducts,
  filteredProducts,
  loading,
  handleAddToCart,
  t,
  message,
}: {
  categories: Category[];
  selectedCategory: number | "all";
  setSelectedCategory: (v: number | "all") => void;
  trendingProducts: Product[];
  flashSaleProducts: Product[];
  filteredProducts: Product[];
  loading: boolean;
  handleAddToCart: (p: Product) => void;
  t: Record<string, string>;
  message: { text: string; type: "error" | "success" } | null;
}) {
  return (
    <main className="min-h-screen pb-28 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {message && (
        <div className={`fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-2xl px-5 py-3 text-sm font-medium shadow-2xl backdrop-blur-xl ${
          message.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}>
          {message.text}
        </div>
      )}

      <HomeV2Hero />

      <HomeV2Categories categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} t={t} />

      <HomeV2ProductGrid
        trendingProducts={trendingProducts}
        flashSaleProducts={flashSaleProducts}
        filteredProducts={filteredProducts}
        loading={loading}
        handleAddToCart={handleAddToCart}
        t={t}
      />
    </main>
  );
}
