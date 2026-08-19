"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import type { CheckoutProduct } from "@/types/checkout";
import { useTranslationClient as useTranslation } from "@/app/lib/i18n/client";
import CheckoutSheet from "@/app/product/[id]/CheckoutSheet";
import { apiAuthFetch } from "@/lib/api/apiAuthFetch";

import CartHeader from "./components/CartHeader";
import CartItemRow from "./components/CartItemRow";
import CartSummary from "./components/CartSummary";
import CartEmptyState from "./components/CartEmptyState";
import CartSkeleton from "./components/CartSkeleton";

export default function CartPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const {
    cart,
    loading,
    updateQty,
    removeFromCart,
  } = useCart();

  const [selectedIds, setSelectedIds] = useState<
    string[]
  >([]);
  const [openCheckout, setOpenCheckout] =
    useState(false);
  const [checkoutItem, setCheckoutItem] =
    useState<CheckoutProduct | null>(null);
  const [message, setMessage] = useState<
    string | null
  >(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const selectedItems = useMemo(() => {
    return cart.filter((i) =>
      selectedIds.includes(i.id)
    );
  }, [cart, selectedIds]);

  const total = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      const unit =
        item.final_price ??
        item.sale_price ??
        item.price;

      return sum + unit * item.quantity;
    }, 0);
  }, [selectedItems]);

  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const validate = () => {
    if (selectedItems.length !== 1) {
      showMessage(
        t.only_one_product_supported ??
          "Select 1 product"
      );
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!validate()) return;

    if (!user) {
      showMessage(
        t.login_required ??
          "Please login before checkout."
      );
      return;
    }

    const item = selectedItems[0];

    if (!item) {
      showMessage("No item selected for checkout.");
      return;
    }

    const res = await apiAuthFetch(
      `/api/products/${item.product_id}`
    );

    if (!res.ok) {
      showMessage("Cannot load product");
      return;
    }

    const product = await res.json();
    const selectedVariant =
      product.variants?.find(
        (v: { id: string }) =>
          v.id === item.variant_id
      ) ?? null;

    setCheckoutItem({
      ...product,
      selectedVariant,
      quantity: item.quantity,
      stock:
        selectedVariant?.stock ??
        product.stock,
      price:
        selectedVariant?.price ??
        product.price,
      sale_price:
        selectedVariant?.sale_price ??
        product.sale_price,
      final_price:
        selectedVariant?.final_price ??
        product.final_price,
    });

    setOpenCheckout(true);
  };

  if (authLoading || loading) {
    return <CartSkeleton />;
  }

  if (cart.length === 0) {
    return <CartEmptyState t={t} />;
  }

  return (
    <main className="min-h-screen bg-[var(--background)] pb-40">
      {message && (
        <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-xl border border-[var(--nav-border)] bg-[var(--card-bg)] px-4 py-2 text-sm text-[var(--foreground)] shadow-lg">
          {message}
        </div>
      )}

      <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4">
        <div className="mb-4">
          <CartHeader
            t={t}
            itemCount={cart.length}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="space-y-3">
            {cart.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                checked={selectedIds.includes(
                  item.id
                )}
                t={t}
                onToggle={toggleItem}
                onDecrease={(
                  id,
                  quantity
                ) =>
                  updateQty(id, quantity)
                }
                onIncrease={(
                  id,
                  quantity
                ) =>
                  updateQty(id, quantity)
                }
                onRemove={removeFromCart}
              />
            ))}
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <CartSummary
                t={t}
                total={total}
                selectedCount={
                  selectedItems.length
                }
                canCheckout={Boolean(user)}
                onCheckout={handleCheckout}
              />
            </div>
          </aside>
        </div>
      </div>

      <div
        className="
          fixed bottom-16 left-0 right-0
          border-t bg-[var(--card-bg)] p-3 lg:hidden
        "
        style={{
          borderColor: "var(--nav-border)",
        }}
      >
        <div className="mx-auto w-full max-w-6xl">
          <CartSummary
            t={t}
            total={total}
            selectedCount={selectedItems.length}
            canCheckout={Boolean(user)}
            onCheckout={handleCheckout}
            compact
          />
        </div>
      </div>

      {checkoutItem && (
        <CheckoutSheet
          open={openCheckout}
          onClose={() => setOpenCheckout(false)}
          product={checkoutItem}
        />
      )}
    </main>
  );
}
