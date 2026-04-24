"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrands, getBrandProducts } from "@/lib/api/brands";
import { keys } from "@/lib/api/queryKeys";

export function useBrands() {
  return useQuery({
    queryKey: keys.brands.all,
    queryFn: getBrands,
    staleTime: Infinity,
  });
}

export function useBrandProducts(brandId: string, page = 1) {
  return useQuery({
    queryKey: keys.brands.detail(brandId),
    queryFn: () => getBrandProducts(brandId, page),
    enabled: !!brandId,
  });
}
