"use client";
import React from "react";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { formatPi } from "@/lib/pi";
import Link from "next/link";
import type { Product } from "@/types/Product";

export default function CategoriesProductCard({
  product,
  onAddToCart,
  t,
}: {
  product: Product;
  onAddToCart: (e: React.MouseEvent, p: Product) => void;
  t: Record<string, string>;
}) {
  function getImage(src?: string | null) {
    if (!src) return "/placeholder.png";
    return src;
  }

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group overflow-hidden rounded-[28px] border border-surface-2 bg-[var(--card-bg)] shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative overflow-hidden">
          <Image src={getImage(product.thumbnail)} alt={product.name} width={500} height={500} className="aspect-[4/3] w-full object-cover" />

          {product.sale_price && product.sale_price < product.price && (
            <div className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">{t.sale || "Sale"}</div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="text-xs uppercase tracking-[0.24em] text-white/70">{t.quick_view || "Quick view"}</p>
          </div>

          <button
            onClick={(e) => onAddToCart(e, product)}
            className="absolute right-3 bottom-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/90 text-[var(--foreground)] shadow-lg transition hover:bg-[var(--color-primary)] hover:text-white"
            aria-label={t.add_to_cart || "Add to cart"}
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        <div className="space-y-3 p-4">
          <h3 className="line-clamp-2 text-base font-semibold text-[var(--foreground)]">{product.name}</h3>

          <div className="grid gap-2 text-[13px] text-[var(--text-muted)] sm:grid-cols-2">
            <span className="inline-flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              {Number(product.rating_avg ?? 0).toFixed(1)}
            </span>
            <span>
              {t.sold || "Sold"}: <span className="font-semibold text-[var(--foreground)]">{product.sold ?? 0}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div>
              <p className="text-lg font-black text-[var(--color-primary)]">
                {formatPi(product.final_price || product.sale_price || product.price)} π
              </p>
              {product.sale_price && product.sale_price < product.price && (
                <p className="text-xs line-through text-[var(--text-muted)]">
                  {formatPi(product.price)} π
                </p>
              )}
            </div>

            <div className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
              {product.favorite_count ?? 0} ♥
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
