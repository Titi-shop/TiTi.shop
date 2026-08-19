import type { Product } from "@/types/Product";

export function getMainImage(product: Product) {
  if (
    product.thumbnail &&
    product.thumbnail.trim().length > 0
  ) {
    return product.thumbnail;
  }

  return "/placeholder.png";
}

export function getDiscount(product: Product) {
  const price = Number(product.price || 0);

  const final = Number(
    product.final_price ??
      product.sale_price ??
      product.price
  );

  if (price > final) {
    return Math.round(
      ((price - final) / price) * 100
    );
  }

  return 0;
}
