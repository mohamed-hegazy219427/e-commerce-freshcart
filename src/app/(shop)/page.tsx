"use client";

import { Suspense } from "react";
import { useQueryState, parseAsInteger, parseAsFloat } from "nuqs";
import { ChevronLeft, ChevronRight, X, SlidersHorizontal } from "lucide-react";
import { useProducts } from "@/lib/hooks/useProducts";
import { useBrands } from "@/lib/hooks/useBrands";
import { useCategories } from "@/lib/hooks/useCategories";
import { ProductCard } from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductGrid";
import { HomeCarousel } from "@/components/HomeCarousel";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "", label: "Relevance" },
  { value: "price", label: "Price ↑" },
  { value: "-price", label: "Price ↓" },
  { value: "-ratingsAverage", label: "Top rated" },
  { value: "-createdAt", label: "Newest" },
];

export default function HomePage() {
  return (
    <Suspense>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const [keyword] = useQueryState("keyword", { defaultValue: "" });
  const [brandId, setBrandId] = useQueryState("brand", { defaultValue: "" });
  const [categoryId, setCategoryId] = useQueryState("category", { defaultValue: "" });
  const [minPrice, setMinPrice] = useQueryState("minPrice", parseAsInteger.withDefault(0));
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsInteger.withDefault(5000));
  const [minRating, setMinRating] = useQueryState("minRating", parseAsFloat.withDefault(0));
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const filters = {
    ...(keyword && { keyword }),
    ...(brandId && { "brand[in][]": brandId }),
    ...(categoryId && { "category[in][]": categoryId }),
    ...(minPrice > 0 && { "price[gte]": minPrice }),
    ...(maxPrice < 5000 && { "price[lte]": maxPrice }),
    ...(minRating > 0 && { "ratingsAverage[gte]": minRating }),
    ...(sort && { sort }),
    page,
  };

  const { data: productsData, isLoading } = useProducts(filters);
  const { data: brandsData } = useBrands();
  const { data: categoriesData } = useCategories();

  const products = productsData?.data ?? [];
  const meta = productsData?.metadata;
  const brands = brandsData?.data ?? [];
  const categories = categoriesData?.data ?? [];

  const activeFilterCount = [brandId, categoryId, minPrice > 0, maxPrice < 5000, minRating > 0].filter(Boolean).length;

  function clearAllFilters() {
    setBrandId(null);
    setCategoryId(null);
    setMinPrice(null);
    setMaxPrice(null);
    setMinRating(null);
  }

  const activeBrandName = brands.find((b) => b._id === brandId)?.name;
  const activeCategoryName = categories.find((c) => c._id === categoryId)?.name;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <HomeCarousel />

      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchBar />
        <SearchFilters brands={brands} categories={categories} />
      </div>

      {/* sort pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium mr-1">Sort:</span>
        {SORT_OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => { setSort(o.value || null); setPage(1); }}
            className={cn(
              "h-7 px-3 text-xs rounded-full border font-medium transition-all",
              sort === o.value
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <SlidersHorizontal size={12} /> Active filters:
          </span>

          {categoryId && (
            <FilterChip
              label={activeCategoryName ?? "Category"}
              onRemove={() => { setCategoryId(null); setPage(1); }}
            />
          )}
          {brandId && (
            <FilterChip
              label={activeBrandName ?? "Brand"}
              onRemove={() => { setBrandId(null); setPage(1); }}
            />
          )}
          {(minPrice > 0 || maxPrice < 5000) && (
            <FilterChip
              label={`$${minPrice.toLocaleString()} – $${maxPrice.toLocaleString()}`}
              onRemove={() => { setMinPrice(null); setMaxPrice(null); setPage(1); }}
            />
          )}
          {minRating > 0 && (
            <FilterChip
              label={`${minRating}★ and up`}
              onRemove={() => { setMinRating(null); setPage(1); }}
            />
          )}

          <button
            onClick={clearAllFilters}
            className="text-xs text-muted-foreground hover:text-destructive underline underline-offset-2 ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* grid */}
      {isLoading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="py-24 text-center text-muted-foreground">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          {meta && (
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{products.length}</span> of{" "}
              <span className="font-semibold text-foreground">{meta.numberOfPages * (meta.limit ?? products.length)}</span> products
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}

      {/* pagination */}
      {meta && meta.numberOfPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="icon"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft size={16} />
          </Button>
          {Array.from({ length: meta.numberOfPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="icon"
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            disabled={page >= meta.numberOfPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 h-6 pl-2.5 pr-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
      {label}
      <button
        onClick={onRemove}
        className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-primary/20 transition-colors"
      >
        <X size={10} />
      </button>
    </span>
  );
}
