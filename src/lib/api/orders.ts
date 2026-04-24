import api from "./axios";
import type { OrdersResponse, Order, CheckoutSessionResponse } from "@/lib/types/api";

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data } = await api.get<Order[] | OrdersResponse>(`/orders/user/${userId}`);
  return Array.isArray(data) ? data : (data.data ?? []);
}

export async function getOrder(orderId: string): Promise<Order> {
  const { data } = await api.get<{ data: Order }>(`/orders/${orderId}`);
  return data.data;
}

export async function createCheckoutSession(
  cartId: string,
  shippingAddress: { details: string; phone: string; city: string }
): Promise<CheckoutSessionResponse> {
  const { data } = await api.post<CheckoutSessionResponse>(
    `/orders/checkout-session/${cartId}`,
    { shippingAddress },
    { params: { url: typeof window !== "undefined" ? window.location.origin : "" } }
  );
  return data;
}

export async function createCashOrder(
  cartId: string,
  shippingAddress: { details: string; phone: string; city: string }
): Promise<{ status: string; data: Order }> {
  const { data } = await api.post<{ status: string; data: Order }>(
    `/orders/${cartId}`,
    { shippingAddress }
  );
  return data;
}
