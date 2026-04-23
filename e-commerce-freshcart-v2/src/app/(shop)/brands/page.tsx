"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { getBrands } from "@/lib/api/brands";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrandsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">All Brands</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data?.data.map((brand) => (
          <Link key={brand._id} href={`/brands/${brand._id}`}>
            <Card className="flex flex-col items-center justify-center gap-3 p-4 aspect-square hover:shadow-md hover:border-primary transition-all cursor-pointer group">
              <div className="relative w-16 h-16">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-200"
                />
              </div>
              <p className="text-sm font-medium text-center leading-tight">{brand.name}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
