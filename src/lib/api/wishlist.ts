import api from "./axios";
import type { WishlistResponse } from "@/lib/types/api";

export async function getWishlist(): Promise<WishlistResponse> {
  const { data } = await api.get<WishlistResponse>("/wishlist");
  return data;
}

export async function addToWishlist(productId: string): Promise<WishlistResponse> {
  const { data } = await api.post<WishlistResponse>("/wishlist", { productId });
  return data;
}

export async function removeFromWishlist(productId: string): Promise<WishlistResponse> {
  const { data } = await api.delete<WishlistResponse>(`/wishlist/${productId}`);
  return data;
}
