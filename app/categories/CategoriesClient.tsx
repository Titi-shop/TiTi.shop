"use client";

import { useState, type MouseEvent } from "react";

import { useCart } from "@/app/context/CartContext";
import { useTranslationClient as useTranslation } from "@/app/lib/i18n/client";
import type { Product } from "@/types/Product";
import useCategories from "./hooks/useCategories";
import CategoriesSearch from "../components/Categories/CategoriesSearch";
import CategoriesHero from "../components/Categories/CategoriesHero";
import CategoriesMessage from "../components/Categories/CategoriesMessage";
import CategoriesToolbar from "../components/Categories/CategoriesToolbar";
import CategoriesProductGrid from "../components/Categories/CategoriesProductGrid";

export default function CategoriesClient() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const {
    categories,
    filteredProducts,
    loading,
    search,
    selectedCategory,
    sortType,
    setSearch,
    setSelectedCategory,
    setSortType,
  } = useCategories();

  const showMessage = (text: string, type: "success" | "error" = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2500);
  };

  const handleAddToCart = (e: MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.is_active) {
      showMessage(t.product_unavailable || "Product unavailable");
      return;
    }

    const hasVariant = Boolean(product.has_variants) || (product.variants?.length ?? 0) > 0;

    if (hasVariant) {
      showMessage(t.please_select_variant ?? "Please select variant");
      return;
    }

    const isOutOfStock = !product.is_unlimited && (product.stock ?? 0) <= 0;

    if (isOutOfStock) {
      showMessage(t.out_of_stock ?? "Out of stock");
      return;
    }

    addToCart({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      sale_price: product.final_price || product.sale_price,
      final_price: product.final_price ?? product.sale_price ?? product.price,
      quantity: 1,
      thumbnail: product.thumbnail,
    });

    showMessage(t.added_to_cart || "Added to cart", "success");
  };

  return (
  <main className="min-h-screen pb-28 bg-[var(--background)] text-[var(--foreground)] transition-colors">
    {message && <CategoriesMessage message={message} />}

    <CategoriesSearch
      search={search}
      setSearch={setSearch}
      t={t}
    />


    <CategoriesHero
      count={filteredProducts.length}
      t={t}
    />

    <CategoriesToolbar
      categories={categories}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      sortType={sortType}
      setSortType={setSortType}
      t={t}
    />

    <CategoriesProductGrid
      filteredProducts={filteredProducts}
      loading={loading}
      handleAddToCart={handleAddToCart}
      t={t}
    />

  </main>
);
}
