"use client";
import React from "react";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import BannerCarousel from "../BannerCarousel";
import PiPriceWidget from "../PiPriceWidget";
import { useTranslationClient as useTranslation } from "@/app/lib/i18n/client";

export default function HomeV2Hero() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <section className="px-4 pb-4 pt-4">
      <div className="rounded-[32px] border border-orange-100 bg-[linear-gradient(135deg,#fff9f2_0%,#ffffff_100%)] p-4 shadow-[0_24px_60px_rgba(249,115,22,0.12)]">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold text-orange-600">
            <Sparkles size={13} />
            {t.future_marketplace || "Future Marketplace"}
          </div>

          <button
            type="button"
            onClick={() => router.push("/categories")}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700"
          >
            {t.explore_now || "Explore"}
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <h1 className="text-[28px] font-black leading-[1.05] text-slate-900">
              Discover modern commerce.
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {t.smart_shopping_discovery || "Curated essentials, daily deals and trusted local sellers in one premium home screen."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white">
                Fast checkout
              </span>
              <span className="rounded-full bg-orange-50 px-3 py-1.5 text-[11px] font-semibold text-orange-600">
                New arrivals
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-600">
                Trend picks
              </span>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-100 bg-white/90 p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Pi Market
                </p>
                <p className="text-sm font-semibold text-slate-900">Live price & candles</p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/categories")}
                className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600"
              >
                View
                <ArrowRight size={14} />
              </button>
            </div>
            <PiPriceWidget />
          </div>
        </div>

        <div className="mt-4">
          <BannerCarousel />
        </div>
      </div>
    </section>
  );
}
