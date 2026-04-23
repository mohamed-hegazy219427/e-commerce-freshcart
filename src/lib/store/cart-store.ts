"use client";

import { create } from "zustand";
import { toast } from "sonner";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "@/lib/api/cart";
import type { CartProduct } from "@/lib/types/api";

interface CartState {
  items: CartProduct[];
  count: number;
  total: number;
  cartId: string | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateItem: (productId: string, count: number) => Promise<void>;
  clearAll: () => Promise<void>;
  isInCart: (productId: string) => boolean;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  count: 0,
  total: 0,
  cartId: null,
  isLoading: false,

  fetchCart: async () => {
    try {
      const res = await getCart();
      set({
        items: res.data.products,
        count: res.numOfCartItems,
        total: res.data.totalCartPrice,
        cartId: res.data._id,
      });
    } catch {
      set({ items: [], count: 0, total: 0, cartId: null });
    }
  },

  addItem: async (productId) => {
    set({ isLoading: true });
    try {
      await addToCart(productId);
      await get().fetchCart();
      toast.success("Added to cart");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message ?? "Please login first");
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (productId) => {
    set({ isLoading: true });
    try {
      await removeFromCart(productId);
      await get().fetchCart();
      toast.success("Removed from cart");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (productId, count) => {
    set({ isLoading: true });
    try {
      await updateCartItem(productId, count);
      await get().fetchCart();
      toast.success("Cart updated");
    } catch {
      toast.error("Failed to update quantity");
    } finally {
      set({ isLoading: false });
    }
  },

  clearAll: async () => {
    set({ isLoading: true });
    try {
      await clearCart();
      set({ items: [], count: 0, total: 0, cartId: null });
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    } finally {
      set({ isLoading: false });
    }
  },

  isInCart: (productId) => {
    return get().items.some((item) => item.product._id === productId);
  },
}));
