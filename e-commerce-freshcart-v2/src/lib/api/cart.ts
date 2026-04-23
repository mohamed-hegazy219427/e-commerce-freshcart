import api from "./axios";
import type { CartResponse } from "@/lib/types/api";

export async function getCart(): Promise<CartResponse> {
  const { data } = await api.get<CartResponse>("/cart");
  return data;
}

export async function addToCart(productId: string): Promise<CartResponse> {
  const { data } = await api.post<CartResponse>("/cart", { productId });
  return data;
}

export async function removeFromCart(productId: string): Promise<CartResponse> {
  const { data } = await api.delete<CartResponse>(`/cart/${productId}`);
  return data;
}

export async function updateCartItem(productId: string, count: number): Promise<CartResponse> {
  const { data } = await api.put<CartResponse>(`/cart/${productId}`, { count });
  return data;
}

export async function clearCart(): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>("/cart");
  return data;
}
