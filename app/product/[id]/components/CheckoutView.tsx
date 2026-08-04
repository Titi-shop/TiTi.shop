"use client";

import AddressCard from "../cards/AddressCard";
import ShippingCard from "../cards/ShippingCard";
import ProductCard from "../cards/ProductCard";
import SummaryCard from "../cards/SummaryCard";
import CheckoutFooter from "../footer/CheckoutFooter";

import type { ShippingRate } from "@/types/Product";

import type {
  CheckoutItem,
  Message,
  ShippingInfo,
} from "@/types/checkout";

export interface PreviewData {
  buyer_zone?: string;
  shipping_zone?: string;
  shipping_fee?: number;
}

export interface CheckoutViewProps {
  t: Record<string, string>;

  shipping: ShippingInfo | null;

  loadingAddress: boolean;

  preview?: PreviewData;

  resolvedRegion: ShippingRate | null;

  item: CheckoutItem;

  qty: string;

  quantity: number;

  maxStock: number;

  total: number;

  message: Message | null;

  processing: boolean;

  onQtyChange: (
    value: string
  ) => void;

  onIncrease: () => void;

  onDecrease: () => void;

  onCheckout: () => void;

  onEditAddress: () => void;
}

export default function CheckoutView({
  t,
  shipping,
  loadingAddress,
  preview,
  resolvedRegion,
  item,
  qty,
  quantity,
  maxStock,
  total,
  message,
  processing,
  onQtyChange,
  onIncrease,
  onDecrease,
  onCheckout,
  onEditAddress,
}: CheckoutViewProps) {
  return (
  <>
    <div className="flex-1 overflow-y-auto p-4 space-y-4">

      <AddressCard
        t={t}
        shipping={shipping}
        loading={loadingAddress}
        onEdit={onEditAddress}
      />

      <ShippingCard
        t={t}
        shipping={shipping}
        preview={preview}
        resolvedRegion={resolvedRegion}
      />

      <ProductCard
        item={item}
        qty={qty}
        quantity={quantity}
        maxStock={maxStock}
        onQtyChange={onQtyChange}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
      />

      <SummaryCard
        t={t}
        total={total}
      />

    </div>

    <CheckoutFooter
      t={t}
      message={message}
      processing={processing}
      shipping={shipping}
      onCheckout={onCheckout}
    />
  </>
);
}
