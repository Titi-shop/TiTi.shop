"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { formatPi } from "@/lib/pi";
import type { Product } from "@/types/Product";

export default function HomeV2ProductCard({
  product,
  onAddToCart,
  compact = false,
}: {
  product: Product;
  onAddToCart?: (p: Product) => void;
  t: Record<string, string>;
  compact?: boolean;
}) {
  const router = useRouter();

  function getMainImage(product: Product) {
    if (product.thumbnail && product.thumbnail.trim().length > 0) {
      return product.thumbnail;
    }

    return "/placeholder.png";
  }

  function getDiscount(product: Product) {
    const price = Number(product.price || 0);
    const final = Number(product.final_price ?? product.sale_price ?? product.price);

    if (price > final) {
      return Math.round(((price - final) / price) * 100);
    }

    return 0;
  }

  function formatUsd(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }

  const discount = getDiscount(product);
  const displayPrice = Number(product.final_price ?? product.sale_price ?? product.price);
  const originalPrice = Number(product.price || displayPrice);
  const piPrice = formatPi(displayPrice);

  return (
    <div
      onClick={() => router.push(`/product/${product.id}`)}
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 ${compact ? "min-h-[250px]" : "min-h-[280px]"}`}
    >
      <div className="relative aspect-[4/3] bg-slate-50">
        <Image src={getMainImage(product)} alt={product.name} fill sizes="(max-width:768px) 50vw,25vw" className="object-cover transition duration-500 group-hover:scale-105" />

        {discount > 0 && (
          <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
            -{discount}%
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
          }}
          className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/95 text-slate-700 shadow-sm"
        >
          <ShoppingCart size={16} />
        </button>

        <button
          type="button"
          className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/95 text-slate-700 shadow-sm"
          onClick={(event) => event.stopPropagation()}
        >
          <Heart size={16} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="line-clamp-2 text-[13px] font-semibold leading-5 text-slate-800">
          {product.name}
        </p>

        <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
          <Star size={11} className="fill-yellow-400 text-yellow-400" />
          <span>{Number(product.rating_avg ?? 0).toFixed(1)}</span>
          <span className="mx-1">•</span>
          <span>{product.sold ?? 0} sold</span>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              {originalPrice > displayPrice && (
                <p className="text-[11px] text-slate-400 line-through">{formatUsd(originalPrice)}</p>
              )}
              <p className="text-[15px] font-black text-slate-900">{formatUsd(displayPrice)}</p>
              <p className="text-[11px] font-semibold text-orange-600">{piPrice} π</p>
            </div>
            <div className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-600">
              New
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
