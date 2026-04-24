import type { ProductFilters } from "@/lib/types/api";

export const keys = {
  products: {
    all: ["products"] as const,
    list: (filters: ProductFilters) => ["products", "list", filters] as const,
    detail: (id: string) => ["products", "detail", id] as const,
  },
  categories: {
    all: ["categories"] as const,
    detail: (id: string) => ["categories", "detail", id] as const,
    subcategories: (id: string) => ["categories", id, "subcategories"] as const,
  },
  brands: {
    all: ["brands"] as const,
    detail: (id: string) => ["brands", "detail", id] as const,
  },
  cart: {
    all: ["cart"] as const,
  },
  wishlist: {
    all: ["wishlist"] as const,
  },
  orders: {
    all: (userId: string) => ["orders", userId] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
  },
};
