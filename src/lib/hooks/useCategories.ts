"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories, getSubcategories } from "@/lib/api/categories";
import { keys } from "@/lib/api/queryKeys";

export function useCategories() {
  return useQuery({
    queryKey: keys.categories.all,
    queryFn: getCategories,
    staleTime: Infinity,
  });
}

export function useSubcategories(categoryId: string) {
  return useQuery({
    queryKey: keys.categories.subcategories(categoryId),
    queryFn: () => getSubcategories(categoryId),
    enabled: !!categoryId,
  });
}
