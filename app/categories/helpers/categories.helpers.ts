import type { Product } from "@/types/Product";

export const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("FETCH_FAILED");
  }

  return res.json() as Promise<T>;
};

export const filterProducts = (
  products: Product[],
  selectedCategory: number | "all",
  search: string,
  sortType: "popular" | "sale" | "latest"
) => {
  let list = [...products];

  if (selectedCategory !== "all") {
    list = list.filter((product) => product.category_id === selectedCategory);
  }

  if (search.trim()) {
    list = list.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
  }

  if (sortType === "popular") {
    list.sort((a, b) => b.sold - a.sold);
  }

  if (sortType === "sale") {
    list.sort((a, b) => {
      const discountA = a.price - (a.final_price ?? a.price);
      const discountB = b.price - (b.final_price ?? b.price);
      return discountB - discountA;
    });
  }

  if (sortType === "latest") {
    list.reverse();
  }

  return list;
};
