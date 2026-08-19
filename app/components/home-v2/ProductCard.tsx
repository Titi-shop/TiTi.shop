"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Star,
} from "lucide-react";

import { formatPi } from "@/lib/pi";
import type { Product } from "@/types/Product";

import {
  getDiscount,
  getMainImage,
} from "./helpers";

export default function ProductCard({
  product,
  onAddToCart,
  t,
  compact = false,
}: {
  product: Product;
  onAddToCart?: (p: Product) => void;
  t: Record<string, string>;
  compact?: boolean;
}) {
  const router = useRouter();

  return (
    <div
      onClick={() =>
        router.push(`/product/${product.id}`)
      }
      className={`
    card
    flex flex-col
    overflow-hidden
    active:scale-[0.98]
    cursor-pointer
    ${compact ? "h-[270px]" : "h-[320px]"}
  `}
    >
      {/* IMAGE */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-2">
        <Image
          src={getMainImage(product)}
          alt={product.name}
          fill
          sizes="(max-width:768px) 50vw,25vw"
          className="
      object-cover
      transition-transform
      duration-500
    "
        />

        {/* SALE */}
        {getDiscount(product) > 0 && (
          <div
            className="
      absolute
      right-2
      top-2
      rounded-full
      bg-red-600
      px-2
      py-1
      text-[10px]
      font-bold
      text-white
    "
          >
            -{getDiscount(product)}%
          </div>
        )}

        {/* ADD TO CART */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
          }}
          className="
      absolute
      bottom-2
      right-2
      flex
      h-9
      w-9
      items-center
      justify-center
      rounded-xl
      shadow-lg
      active:scale-95
    "
          style={{
            background:
              "rgba(255,255,255,.95)",
            color:
              "var(--foreground)",
          }}
        >
          <ShoppingCart size={18} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-2">
        {/* NAME */}
        <p className="min-h-[34px] text-[13px] font-semibold leading-snug line-clamp-2">
          {product.name}
        </p>

        {/* META */}
        <div
          className="
    mt-2
    flex
    items-center
    gap-2
    text-[10px]
  "
          style={{
            color:
              "var(--text-muted)",
          }}
        >
          <span className="flex items-center gap-1">
            <Star
              size={11}
              className="
        fill-yellow-400
        text-yellow-400
      "
            />

            {Number(
              product.rating_avg ?? 0
            ).toFixed(1)}
          </span>

          <span>
            ❤️ {product.favorite_count ?? 0}
          </span>

          <span>
            👁️ {product.views ?? 0}
          </span>

          <span>
            🛒 {product.sold ?? 0}
          </span>
        </div>

        {/* PRICE */}
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <p className="text-sm font-black text-primary">
              {formatPi(
                product.final_price ||
                  product.price
              )}{" "}
              π
            </p>

            {product.sale_price && (
              <p className="text-[10px] text-[var(--text-muted)] line-through">
                {formatPi(product.price)} π
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
