import api from "./axios";
import type { CategoriesResponse, SubcategoriesResponse } from "@/lib/types/api";

export async function getCategories(): Promise<CategoriesResponse> {
  const { data } = await api.get<CategoriesResponse>("/categories");
  return data;
}

export async function getSubcategories(categoryId: string): Promise<SubcategoriesResponse> {
  const { data } = await api.get<SubcategoriesResponse>(
    `/categories/${categoryId}/subcategories`
  );
  return data;
}
