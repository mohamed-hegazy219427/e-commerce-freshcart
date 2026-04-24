"use client";

import { useParams } from "next/navigation";
import { ShoppingCart, Check, Star, Package, Heart } from "lucide-react";
import { useProduct } from "@/lib/hooks/useProducts";
import { useCart, useAddToCart } from "@/lib/hooks/useCart";
import { useWishlist, useToggleWishlist } from "@/lib/hooks/useWishlist";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading } = useProduct(id);
  const { data: cartData } = useCart();
  const { data: wishlistData } = useWishlist();
  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const inCart = cartData?.data.products.some((p) => p.product._id === product._id) ?? false;
  const inWishlist = wishlistData?.data.some((p) => p._id === product._id) ?? false;

  const discount = product.priceAfterDiscount
    ? Math.round(100 - (product.priceAfterDiscount / product.price) * 100)
    : null;

  const allImages = [product.imageCover, ...product.images].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <ProductCarousel images={allImages} title={product.title} />

        <div className="space-y-5">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground capitalize">{product.category.name}</p>
            <h1 className="text-2xl font-bold leading-tight">{product.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={cn(
                    i < Math.floor(product.ratingsAverage)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.ratingsAverage}</span>
            <span className="text-sm text-muted-foreground">({product.ratingsQuantity} reviews)</span>
          </div>

          <div className="flex items-center gap-3">
            {product.priceAfterDiscount ? (
              <>
                <span className="text-3xl font-bold">${product.priceAfterDiscount}</span>
                <span className="text-lg text-muted-foreground line-through">${product.price}</span>
                {discount && <Badge variant="destructive">-{discount}%</Badge>}
              </>
            ) : (
              <span className="text-3xl font-bold">${product.price}</span>
            )}
          </div>

          <Separator />

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Package size={14} /> {product.quantity} in stock
            </span>
            <span>{product.sold} sold</span>
          </div>

          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 gap-2"
              variant={inCart ? "secondary" : "default"}
              disabled={addToCart.isPending || inCart}
              onClick={() => !inCart && addToCart.mutate(product._id)}
            >
              {inCart ? (
                <><Check size={18} /> In your cart</>
              ) : (
                <><ShoppingCart size={18} /> Add to cart</>
              )}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className={cn("gap-2", inWishlist && "border-red-300 text-red-500 hover:bg-red-50")}
              onClick={() => toggleWishlist.mutate({ productId: product._id, inWishlist })}
            >
              <Heart size={18} className={cn(inWishlist && "fill-red-500")} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
