"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts, getProduct } from "@/lib/api/products";
import { keys } from "@/lib/api/queryKeys";
import type { ProductFilters } from "@/lib/types/api";

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: keys.products.list(filters),
    queryFn: () => getProducts(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: keys.products.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
}
