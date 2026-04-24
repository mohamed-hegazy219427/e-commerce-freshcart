"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart, Check, Star, Heart } from "lucide-react";
import { useAddToCart, useCart } from "@/lib/hooks/useCart";
import { useToggleWishlist, useWishlist } from "@/lib/hooks/useWishlist";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types/api";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { data: cartData } = useCart();
  const { data: wishlistData } = useWishlist();
  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();

  const inCart = cartData?.data.products.some((p) => p.product._id === product._id) ?? false;
  const inWishlist = wishlistData?.data.some((p) => p._id === product._id) ?? false;

  const discount = product.priceAfterDiscount
    ? Math.round(100 - (product.priceAfterDiscount / product.price) * 100)
    : null;

  const displayTitle =
    product.title.slice(0, product.title.indexOf(" ", 10)) || product.title;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-card border shadow-sm overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">

      {/* image area */}
      <div className="relative overflow-hidden bg-muted/30" style={{ height: 200 }}>
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* gradient overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* action buttons — slide up on hover */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 pb-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link
            href={`/products/${product._id}`}
            title="View details"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-foreground shadow hover:bg-white hover:scale-110 transition-all"
          >
            <Eye size={15} />
          </Link>
          <button
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full shadow hover:scale-110 transition-all",
              inCart
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-white/95 text-foreground hover:bg-white"
            )}
            onClick={() => !inCart && addToCart.mutate(product._id)}
            disabled={addToCart.isPending || inCart}
            title={inCart ? "In cart" : "Add to cart"}
          >
            {inCart ? <Check size={15} /> : <ShoppingCart size={15} />}
          </button>
          <button
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full shadow hover:scale-110 transition-all",
              inWishlist
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white/95 text-foreground hover:bg-white"
            )}
            onClick={() => toggleWishlist.mutate({ productId: product._id, inWishlist })}
            title={inWishlist ? "Remove from wishlist" : "Save"}
          >
            <Heart size={15} className={cn(inWishlist && "fill-white")} />
          </button>
        </div>

        {/* top badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start pointer-events-none">
          {discount ? (
            <Badge variant="destructive" className="text-[0.6rem] px-1.5 py-0.5 font-bold shadow">
              -{discount}%
            </Badge>
          ) : <span />}
          {inWishlist && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 shadow">
              <Heart size={11} className="fill-white text-white" />
            </span>
          )}
        </div>
      </div>

      {/* body */}
      <div className="flex flex-col flex-1 p-3.5 gap-1.5">
        <p className="text-[0.7rem] text-muted-foreground capitalize font-medium tracking-wide">
          {product.category.slug}
        </p>
        <h6 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground">
          {displayTitle}
        </h6>

        {/* star rating */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={10}
                className={cn(
                  i < Math.round(product.ratingsAverage)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted-foreground/20 text-muted-foreground/20"
                )}
              />
            ))}
          </div>
          <span className="text-[0.65rem] text-muted-foreground">({product.ratingsQuantity})</span>
        </div>

        {/* price + cart button */}
        <div className="flex items-center justify-between mt-auto pt-2 gap-2">
          <div className="flex items-baseline gap-1">
            {product.priceAfterDiscount ? (
              <>
                <span className="text-xs text-muted-foreground line-through">${product.price}</span>
                <span className="font-bold text-sm text-primary">${product.priceAfterDiscount}</span>
              </>
            ) : (
              <span className="font-bold text-sm text-primary">${product.price}</span>
            )}
          </div>

          <button
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-200",
              inCart
                ? "border-green-500 bg-green-50 text-green-600 hover:bg-green-100"
                : "border-border bg-background hover:border-primary hover:text-primary hover:bg-primary/5"
            )}
            onClick={() => !inCart && addToCart.mutate(product._id)}
            disabled={addToCart.isPending || inCart}
          >
            {inCart ? <Check size={14} /> : <ShoppingCart size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
