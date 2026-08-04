"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";
import { useTranslationClient as useTranslation } from "@/app/lib/i18n/client";
import type {
  CheckoutProps as Props,
  ShippingInfo,
  Message,
} from "@/types/checkout";

import {
  previewFetcher,
  fetchDefaultAddress,
} from "./checkout.api";

import {
  validateBeforePay,
  useCheckoutPay,
} from "./checkout.logic";
import CheckoutView from "./components/CheckoutView";
import AddressEditView from "./components/AddressEditView";
/* =========================================================
COMPONENT
========================================================= */

export default function CheckoutSheet({
  open,
  onClose,
  product,
}: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, piReady, pilogin } = useAuth();

  const processingRef = useRef(false);
  const autoPayRef = useRef(false);
  const messageTimerRef =
  useRef<NodeJS.Timeout | null>(null);
  /* ================= STATE ================= */

  const [shipping, setShipping] = useState<ShippingInfo | null>(null);
  const [view, setView] = useState<"checkout" | "address">("checkout");
  const [qty, setQty] = useState("1");
  const [message, setMessage] = useState<Message | null>(null);
  const showMessage = (
  text: string,
  type: Message["type"] = "info"
) => {
  if (messageTimerRef.current) {
    clearTimeout(messageTimerRef.current);
  }

  setMessage({
    text,
    type,
  });

  messageTimerRef.current =
    setTimeout(() => {
      setMessage(null);
      messageTimerRef.current = null;
    }, 3000);
};
  const [processing, setProcessing] = useState(false);
/* ================= WORKFLOW ================= */

const [loadingAddress, setLoadingAddress] =
  useState(false);

const [addressLoaded, setAddressLoaded] =
  useState(false);

const [autoPayAfterLogin, setAutoPayAfterLogin] =
  useState(false);
  
  /* ================= ITEM ================= */

  const item = useMemo(() => {
    if (!product) return null;

    const v = product.selectedVariant;

    const price =
      v?.final_price ??
      v?.sale_price ??
      v?.price ??
      product.final_price ??
      product.price;

    return {
      id: product.id,
      name: product.name,
      price,
      final_price: price,
      thumbnail: product.thumbnail || "/placeholder.png",
      stock: v?.stock ?? product.stock ?? 0,
    };
  }, [product]);

  const maxStock = Math.max(1, item?.stock ?? 0);

  const quantity = useMemo(() => {
    const n = Number(qty);
    return Number.isInteger(n) && n >= 1 && n <= maxStock ? n : 1;
  }, [qty, maxStock]);

  /* ================= SHIPPING ================= */

  const regions = useMemo(() => {
    return Array.isArray(product?.shipping_rates)
      ? product.shipping_rates
      : [];
  }, [product?.shipping_rates]);

 /* ================= LOAD ADDRESS ================= */

useEffect(() => {
  if (!open || !user) return;
  let cancelled = false;
  const loadAddress = async () => {
    setLoadingAddress(true);

    setAddressLoaded(false);

    try {
      const def = await fetchDefaultAddress();

      if (cancelled) return;

      if (def) {
        setShipping(def);

        showMessage(
    t.address_loaded ??
  "Shipping address loaded.",
  "success"
    );
      } else {
        setShipping(null);
        showMessage(
    t.please_add_shipping_address ??
  "Please add a shipping address.",
  "info"
    );
      }
    } finally {
      if (!cancelled) {
        setLoadingAddress(false);

        setAddressLoaded(true);
      }
    }
  };

  void loadAddress();

  return () => {
    cancelled = true;
  };
}, [open, user, t]);
  useEffect(() => {
  if (!open) {
    setView("checkout");
    autoPayRef.current = false;

    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
      messageTimerRef.current = null;
    }

    setMessage(null);
  }
}, [open]);
useEffect(() => {
  if (!open) return;
  setQty("1");
  setView("checkout");
}, [
  open,
  product?.id,
  product?.variant_id,
]);
  /* ================= PREVIEW ================= */

  const previewKey = useMemo(() => {
    if (!open || !shipping || !item) return null;

    return [
      "/api/orders/preview",
      shipping.id,
      quantity,
      item.id,
      product?.selectedVariant?.id ?? null,
    ];
  }, [open, shipping, quantity, item, product]);

  const { data: preview } = useSWR(
    previewKey,
    previewFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    }
  );

  const unitPrice = item?.final_price ?? 0;

  const total = useMemo(() => {
    if (preview?.total != null) return preview.total;
    return unitPrice * quantity;
  }, [preview?.total, unitPrice, quantity]);

  /* ================= RESOLVED REGION ================= */

  const resolvedRegion = useMemo(() => {
  const zone =  preview?.shipping_zone ??  preview?.buyer_zone;
  if (!zone) return null;
  return (
    regions.find((r) => r.zone === zone) ??
    null
  );
}, [
  preview?.shipping_zone,
  preview?.buyer_zone,
  regions,
]);

  /* ================= PAY ================= */

  const handlePay = useCheckoutPay({
  item,
  quantity,
  total,
  shipping,
  unitPrice,
  processing,
  setProcessing,
  processingRef,
  t,
  user,
  router,
  onClose,
  product,
  showMessage,
  validate: () =>
    validateBeforePay({
      user,
      piReady,
      shipping,
      item,
      quantity,
      maxStock,
      pilogin,
      showMessage: (text, type) => {
     if (!user) {
    setAutoPayAfterLogin(true);
    }

  showMessage(text, type);
},
      t,
    }),
});
  /* ================= START CHECKOUT ================= */

const startCheckout = () => {
  if (!user) {
    setAutoPayAfterLogin(true);
  }

  handlePay();
};
  /* ================= AUTO PAY AFTER LOGIN ================= */

useEffect(() => {
  if (!open) return;
  if (!user) return;
  if (!autoPayAfterLogin) return;
  if (!addressLoaded) return;
  if (!shipping) return;
  if (processingRef.current) return;
  if (autoPayRef.current) return;
  autoPayRef.current = true;
  setAutoPayAfterLogin(false);
  showMessage(
  t.continue_payment ??
    "Continuing payment...",
  "info"
);

  setTimeout(() => {
    handlePay();
  }, 400);

}, [
  open,
  user,
  shipping,
  addressLoaded,
  autoPayAfterLogin,
  handlePay,
  t,
]);
  /* ================= GUARD ================= */

  if (!open || !item) return null;

  /* =========================================================
  RENDER
  ========================================================= */

    return (
    <div className="fixed inset-0 z-[100]">

      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

   <div
  className={
    view === "address"
      ? "absolute inset-0 flex flex-col"
      : "absolute bottom-0 left-0 right-0 h-[65vh] rounded-t-2xl flex flex-col"
  }
  style={{
    background: "var(--card-bg)",
    color: "var(--foreground)",
    borderTop: "1px solid var(--nav-border)",
  }}
>
        {view === "address" ? (
          <AddressEditView
            shipping={shipping}
            t={t}
            onCancel={() => {
              setView("checkout");
            }}
            onSaved={(address) => {
              setShipping(address);
              setView("checkout");
            }}
          />
        ) : (
          <CheckoutView
            t={t}
            shipping={shipping}
            loadingAddress={loadingAddress}
            preview={preview}
            resolvedRegion={resolvedRegion}
            item={item}
            qty={qty}
            quantity={quantity}
            maxStock={maxStock}
            total={total}
            message={message}
            processing={processing}
            onQtyChange={setQty}
            onIncrease={() =>
              setQty(
                String(
                  Math.min(
                    maxStock,
                    quantity + 1
                  )
                )
              )
            }
            onDecrease={() =>
              setQty(
                String(
                  Math.max(
                    1,
                    quantity - 1
                  )
                )
              )
            }
            onCheckout={startCheckout}
            onEditAddress={() => {
              setView("address");
            }}
          />
        )}
      </div>
    </div>
  );
}
