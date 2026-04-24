"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "@/lib/api/cart";
import { keys } from "@/lib/api/queryKeys";

export function useCart() {
  return useQuery({
    queryKey: keys.cart.all,
    queryFn: getCart,
    retry: false,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => addToCart(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.cart.all });
      toast.success("Added to cart");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? "Please login first");
    },
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => removeFromCart(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.cart.all });
      toast.success("Removed from cart");
    },
    onError: () => toast.error("Failed to remove item"),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, count }: { productId: string; count: number }) =>
      updateCartItem(productId, count),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.cart.all });
      toast.success("Quantity updated");
    },
    onError: () => toast.error("Failed to update quantity"),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.cart.all });
      toast.success("Cart cleared");
    },
    onError: () => toast.error("Failed to clear cart"),
  });
}
