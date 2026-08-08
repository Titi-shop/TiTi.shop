"use client";
import React from "react";

export default function HomeV2ProductSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-44 w-full relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      <div className="p-2 space-y-2">
        <div className="h-3 w-full bg-surface-2 rounded animate-pulse" />
        <div className="h-3 w-3/4 bg-surface-2 rounded animate-pulse" />

        <div className="flex items-center gap-2 mt-2">
          <div className="h-3 w-12 bg-surface-2 rounded animate-pulse" />
          <div className="h-3 w-16 bg-surface-2 rounded animate-pulse" />
        </div>

        <div className="h-4 w-20 bg-surface-2 rounded animate-pulse mt-2" />
      </div>
    </div>
  );
}
