"use client";

export default function CategoriesSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-surface-2 bg-[var(--card-bg)] shadow-sm">
      <div className="relative h-56 overflow-hidden bg-surface-3">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded-full bg-surface-2" />
        <div className="h-4 w-1/2 rounded-full bg-surface-2" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-10 rounded-2xl bg-surface-2" />
          <div className="h-10 rounded-2xl bg-surface-2" />
        </div>
      </div>
    </div>
  );
}
