"use client";
import React from "react";

export default function CategoriesPagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void; }) {
  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(totalPages, page + 1));

  return (
    <div className="mt-8 flex flex-col items-center gap-3 rounded-[28px] border border-surface-2 bg-[var(--card-bg)] p-4 text-sm sm:flex-row sm:justify-between">
      <span className="text-[var(--text-muted)]">Page {page} / {totalPages}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={prev}
          disabled={page <= 1}
          className="rounded-full border border-surface-3 bg-[var(--surface)] px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={next}
          disabled={page >= totalPages}
          className="rounded-full border border-surface-3 bg-[var(--surface)] px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
