"use client";
export const dynamic = "force-dynamic";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import HomeV2 from "./components/HomeV2/HomeV2";
import SplashScreen from "./components/SplashScreen";

import { useCart } from "@/app/context/CartContext";
import { useTranslationClient as useTranslation } from "@/app/lib/i18n/client";
import type { Product } from "@/types/Product";
import type { Category } from "@/types/category";

/* =========================================================
   FETCHER
========================================================= */

const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("FETCH_FAILED");
  }

  return res.json() as Promise<T>;
};

/* =========================================================
   PAGE
========================================================= */

export default function HomePage() {
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const [showSplash, setShowSplash] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState<number | "all">("all");

  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  /* =========================================================
     DATA
  ========================================================= */

  const {
    data: productsData,
    isLoading: loadingProducts,
  } = useSWR<Product[]>("/api/products", fetcher);

  const {
    data: categoriesData,
    isLoading: loadingCategories,
  } = useSWR<Category[]>("/api/categories", fetcher);

  const products = useMemo(() => productsData ?? [], [productsData]);
  const categories = useMemo(() => categoriesData ?? [], [categoriesData]);

  const trendingProducts = useMemo(
    () => [...products].sort((a, b) => b.sold - a.sold).slice(0, 8),
    [products]
  );

  const flashSaleProducts = useMemo(
    () => products.filter((p) => p.sale_price).slice(0, 10),
    [products]
  );

  const loading = loadingProducts || loadingCategories;

  /* =========================================================
     EFFECTS
  ========================================================= */

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("splash_seen");

    if (!hasSeenSplash) {
      setShowSplash(true);

      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("splash_seen", "1");
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, []);

  /* =========================================================
     MESSAGE
  ========================================================= */

  const showMessage = (text: string, type: "error" | "success" = "error") => {
    setMessage({ text, type });

    setTimeout(() => {
      setMessage(null);
    }, 2500);
  };

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }

    return products.filter((p) => Number(p.category_id) === Number(selectedCategory));
  }, [products, selectedCategory]);

  /* =========================================================
     CART
  ========================================================= */

  const handleAddToCart = (product: Product) => {
    if (!product.is_active) {
      showMessage(t.product_unavailable || "Product unavailable");
      return;
    }

    const hasVariant =
      Boolean(product.has_variants) ||
      (product.variants?.length ?? 0) > 0 ||
      (product.options?.size?.length ?? 0) > 0;

    if (hasVariant) {
      showMessage(t.please_select_variant || "Please select size");
      return;
    }

    const isOutOfStock = !product.is_unlimited && (product.stock ?? 0) <= 0;

    if (isOutOfStock) {
      showMessage(t.out_of_stock || "Out of stock");
      return;
    }

    addToCart({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      final_price: product.final_price ?? product.sale_price ?? product.price,
      sale_price: product.final_price || product.sale_price,
      quantity: 1,
      thumbnail: product.thumbnail,
    });

    showMessage(t.added_to_cart || "Added to cart", "success");
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (showSplash || (loading && products.length === 0)) {
    return <SplashScreen />;
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <HomeV2
      categories={categories}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      trendingProducts={trendingProducts}
      flashSaleProducts={flashSaleProducts}
      filteredProducts={filteredProducts}
      loading={loading}
      handleAddToCart={handleAddToCart}
      t={t}
      message={message}
    />
  );
}
