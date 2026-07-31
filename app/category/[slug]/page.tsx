"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslationClient as useTranslation } from "@/app/lib/i18n/client";

type Category = {
  id: number | string;
  name: string;
};

type Product = {
  id: number | string;
  name: string;
  price: number;
  finalPrice?: number;
  isSale?: boolean;
  images?: string[];
  categoryId: number | string;
  createdAt: string;
};

export default function CategoryDetailPage() {
  const { t } = useTranslation();
  const params = useParams<{ slug: string }>();
  const categoryId = Number(params.slug);

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Number.isNaN(categoryId)) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const resProducts = await fetch("/api/products", { cache: "no-store" });
        if (!resProducts.ok) throw new Error("API products lỗi");

        const allProducts: Product[] = await resProducts.json();

        const filtered = allProducts
          .filter((p) => Number(p.categoryId) === categoryId)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );

        setProducts(filtered);

        const resCate = await fetch("/api/categories", { cache: "no-store" });
        if (!resCate.ok) throw new Error("API categories lỗi");

        const categories: Category[] = await resCate.json();
        const cate = categories.find(
          (c) => Number(c.id) === categoryId
        );

        setCategory(cate || null);
      } catch (err) {
                console.error("❌ Lỗi tải danh mục:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [categoryId]);

  const categoryKey = "category_" + categoryId;
  const categoryName =
    (t as Record<string, string>)[categoryKey] ||
    category?.name ||
    t["category"] ||
    "Category";

  return (
    <main className="p-4 max-w-6xl mx-auto">
      {/* BACK */}
      <Link
        href="/categories"
        className="text-orange-600 font-bold text-lg inline-block mb-4"
      >
        ←
      </Link>

      {/* CATEGORY TITLE */}
      <h1 className="text-2xl font-bold mb-4 text-orange-600">
        {categoryName}
      </h1>

      {loading ? (
        <p className="text-gray-600">
          {t["loading"] || "Loading..."}
        </p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">
          {t["no_product"] || "No products available."}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="border p-2 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <img
                src={p.images?.[0] || "/placeholder.png"}
                className="w-full h-32 object-cover rounded"
              />

              <h3 className="font-semibold text-sm mt-2 line-clamp-2">
                {p.name}
              </h3>

              {p.isSale && typeof p.finalPrice === "number" ? (
                <>
                  <p className="text-red-600 font-bold">
                    {p.finalPrice.toLocaleString()} π
                  </p>
                  <p className="text-xs line-through text-gray-400">
                    {p.price.toLocaleString()} π
                  </p>
                </>
              ) : (
                <p className="text-orange-600 font-semibold">
                  {p.price.toLocaleString()} π
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}



