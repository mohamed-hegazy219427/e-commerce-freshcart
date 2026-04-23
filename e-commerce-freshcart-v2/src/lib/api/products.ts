import api from "./axios";
import type { Product, ProductsResponse, ProductFilters } from "@/lib/types/api";

export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  const { data } = await api.get<ProductsResponse>("/products", { params: filters });
  return data;
}

export async function getProduct(id: string): Promise<Product> {
  const { data } = await api.get<{ data: Product }>(`/products/${id}`);
  return data.data;
}
