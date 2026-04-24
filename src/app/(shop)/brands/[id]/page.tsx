"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { useQueryState, parseAsInteger } from "nuqs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBrands, useBrandProducts } from "@/lib/hooks/useBrands";
import { ProductCard } from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";

function BrandProductsContent() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const { data: brandsData } = useBrands();
  const { data, isLoading } = useBrandProducts(id, page);

  const brand = brandsData?.data.find((b) => b._id === id);
  const products = data?.data ?? [];
  const meta = data?.metadata;

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold">{brand?.name ?? "Brand"} Products</h1>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">No products found for this brand.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {meta && meta.numberOfPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft size={16} />
          </Button>
          {Array.from({ length: meta.numberOfPages }, (_, i) => i + 1).map((p) => (
            <Button key={p} variant={p === page ? "default" : "outline"} size="icon" onClick={() => setPage(p)}>
              {p}
            </Button>
          ))}
          <Button variant="outline" size="icon" disabled={page >= meta.numberOfPages} onClick={() => setPage(page + 1)}>
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function BrandProductsPage() {
  return (
    <Suspense>
      <BrandProductsContent />
    </Suspense>
  );
}
