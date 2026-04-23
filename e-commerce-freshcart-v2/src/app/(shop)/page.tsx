"use client";

import { useQueryState, parseAsInteger, parseAsFloat } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts } from "@/lib/api/products";
import { getBrands } from "@/lib/api/brands";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid";
import { HomeCarousel } from "@/components/home-carousel";
import { SearchBar } from "@/components/search-bar";
import { SearchFilters } from "@/components/search-filters";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [keyword] = useQueryState("keyword", { defaultValue: "" });
  const [brandId] = useQueryState("brand", { defaultValue: "" });
  const [minPrice] = useQueryState("minPrice", parseAsInteger.withDefault(0));
  const [maxPrice] = useQueryState("maxPrice", parseAsInteger.withDefault(5000));
  const [minRating] = useQueryState("minRating", parseAsFloat.withDefault(0));
  const [sort] = useQueryState("sort", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const filters = {
    ...(keyword && { keyword }),
    ...(brandId && { "brand[in][]": brandId }),
    ...(minPrice > 0 && { "price[gte]": minPrice }),
    ...(maxPrice < 5000 && { "price[lte]": maxPrice }),
    ...(minRating > 0 && { "ratingsAverage[gte]": minRating }),
    ...(sort && { sort }),
    page,
  };

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
    staleTime: Infinity,
  });

  const products = productsData?.data ?? [];
  const meta = productsData?.metadata;
  const brands = brandsData?.data ?? [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <HomeCarousel />

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar />
        <SearchFilters brands={brands} />
      </div>

      {productsLoading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="py-24 text-center text-muted-foreground">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {meta && meta.numberOfPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline" size="icon"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </Button>
          {Array.from({ length: meta.numberOfPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="icon"
              onClick={() => setPage(p)}
              aria-label={`Page ${p}`}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline" size="icon"
            disabled={page >= meta.numberOfPages}
            onClick={() => setPage(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
