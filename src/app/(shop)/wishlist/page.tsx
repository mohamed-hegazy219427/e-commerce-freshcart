"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist, useToggleWishlist } from "@/lib/hooks/useWishlist";
import { useAddToCart, useCart } from "@/lib/hooks/useCart";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function WishlistContent() {
  const { data, isLoading } = useWishlist();
  const { data: cartData } = useCart();
  const toggleWishlist = useToggleWishlist();
  const addToCart = useAddToCart();

  const items = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center gap-4">
        <Heart size={64} className="text-muted-foreground" strokeWidth={1} />
        <h1 className="text-2xl font-bold">Your wishlist is empty</h1>
        <p className="text-muted-foreground">Save items you love and find them here.</p>
        <Link href="/" className={buttonVariants()}>Browse products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">
        Wishlist <span className="text-muted-foreground text-base font-normal">({items.length} items)</span>
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((product) => {
          const inCart = cartData?.data.products.some((p) => p.product._id === product._id) ?? false;

          return (
            <div key={product._id} className="group relative flex flex-col rounded-xl bg-card border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/products/${product._id}`} className="relative overflow-hidden" style={{ height: 180 }}>
                <Image
                  src={product.imageCover}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {product.priceAfterDiscount && (
                  <Badge variant="destructive" className="absolute top-2 start-2 text-[0.65rem]">
                    -{Math.round(100 - (product.priceAfterDiscount / product.price) * 100)}%
                  </Badge>
                )}
              </Link>

              <div className="flex flex-col flex-1 p-3 gap-2">
                <p className="text-xs text-muted-foreground capitalize">{product.category.slug}</p>
                <p className="text-sm font-semibold leading-tight line-clamp-2">{product.title}</p>
                <div className="flex items-baseline gap-1 mt-auto">
                  {product.priceAfterDiscount ? (
                    <>
                      <span className="text-xs text-muted-foreground line-through">${product.price}</span>
                      <span className="font-bold text-sm">${product.priceAfterDiscount}</span>
                    </>
                  ) : (
                    <span className="font-bold text-sm">${product.price}</span>
                  )}
                </div>

                <div className="flex gap-2 mt-1">
                  <Button
                    size="sm"
                    variant={inCart ? "secondary" : "default"}
                    className="flex-1 gap-1.5 text-xs h-8"
                    disabled={addToCart.isPending || inCart}
                    onClick={() => !inCart && addToCart.mutate(product._id)}
                  >
                    <ShoppingCart size={13} />
                    {inCart ? "In cart" : "Add"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn("h-8 w-8 p-0 shrink-0", "text-red-500 border-red-200 hover:bg-red-50")}
                    onClick={() => toggleWishlist.mutate({ productId: product._id, inWishlist: true })}
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}
