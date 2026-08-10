"use client";
import React from "react";

export default function HomeV2ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="relative h-36 w-full overflow-hidden bg-slate-100">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>

      <div className="space-y-2 p-3">
        <div className="h-3 w-full rounded-full bg-slate-100" />
        <div className="h-3 w-3/4 rounded-full bg-slate-100" />
        <div className="mt-2 h-3 w-16 rounded-full bg-slate-100" />
        <div className="h-8 w-full rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}
