"use client";

import { useQueryState, parseAsInteger, parseAsFloat } from "nuqs";
import { SlidersHorizontal } from "lucide-react";
import type { Brand } from "@/lib/types/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SearchFiltersProps {
  brands: Brand[];
}

export function SearchFilters({ brands }: SearchFiltersProps) {
  const [brandId, setBrandId] = useQueryState("brand", { defaultValue: "", shallow: false });
  const [minPrice, setMinPrice] = useQueryState("minPrice", parseAsInteger.withDefault(0));
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsInteger.withDefault(5000));
  const [minRating, setMinRating] = useQueryState("minRating", parseAsFloat.withDefault(0));
  const [sort, setSort] = useQueryState("sort", { defaultValue: "", shallow: false });

  const activeCount = [brandId, minPrice > 0, maxPrice < 5000, minRating > 0, sort].filter(Boolean).length;

  function clearAll() {
    setBrandId(null);
    setMinPrice(null);
    setMaxPrice(null);
    setMinRating(null);
    setSort(null);
  }

  const content = (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label>Sort by</Label>
        <Select value={sort} onValueChange={(v) => setSort(v || null)}>
          <SelectTrigger>
            <SelectValue placeholder="Relevance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Relevance</SelectItem>
            <SelectItem value="price">Price: Low to High</SelectItem>
            <SelectItem value="-price">Price: High to Low</SelectItem>
            <SelectItem value="-ratingsAverage">Top Rated</SelectItem>
            <SelectItem value="-createdAt">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Brand</Label>
        <Select value={brandId} onValueChange={(v) => setBrandId(v || null)}>
          <SelectTrigger>
            <SelectValue placeholder="All brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All brands</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Price range: ${minPrice} – ${maxPrice}</Label>
        <Slider
          min={0} max={5000} step={50}
          value={[minPrice, maxPrice]}
          onValueChange={(v) => { const vals = v as number[]; setMinPrice(vals[0]); setMaxPrice(vals[1]); }}
        />
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Min. rating: {minRating > 0 ? `${minRating}★` : "Any"}</Label>
        <Slider
          min={0} max={5} step={0.5}
          value={[minRating]}
          onValueChange={(v) => setMinRating((v as number[])[0])}
        />
      </div>

      <Separator />

      <Button variant="outline" className="w-full" onClick={clearAll}>
        Clear all filters
      </Button>
    </div>
  );

  return (
    <Sheet>
      <SheetTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}>
        <SlidersHorizontal size={16} />
        Filters
        {activeCount > 0 && (
          <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs">
            {activeCount}
          </Badge>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  );
}
