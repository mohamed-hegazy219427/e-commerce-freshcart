"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/hooks/useCart";
import { useCheckoutSession, useCashOrder } from "@/lib/hooks/useOrders";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Truck } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const { data: cartData } = useCart();
  const checkoutSession = useCheckoutSession();
  const cashOrder = useCashOrder();

  const cartId = cartData?.data._id ?? "";
  const total = cartData?.data.totalCartPrice ?? 0;

  const [details, setDetails] = useState({ phone: "", city: "", address: "" });
  const isFormValid = details.phone && details.city && details.address;
  const isLoading = checkoutSession.isPending || cashOrder.isPending;

  const shippingAddress = {
    phone: details.phone,
    city: details.city,
    details: details.address,
  };

  function handleCashOrder() {
    cashOrder.mutate(
      { cartId, shippingAddress },
      { onSuccess: () => router.push("/") }
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold">Shipping address</h2>
            {[
              { id: "phone", label: "Phone", placeholder: "01XXXXXXXXX" },
              { id: "city", label: "City", placeholder: "Cairo" },
              { id: "address", label: "Street address", placeholder: "123 Main St" },
            ].map(({ id, label, placeholder }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  placeholder={placeholder}
                  value={details[id as keyof typeof details]}
                  onChange={(e) => setDetails((d) => ({ ...d, [id]: e.target.value }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order total</span>
              <span className="font-bold text-lg">${total}</span>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline" className="gap-2" size="lg"
                onClick={handleCashOrder}
                disabled={!isFormValid || isLoading}
              >
                <Truck size={16} /> Cash on delivery
              </Button>
              <Button
                className="gap-2" size="lg"
                onClick={() => checkoutSession.mutate({ cartId, shippingAddress })}
                disabled={!isFormValid || isLoading}
              >
                <CreditCard size={16} /> Pay online
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
