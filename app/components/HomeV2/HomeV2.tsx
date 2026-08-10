"use client";
import React, { useState } from "react";
import { Bell, Home, LayoutGrid, Search, ShoppingBag, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("home");

  const handleNav = (nav: string, href: string) => {
    setActiveNav(nav);
    router.push(href);
  };

  return (
    <main className="min-h-screen bg-[#fffaf5] text-slate-900">
      {message && (
        <div
          className={`fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-2xl px-5 py-3 text-sm font-medium shadow-2xl backdrop-blur-xl ${
            message.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 px-4 pb-3 pt-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNav("home", "/")}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-sm"
              aria-label="Home"
            >
              <Home size={18} />
            </button>

            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <Search size={16} className="text-slate-400" />
              <span className="text-sm text-slate-400">{t.search_products || "Search products"}</span>
            </div>

            <button
              type="button"
              onClick={() => handleNav("notifications", "/notifications")}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600"
              aria-label="Notifications"
            >
              <Bell size={17} />
            </button>

            <button
              type="button"
              onClick={() => handleNav("cart", "/cart")}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600"
              aria-label="Cart"
            >
              <ShoppingBag size={17} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pb-24">
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
        </div>

        <nav className="sticky bottom-0 z-40 border-t border-slate-100 bg-white/95 px-3 py-2 backdrop-blur">
          <div className="grid grid-cols-[1fr_1fr_56px_1fr_1fr] items-center gap-2">
            <button
              type="button"
              onClick={() => handleNav("home", "/")}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold ${
                activeNav === "home" ? "bg-orange-50 text-orange-600" : "text-slate-500"
              }`}
            >
              <Home size={17} />
              <span>{t.home || "Home"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav("categories", "/categories")}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold ${
                activeNav === "categories" ? "bg-orange-50 text-orange-600" : "text-slate-500"
              }`}
            >
              <LayoutGrid size={17} />
              <span>{t.categories || "Categories"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav("search", "/search")}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_12px_28px_rgba(249,115,22,0.35)]"
            >
              <Search size={20} />
            </button>

            <button
              type="button"
              onClick={() => handleNav("notifications", "/notifications")}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold ${
                activeNav === "notifications" ? "bg-orange-50 text-orange-600" : "text-slate-500"
              }`}
            >
              <Bell size={17} />
              <span>{t.notifications || "Alerts"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav("profile", "/account")}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold ${
                activeNav === "profile" ? "bg-orange-50 text-orange-600" : "text-slate-500"
              }`}
            >
              <UserRound size={17} />
              <span>{t.profile || "Profile"}</span>
            </button>
          </div>
        </nav>
      </div>
    </main>
  );
}
