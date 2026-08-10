"use client";
import React from "react";
import { Flame, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import HomeV2ProductCard from "./HomeV2ProductCard";
import HomeV2ProductSkeleton from "./HomeV2ProductSkeleton";
import type { Product } from "@/types/Product";

export default function HomeV2ProductGrid({
  trendingProducts,
  flashSaleProducts,
  filteredProducts,
  loading,
  handleAddToCart,
  t,
}: {
  trendingProducts: Product[];
  flashSaleProducts: Product[];
  filteredProducts: Product[];
  loading: boolean;
  handleAddToCart: (p: Product) => void;
  t: Record<string, string>;
}) {
  const router = useRouter();

  return (
    <>
      <section className="px-4 pb-3">
        <div className="grid gap-3">
          {flashSaleProducts.slice(0, 2).map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => router.push(`/product/${product.id}`)}
              className="overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#ff7a1a_0%,#ffb347_100%)] p-4 text-left text-white shadow-[0_16px_40px_rgba(249,115,22,0.2)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold">
                    <Flame size={12} />
                    {t.flash_sale || "Flash sale"}
                  </div>
                  <p className="mt-3 text-[15px] font-black leading-5">{product.name}</p>
                  <p className="mt-1 text-[12px] text-white/80">Limited offer for today</p>
                </div>
                <div className="rounded-2xl bg-white/20 px-3 py-2 text-[12px] font-semibold">
                  Up to 30%
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 pb-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-600">
              <TrendingUp size={11} />
              {t.trending_now || "Trending"}
            </div>
            <h2 className="mt-2 text-[18px] font-black text-slate-900">{t.best_selling_products || "Best selling"}</h2>
          </div>
          <button type="button" className="text-[12px] font-semibold text-slate-500">
            {t.view_all || "See all"}
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {trendingProducts.slice(0, 6).map((product) => (
            <div key={product.id} className="min-w-[150px] max-w-[150px]">
              <HomeV2ProductCard product={product} compact onAddToCart={handleAddToCart} t={t} />
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-black text-slate-900">{t.discover_products || "Discover Products"}</h2>
            <p className="text-[12px] text-slate-500">{t.curated_products_for_you || "Curated recommendations for you"}</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <HomeV2ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.slice(0, 8).map((product) => (
              <HomeV2ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} t={t} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
