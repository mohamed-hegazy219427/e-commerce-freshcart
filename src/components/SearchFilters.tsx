"use client";

import { useQueryState, parseAsInteger, parseAsFloat } from "nuqs";
import { SlidersHorizontal, X, Star, ArrowUpDown, Tag, DollarSign, RotateCcw } from "lucide-react";
import type { Brand } from "@/lib/types/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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

const SORT_OPTIONS = [
  { value: "", label: "Relevance" },
  { value: "price", label: "Price: Low → High" },
  { value: "-price", label: "Price: High → Low" },
  { value: "-ratingsAverage", label: "Top Rated" },
  { value: "-createdAt", label: "Newest" },
];

const RATING_STEPS = [0, 1, 2, 3, 4, 5];

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
    <div className="flex flex-col gap-0 pb-6">

      {/* Sort */}
      <section className="px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <ArrowUpDown size={13} className="text-primary" />
          </div>
          <Label className="text-sm font-semibold">Sort by</Label>
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v || null)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Relevance" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <div className="mx-5 h-px bg-border" />

      {/* Brand */}
      <section className="px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Tag size={13} className="text-primary" />
          </div>
          <Label className="text-sm font-semibold">Brand</Label>
        </div>
        <Select value={brandId} onValueChange={(v) => setBrandId(v || null)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="All brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All brands</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <div className="mx-5 h-px bg-border" />

      {/* Price range */}
      <section className="px-5 py-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <DollarSign size={13} className="text-primary" />
          </div>
          <Label className="text-sm font-semibold">Price range</Label>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-md font-medium">
            ${minPrice.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">to</span>
          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-md font-medium">
            ${maxPrice.toLocaleString()}
          </span>
        </div>
        <Slider
          min={0} max={5000} step={50}
          value={[minPrice, maxPrice]}
          onValueChange={(v) => { const vals = v as number[]; setMinPrice(vals[0]); setMaxPrice(vals[1]); }}
          className="mt-1"
        />
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">$0</span>
          <span className="text-[10px] text-muted-foreground">$5,000</span>
        </div>
      </section>

      <div className="mx-5 h-px bg-border" />

      {/* Min rating */}
      <section className="px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
            <Star size={13} className="text-amber-500 fill-amber-500" />
          </div>
          <Label className="text-sm font-semibold">Min. rating</Label>
          {minRating > 0 && (
            <span className="ml-auto flex items-center gap-0.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Star size={10} className="fill-amber-500 text-amber-500" />
              {minRating}+
            </span>
          )}
        </div>
        <div className="flex justify-between mb-3 gap-1">
          {RATING_STEPS.map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r === minRating ? null : r)}
              className={cn(
                "flex-1 rounded-lg border py-1.5 text-xs font-medium transition-all",
                minRating === r
                  ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                  : "bg-background border-border text-muted-foreground hover:border-amber-300 hover:text-amber-600"
              )}
            >
              {r === 0 ? "Any" : `${r}★`}
            </button>
          ))}
        </div>
      </section>

      <div className="mx-5 h-px bg-border" />

      {/* Footer */}
      <div className="px-5 pt-5">
        <Button
          variant="outline"
          className="w-full gap-2 h-10 text-sm font-medium"
          onClick={clearAll}
          disabled={activeCount === 0}
        >
          <RotateCcw size={14} />
          Clear all filters
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5">
              {activeCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <Sheet>
      <SheetTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}>
        <SlidersHorizontal size={15} />
        Filters
        {activeCount > 0 && (
          <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs ml-1">
            {activeCount}
          </Badge>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-[340px] p-0 overflow-y-auto flex flex-col">
        <SheetHeader className="px-5 py-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-semibold">Filters</SheetTitle>
            {activeCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeCount} active
              </Badge>
            )}
          </div>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  );
}
