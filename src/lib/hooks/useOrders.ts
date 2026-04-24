"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUserOrders,
  getOrder,
  createCheckoutSession,
  createCashOrder,
} from "@/lib/api/orders";
import { keys } from "@/lib/api/queryKeys";
import { useAuthStore } from "@/lib/store/authStore";
import type { Order } from "@/lib/types/api";

export function useOrders() {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  return useQuery<Order[]>({
    queryKey: keys.orders.all(userId),
    queryFn: () => getUserOrders(userId),
    enabled: !!userId,
    retry: false,
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: keys.orders.detail(orderId),
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  });
}

export function useCheckoutSession() {
  return useMutation({
    mutationFn: ({
      cartId,
      shippingAddress,
    }: {
      cartId: string;
      shippingAddress: { details: string; phone: string; city: string };
    }) => createCheckoutSession(cartId, shippingAddress),
    onSuccess: (data) => {
      window.location.href = data.session.url;
    },
    onError: () => toast.error("Failed to create checkout session"),
  });
}

export function useCashOrder() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id ?? "");
  return useMutation({
    mutationFn: ({
      cartId,
      shippingAddress,
    }: {
      cartId: string;
      shippingAddress: { details: string; phone: string; city: string };
    }) => createCashOrder(cartId, shippingAddress),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.orders.all(userId) });
      toast.success("Order placed successfully!");
    },
    onError: () => toast.error("Failed to place order"),
  });
}
