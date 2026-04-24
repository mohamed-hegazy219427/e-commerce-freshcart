"use client";

import { useQueryState, parseAsInteger, parseAsFloat } from "nuqs";
import {
  SlidersHorizontal,
  Star,
  Tag,
  DollarSign,
  RotateCcw,
  LayoutGrid,
} from "lucide-react";
import type { Brand, Category } from "@/lib/types/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SearchFiltersProps {
  brands: Brand[];
  categories: Category[];
}

const RATING_STEPS = [0, 1, 2, 3, 4, 5];
const MAX_PRICE = 5000;

export function SearchFilters({ brands, categories }: SearchFiltersProps) {
  const [brandId, setBrandId] = useQueryState("brand", { defaultValue: "", shallow: false });
  const [categoryId, setCategoryId] = useQueryState("category", { defaultValue: "", shallow: false });
  const [minPrice, setMinPrice] = useQueryState("minPrice", parseAsInteger.withDefault(0));
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsInteger.withDefault(MAX_PRICE));
  const [minRating, setMinRating] = useQueryState("minRating", parseAsFloat.withDefault(0));

  const activeCount = [brandId, categoryId, minPrice > 0, maxPrice < MAX_PRICE, minRating > 0].filter(Boolean).length;

  function clearAll() {
    setBrandId(null);
    setCategoryId(null);
    setMinPrice(null);
    setMaxPrice(null);
    setMinRating(null);
  }

  function handleMinInput(raw: string) {
    const v = parseInt(raw, 10);
    if (!isNaN(v) && v >= 0 && v < maxPrice) setMinPrice(v || null);
  }

  function handleMaxInput(raw: string) {
    const v = parseInt(raw, 10);
    if (!isNaN(v) && v > minPrice && v <= MAX_PRICE) setMaxPrice(v === MAX_PRICE ? null : v);
  }

  return (
    <Sheet>
      <SheetTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2 shrink-0")}>
        <SlidersHorizontal size={15} />
        Filters
        {activeCount > 0 && (
          <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] ml-0.5">
            {activeCount}
          </Badge>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="w-[340px] p-0 overflow-y-auto flex flex-col">
        {/* header */}
        <SheetHeader className="px-5 py-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-semibold">Filters</SheetTitle>
            {activeCount > 0 && (
              <Badge variant="secondary" className="text-xs tabular-nums">
                {activeCount} active
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="flex flex-col pb-6 overflow-y-auto flex-1">

          {/* ── Category ───────────────────────────────────────────── */}
          <FilterSection icon={LayoutGrid} title="Category">
            <div className="flex flex-wrap gap-1.5">
              <ChipButton
                active={categoryId === ""}
                onClick={() => setCategoryId(null)}
              >
                All
              </ChipButton>
              {categories.map((c) => (
                <ChipButton
                  key={c._id}
                  active={categoryId === c._id}
                  onClick={() => setCategoryId(c._id === categoryId ? null : c._id)}
                >
                  {c.name}
                </ChipButton>
              ))}
            </div>
          </FilterSection>

          <Divider />

          {/* ── Brand ──────────────────────────────────────────────── */}
          <FilterSection icon={Tag} title="Brand">
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
              <ChipButton
                active={brandId === ""}
                onClick={() => setBrandId(null)}
              >
                All brands
              </ChipButton>
              {brands.map((b) => (
                <ChipButton
                  key={b._id}
                  active={brandId === b._id}
                  onClick={() => setBrandId(b._id === brandId ? null : b._id)}
                >
                  {b.name}
                </ChipButton>
              ))}
            </div>
          </FilterSection>

          <Divider />

          {/* ── Price range ────────────────────────────────────────── */}
          <FilterSection icon={DollarSign} title="Price range">
            <div className="space-y-4">
              <Slider
                min={0}
                max={MAX_PRICE}
                step={50}
                value={[minPrice, maxPrice]}
                onValueChange={(v) => {
                  const [lo, hi] = v as number[];
                  setMinPrice(lo || null);
                  setMaxPrice(hi === MAX_PRICE ? null : hi);
                }}
              />
              <div className="flex items-center gap-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Min</Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                    <Input
                      type="number"
                      min={0}
                      max={maxPrice - 1}
                      value={minPrice}
                      onChange={(e) => handleMinInput(e.target.value)}
                      className="h-8 pl-5 text-xs"
                    />
                  </div>
                </div>
                <span className="text-muted-foreground mt-5 text-sm">–</span>
                <div className="flex-1 space-y-1">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Max</Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                    <Input
                      type="number"
                      min={minPrice + 1}
                      max={MAX_PRICE}
                      value={maxPrice}
                      onChange={(e) => handleMaxInput(e.target.value)}
                      className="h-8 pl-5 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </FilterSection>

          <Divider />

          {/* ── Min rating ─────────────────────────────────────────── */}
          <FilterSection
            icon={Star}
            iconClassName="text-amber-500 fill-amber-500"
            iconBg="bg-amber-100"
            title="Min. rating"
            trailing={
              minRating > 0 ? (
                <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Star size={10} className="fill-amber-500 text-amber-500" />
                  {minRating}+
                </span>
              ) : null
            }
          >
            <div className="flex gap-1.5">
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
          </FilterSection>

        </div>

        {/* sticky footer */}
        <div className="px-5 py-4 border-t shrink-0">
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
      </SheetContent>
    </Sheet>
  );
}

/* ── sub-components ───────────────────────────────────────────────────────── */

function FilterSection({
  icon: Icon,
  iconClassName = "text-primary",
  iconBg = "bg-primary/10",
  title,
  trailing,
  children,
}: {
  icon: React.ElementType;
  iconClassName?: string;
  iconBg?: string;
  title: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 py-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", iconBg)}>
          <Icon size={13} className={iconClassName} />
        </div>
        <Label className="text-sm font-semibold">{title}</Label>
        {trailing && <div className="ml-auto">{trailing}</div>}
      </div>
      {children}
    </section>
  );
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-7 px-3 text-xs rounded-full border font-medium transition-all",
        active
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-5 h-px bg-border" />;
}
