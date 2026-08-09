"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";

import type { Product } from "@/types/Product";
import type { Category } from "@/types/category";
import { fetcher, filterProducts } from "../helpers/categories.helpers";

export default function useCategories() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [sortType, setSortType] = useState<"popular" | "sale" | "latest">("popular");

  const { data: productsData, isLoading: loadingProducts } = useSWR<Product[]>("/api/products", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });

  const { data: categoriesData, isLoading: loadingCategories } = useSWR<Category[]>("/api/categories", fetcher, {
    revalidateOnFocus: false,
  });

  const products = useMemo(() => productsData || [], [productsData]);
  const categories = useMemo(() => categoriesData || [], [categoriesData]);
  const filteredProducts = useMemo(
    () => filterProducts(products, selectedCategory, search, sortType),
    [products, selectedCategory, search, sortType]
  );

  return {
    categories,
    filteredProducts,
    loading: loadingProducts || loadingCategories,
    search,
    selectedCategory,
    sortType,
    setSearch,
    setSelectedCategory,
    setSortType,
  };
}
