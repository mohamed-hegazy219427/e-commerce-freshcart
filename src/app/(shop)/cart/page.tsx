"use client";

import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { CartItemRow } from "@/components/cart-item-row";
import { ProtectedRoute } from "@/components/protected-route";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

function CartContent() {
  const items = useCartStore((s) => s.items);
  const count = useCartStore((s) => s.count);
  const total = useCartStore((s) => s.total);
  const clearAll = useCartStore((s) => s.clearAll);
  const isLoading = useCartStore((s) => s.isLoading);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center gap-4">
        <ShoppingCart size={64} className="text-muted-foreground" strokeWidth={1} />
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">Add some products to get started.</p>
        <Link href="/" className={buttonVariants()}>Browse products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Shopping Cart ({count})</h1>
        <Button
          variant="outline" size="sm" className="text-destructive border-destructive gap-1.5"
          onClick={clearAll}
          disabled={isLoading}
        >
          <Trash2 size={14} /> Clear cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-0">
          {items.map((item, i) => (
            <div key={item._id}>
              <CartItemRow item={item} />
              {i < items.length - 1 && <Separator />}
            </div>
          ))}
        </div>

        <Card className="sticky top-24">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items ({count})</span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total}</span>
            </div>
            <Link href="/checkout" className={buttonVariants({ size: "lg" }) + " w-full"}>Proceed to checkout</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}
