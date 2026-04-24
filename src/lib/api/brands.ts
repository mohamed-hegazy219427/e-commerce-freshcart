import api from "./axios";
import type { BrandsResponse, ProductsResponse } from "@/lib/types/api";

export async function getBrands(): Promise<BrandsResponse> {
  const { data } = await api.get<BrandsResponse>("/brands");
  return data;
}

export async function getBrandProducts(brandId: string, page = 1): Promise<ProductsResponse> {
  const { data } = await api.get<ProductsResponse>("/products", {
    params: { "brand[in][]": brandId, page },
  });
  return data;
}
