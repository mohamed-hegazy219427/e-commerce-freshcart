"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Check, Star, Package } from "lucide-react";
import { getProduct } from "@/lib/api/products";
import { useCartStore } from "@/lib/store/cart-store";
import { ProductCarousel } from "@/components/product-carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((s) => s.addItem);
  const isInCart = useCartStore((s) => s.isInCart);
  const isLoading = useCartStore((s) => s.isLoading);

  const { data: product, isLoading: pageLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

  if (pageLoading) {
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

  const inCart = isInCart(product._id);
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

          <Button
            size="lg"
            className="w-full gap-2"
            variant={inCart ? "secondary" : "default"}
            disabled={isLoading || inCart}
            onClick={() => !inCart && addItem(product._id)}
          >
            {inCart ? (
              <><Check size={18} /> In your cart</>
            ) : (
              <><ShoppingCart size={18} /> Add to cart</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
