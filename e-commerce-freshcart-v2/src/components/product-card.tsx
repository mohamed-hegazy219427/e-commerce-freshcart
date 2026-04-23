"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, Star } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types/api";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const isInCart = useCartStore((s) => s.isInCart);
  const isLoading = useCartStore((s) => s.isLoading);
  const inCart = isInCart(product._id);

  const discount = product.priceAfterDiscount
    ? Math.round(100 - (product.priceAfterDiscount / product.price) * 100)
    : null;

  const displayTitle = product.title.split(" ").slice(0, 5).join(" ");

  return (
    <Card className="group overflow-hidden border hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product._id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
              -{discount}%
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground capitalize">{product.category.slug}</p>
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">
            {displayTitle}
          </h3>
        </Link>

        <div className="flex items-center gap-1">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium">{product.ratingsAverage}</span>
          <span className="text-xs text-muted-foreground">({product.ratingsQuantity})</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {product.priceAfterDiscount ? (
              <>
                <span className="text-sm text-muted-foreground line-through">${product.price}</span>
                <span className="font-bold text-sm">${product.priceAfterDiscount}</span>
              </>
            ) : (
              <span className="font-bold text-sm">${product.price}</span>
            )}
          </div>
          <Button
            size="sm"
            variant={inCart ? "secondary" : "default"}
            className={cn("shrink-0 h-8 px-3", inCart && "pointer-events-none")}
            onClick={() => !inCart && addItem(product._id)}
            disabled={isLoading}
            aria-label={inCart ? "In cart" : "Add to cart"}
          >
            {inCart ? <Check size={14} /> : <ShoppingCart size={14} />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
