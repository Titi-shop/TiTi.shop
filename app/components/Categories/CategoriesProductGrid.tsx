"use client";
import React from "react";
import CategoriesProductCard from "./CategoriesProductCard";
import CategoriesSkeleton from "./CategoriesSkeleton";
import CategoriesEmpty from "./CategoriesEmpty";
import type { Product } from "@/types/Product";

export default function CategoriesProductGrid({
  filteredProducts,
  loading,
  handleAddToCart,
  t,
}: {
  filteredProducts: Product[];
  loading: boolean;
  handleAddToCart: (e: React.MouseEvent, p: Product) => void;
  t: Record<string, string>;
}) {
  if (loading) {
  return (
    <section className="px-4 pb-8 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <CategoriesSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

if (filteredProducts.length === 0) {
  return <CategoriesEmpty t={t} />;
}

return (
  <section className="px-4 pb-8 sm:px-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {filteredProducts.map((product) => (
        <CategoriesProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          t={t}
        />
      ))}
    </div>
  </section>
);
}
