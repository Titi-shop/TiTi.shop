"use client";
import React from "react";
import HomeV2ProductCard from "./HomeV2ProductCard";
import HomeV2ProductSkeleton from "./HomeV2ProductSkeleton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TrendingUp, Flame } from "lucide-react";
import { formatPi } from "@/lib/pi";
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

  function getMainImage(product: Product) {
    if (product.thumbnail && product.thumbnail.trim().length > 0) {
      return product.thumbnail;
    }

    return "/placeholder.png";
  }

  return (
    <>
      <section className="mt-3 px-0">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-[2px] text-[9px] font-semibold text-orange-600">
              <TrendingUp size={11} />
              {t.trending_now || "Trending"}
            </div>

            <h2 className="mt-1 text-sm font-bold">{t.best_selling_products || "Best selling"}</h2>
          </div>

          <button className="text-[10px] text-[var(--text-muted)]">{t.view_all || "View"}</button>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1">
          {trendingProducts.map((product) => (
            <div key={product.id} className="min-w-[170px] max-w-[170px]">
              <HomeV2ProductCard product={product} compact onAddToCart={handleAddToCart} t={t} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-2 px-1 relative z-10">
        <div className="rounded-2xl bg-gradient-to-r from-red-600 via-orange-500 to-red-500 text-white p-3 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-[11px]">
                <Flame size={12} />
                {t.flash_sale}
              </div>

              <h2 className="mt-1 text-sm font-bold">{t.limited_time_deals}</h2>
            </div>

            <button onClick={() => router.push("")} className="text-[11px] bg-white/20 px-3 py-1 rounded-lg">
              {t.view}
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-2 -mx-1 px-1 snap-x snap-mandatory scroll-smooth" style={{ WebkitOverflowScrolling: "touch" }}>
            {flashSaleProducts.map((product) => (
              <div key={product.id} onClick={() => router.push(`/product/${product.id}`)} className="min-w-[130px] flex-shrink-0 rounded-xl bg-white text-black overflow-hidden shadow-sm snap-start active:scale-[0.97] transition cursor-pointer">
                <Image src={getMainImage(product)} alt={product.name} width={300} height={300} className="h-24 w-full object-cover" />

                <div className="p-2">
                  <p className="text-[11px] line-clamp-2">{product.name}</p>

                  <p className="mt-1 text-sm font-bold text-red-500">{formatPi(product.final_price || product.price)} π</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-2 px-0">
        <div className="px-4 mb-5">
          <h2 className="text-2xl font-black">{t.discover_products || "Discover Products"}</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{t.curated_products_for_you || "Curated products for you"}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-[3px] px-1">{Array.from({ length: 8 }).map((_, i) => (<HomeV2ProductSkeleton key={i} />))}</div>
        ) : (
          <div className="grid grid-cols-2 gap-[6px] px-1">{filteredProducts.map((product) => (<HomeV2ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} t={t} />))}</div>
        )}
      </section>
    </>
  );
}
