"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart, Check, Star } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types/api";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const isInCart = useCartStore((s) => s.isInCart);
  const isLoading = useCartStore((s) => s.isLoading);
  const inCart = isInCart(product._id);

  const discount = product.priceAfterDiscount
    ? (100 - (product.priceAfterDiscount / product.price) * 100).toFixed(1)
    : null;

  const displayTitle =
    product.title.slice(0, product.title.indexOf(" ", 10)) || product.title;

  return (
    <div className="group relative flex flex-col rounded-xl bg-card border shadow-sm overflow-hidden h-full transition-shadow hover:shadow-md">
      {/* image */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Link
            href={`/products/${product._id}`}
            title="View details"
            className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "rounded-lg")}
          >
            <Eye size={16} />
          </Link>
          <button
            className={cn(
              buttonVariants({ size: "icon" }),
              "rounded-lg",
              inCart && "bg-green-600 hover:bg-green-700"
            )}
            onClick={() => !inCart && addItem(product._id)}
            disabled={isLoading || inCart}
            title={inCart ? "In cart" : "Add to cart"}
          >
            {inCart ? <Check size={16} /> : <ShoppingCart size={16} />}
          </button>
        </div>

        {/* discount badge */}
        {discount && (
          <Badge
            variant="destructive"
            className="absolute top-2 inset-e-2 text-[0.65rem] px-1.5 py-0.5"
          >
            -{discount}%
          </Badge>
        )}
      </div>

      {/* body */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <p className="text-xs text-muted-foreground capitalize">{product.category.slug}</p>
        <h6 className="text-sm font-semibold leading-tight line-clamp-2">{displayTitle}</h6>

        <div className="flex items-center gap-1 mt-0.5">
          <Badge variant="secondary" className="flex items-center gap-1 text-xs px-1.5 py-0.5 bg-amber-100 text-amber-800">
            <Star size={10} className="fill-amber-500 text-amber-500" />
            {product.ratingsAverage}
          </Badge>
          <span className="text-xs text-muted-foreground">({product.ratingsQuantity})</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-baseline gap-1">
            {product.priceAfterDiscount ? (
              <>
                <span className="text-xs text-muted-foreground line-through">${product.price}</span>
                <span className="font-bold text-sm">${product.priceAfterDiscount}</span>
              </>
            ) : (
              <span className="font-bold text-sm">${product.price}</span>
            )}
          </div>

          <button
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "h-8 w-8 rounded-lg",
              inCart && "border-green-500 bg-green-50 text-green-600 hover:bg-green-100"
            )}
            onClick={() => !inCart && addItem(product._id)}
            disabled={isLoading || inCart}
          >
            {inCart ? <Check size={14} /> : <ShoppingCart size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
