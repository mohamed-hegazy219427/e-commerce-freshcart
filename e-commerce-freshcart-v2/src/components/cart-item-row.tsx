"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import type { CartProduct } from "@/lib/types/api";

interface CartItemRowProps {
  item: CartProduct;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const removeItem = useCartStore((s) => s.removeItem);
  const updateItem = useCartStore((s) => s.updateItem);
  const isLoading = useCartStore((s) => s.isLoading);

  return (
    <div className="flex gap-4 py-4">
      <Link href={`/products/${item.product._id}`} className="shrink-0">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
          <Image
            src={item.product.imageCover}
            alt={item.product.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product._id}`}>
          <p className="font-medium text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">
            {item.product.title}
          </p>
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5 capitalize">{item.product.category.slug}</p>
        <p className="font-bold mt-1">${item.price}</p>
      </div>

      <div className="flex flex-col items-end justify-between shrink-0">
        <Button
          variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => removeItem(item.product._id)}
          disabled={isLoading}
          aria-label="Remove item"
        >
          <Trash2 size={15} />
        </Button>

        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost" size="icon" className="h-8 w-8 rounded-none"
            onClick={() => item.count > 1 && updateItem(item.product._id, item.count - 1)}
            disabled={isLoading || item.count <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={13} />
          </Button>
          <span className="w-8 text-center text-sm font-medium">{item.count}</span>
          <Button
            variant="ghost" size="icon" className="h-8 w-8 rounded-none"
            onClick={() => updateItem(item.product._id, item.count + 1)}
            disabled={isLoading}
            aria-label="Increase quantity"
          >
            <Plus size={13} />
          </Button>
        </div>
      </div>
    </div>
  );
}
