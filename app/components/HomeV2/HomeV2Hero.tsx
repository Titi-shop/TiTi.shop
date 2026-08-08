"use client";
import React from "react";
import BannerCarousel from "../BannerCarousel";
import PiPriceWidget from "../PiPriceWidget";
import { ChevronRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslationClient as useTranslation } from "@/app/lib/i18n/client";

export default function HomeV2Hero() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <section className="relative w-full overflow-hidden border-b-4 border-orange-500 bg-gradient-to-br from-black via-gray-900 to-orange-600 px-5 pb-10 pt-6 text-white">
      <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-red-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-orange-400/30" />

      <div className="relative z-10">
        <BannerCarousel />

        <div className="mt-3 flex justify-center">
          <PiPriceWidget />
        </div>

        <div className="mt-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold backdrop-blur-xl">
            <Sparkles size={14} />
            {t.future_marketplace || "Future Marketplace"}
          </div>

          <h1 className="mt-5 max-w-xl text-4xl font-black leading-tight">
            {t.discover_modern_products || "Discover modern commerce experiences"}
          </h1>

          <p className="mt-4 max-w-md text-sm text-white/80">
            {t.smart_shopping_discovery ||
              "Trending products, curated collections and next generation shopping."}
          </p>

          <button
            onClick={() => router.push("/categories")}
            className="mt-6 flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black shadow-lg active:scale-95 transition"
          >
            {t.explore_now || "Explore Now"}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
