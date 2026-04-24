"use client";

import { Package, Clock, CheckCircle, Truck } from "lucide-react";
import { useOrders } from "@/lib/hooks/useOrders";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

function OrdersContent() {
  const { data, isLoading } = useOrders();
  const orders = data ?? [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 space-y-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center gap-4">
        <Package size={64} className="text-muted-foreground" strokeWidth={1} />
        <h1 className="text-2xl font-bold">No orders yet</h1>
        <p className="text-muted-foreground">Start shopping to see your orders here.</p>
        <Link href="/" className={buttonVariants()}>Browse products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.map((order) => (
        <Card key={order._id} className="overflow-hidden">
          <CardContent className="p-0">
            {/* header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-muted/40 border-b">
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">Order ID</p>
                <p className="text-sm font-mono font-medium">#{order._id.slice(-8).toUpperCase()}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">Payment</p>
                <Badge variant={order.isPaid ? "default" : "secondary"} className="gap-1">
                  {order.isPaid
                    ? <><CheckCircle size={11} /> Paid</>
                    : <><Clock size={11} /> Pending</>}
                </Badge>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">Delivery</p>
                <Badge variant={order.isDelivered ? "default" : "secondary"} className="gap-1">
                  {order.isDelivered
                    ? <><CheckCircle size={11} /> Delivered</>
                    : <><Truck size={11} /> In transit</>}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-bold text-primary">${order.totalOrderPrice}</p>
              </div>
            </div>

            {/* items */}
            <div className="divide-y">
              {order.cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4 px-5 py-3">
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={item.product.imageCover}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.product.title}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.count}</p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">${item.price * item.count}</p>
                </div>
              ))}
            </div>

            {/* shipping */}
            {order.shippingAddress && (
              <>
                <Separator />
                <div className="px-5 py-3 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Ship to: </span>
                  {order.shippingAddress.details}, {order.shippingAddress.city} · {order.shippingAddress.phone}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
