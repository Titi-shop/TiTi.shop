"use client";

import Image from "next/image";
import type { Category } from "@/types/category";

type SortType = "popular" | "sale" | "latest";

interface CategoriesToolbarProps {
  categories: Category[];
  selectedCategory: number | "all";
  setSelectedCategory: (
    value: number | "all"
  ) => void;
  sortType: SortType;
  setSortType: (
    value: SortType
  ) => void;
  t: Record<string, string>;
}

function getCategoryName(
  category: Category,
  t: Record<string, string>
): string {
  return (
    t[category.key] ||
    category.name ||
    category.key
  );
}

function getCategoryCover(
  category: Category
): string | null {
  if (
    category.cover &&
    category.cover.trim().length > 0
  ) {
    return category.cover;
  }

  return null;
}

export default function CategoriesToolbar({
  categories,
  selectedCategory,
  setSelectedCategory,
  sortType,
  setSortType,
  t,
}: CategoriesToolbarProps) {
  const sortItems: Array<{
    key: SortType;
    label: string;
  }> = [
    {
      key: "popular",
      label:
        t.best_seller ||
        "Best Seller",
    },
    {
      key: "sale",
      label:
        t.flash_sale ||
        "Flash Sale",
    },
    {
      key: "latest",
      label:
        t.new_arrivals ||
        "New",
    },
  ];

  return (
    <section className="space-y-4 px-4 py-4 sm:px-6">
      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <div
        className="
          rounded-[28px]
          border
          border-surface-2
          bg-[var(--card-bg)]
          p-3
          shadow-sm
          sm:rounded-[32px]
          sm:p-4
        "
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
              {t.categories ||
                "Categories"}
            </p>

            <p className="mt-2 text-sm text-[var(--foreground)]">
              {t.choose_your_category ||
                "Choose a category to refine the list."}
            </p>
          </div>

          <div
            className="
              hidden
              rounded-3xl
              bg-[var(--surface)]
              px-4
              py-2
              text-sm
              text-[var(--text-muted)]
              sm:block
            "
          >
            {t.swipe_horizontal ||
              "Swipe horizontally on mobile"}
          </div>
        </div>

        {/* CATEGORY LIST */}

        <div
          className="
            mt-4
            flex
            gap-3
            overflow-x-auto
            overscroll-x-contain
            pb-2
            scrollbar-hide
            snap-x
            snap-mandatory
          "
          style={{
            WebkitOverflowScrolling:
              "touch",
          }}
        >
          {/* ALL */}

          <button
            type="button"
            onClick={() =>
              setSelectedCategory("all")
            }
            className={`
              relative
              min-w-[112px]
              max-w-[112px]
              shrink-0
              snap-start
              overflow-hidden
              rounded-2xl
              border
              text-left
              transition-all
              duration-200
              active:scale-[0.97]
              sm:min-w-[128px]
              sm:max-w-[128px]
              ${
                selectedCategory === "all"
                  ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20"
                  : "border-surface-2"
              }
            `}
          >
            {/* IMAGE / ICON */}

            <div
              className="
                relative
                h-[92px]
                w-full
                overflow-hidden
                bg-[var(--surface)]
              "
            >
              <div
                className={`
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  text-3xl
                  ${
                    selectedCategory ===
                    "all"
                      ? "bg-[var(--color-primary)]"
                      : ""
                  }
                `}
              >
                <span
                  className={
                    selectedCategory ===
                    "all"
                      ? "drop-shadow-sm"
                      : ""
                  }
                >
                  🛍️
                </span>
              </div>
            </div>

            {/* TEXT */}

            <div className="p-2.5">
              <p
                className={`
                  truncate
                  text-sm
                  font-bold
                  ${
                    selectedCategory ===
                    "all"
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--foreground)]"
                  }
                `}
              >
                {t.all || "All"}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-[var(--text-muted)]">
                {t.view_all ||
                  "View all products"}
              </p>
            </div>
          </button>

          {/* CATEGORIES */}

          {categories.map(
            (category) => {
              const active =
                selectedCategory ===
                category.id;

              const cover =
                getCategoryCover(
                  category
                );

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      category.id
                    )
                  }
                  className={`
                    relative
                    min-w-[112px]
                    max-w-[112px]
                    shrink-0
                    snap-start
                    overflow-hidden
                    rounded-2xl
                    border
                    text-left
                    transition-all
                    duration-200
                    active:scale-[0.97]
                    sm:min-w-[128px]
                    sm:max-w-[128px]
                    ${
                      active
                        ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20"
                        : "border-surface-2"
                    }
                  `}
                >
                  {/* COVER */}

<div
  className={`
    relative
    h-[108px]
    w-full
    overflow-hidden
    ${
      active
        ? "bg-[var(--color-primary)]/10"
        : "bg-[var(--surface)]"
    }
  `}
>
  {cover ? (
    <Image
      src={cover}
      alt={getCategoryName(category, t)}
      fill
      sizes="
        (max-width: 640px) 112px,
        128px
      "
      className="
        object-cover
        transition-transform
        duration-300
        hover:scale-105
      "
    />
  ) : (
    <div
      className="
        flex
        h-full
        w-full
        items-center
        justify-center
      "
    >
      <span
        className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          bg-[var(--card-secondary)]
          text-[42px]
          leading-none
          drop-shadow-sm
        "
      >
        {category.icon || "🛍️"}
      </span>
    </div>
  )}

  {active && (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        bg-[var(--color-primary)]/10
      "
    />
  )}
</div>

                  {/* CONTENT */}

                  <div className="p-2.5">
                    <p
                      className={`
                        truncate
                        text-sm
                        font-bold
                        ${
                          active
                            ? "text-[var(--color-primary)]"
                            : "text-[var(--foreground)]"
                        }
                      `}
                    >
                      {getCategoryName(
                        category,
                        t
                      )}
                    </p>

                    {typeof category.product_count ===
                      "number" && (
                      <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">
                        {category.product_count}{" "}
                        {t.products ||
                          "products"}
                      </p>
                    )}
                  </div>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* =====================================================
          SORT
      ===================================================== */}

      <div
        className="
          rounded-[28px]
          border
          border-surface-2
          bg-[var(--card-bg)]
          p-4
          shadow-sm
          sm:rounded-[32px]
        "
      >
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
          {t.sort_by || "Sort by"}
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          {sortItems.map(
            (item) => {
              const active =
                sortType === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() =>
                    setSortType(
                      item.key
                    )
                  }
                  className={`
                    rounded-3xl
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    transition-all
                    active:scale-[0.97]
                    ${
                      active
                        ? "bg-[var(--color-primary)] text-white shadow-sm"
                        : "border border-surface-3 bg-[var(--surface)] text-[var(--foreground)]"
                    }
                  `}
                >
                  {item.label}
                </button>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
