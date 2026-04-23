"use client";

import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  images: string[];
  title: string;
}

export function ProductCarousel({ images, title }: ProductCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
      setSelectedIndex(index);
    },
    [emblaApi]
  );

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl bg-muted" ref={emblaRef}>
        <div className="flex">
          {images.map((src, i) => (
            <div key={src} className="relative flex-[0_0_100%] aspect-square">
              <Image src={src} alt={`${title} ${i + 1}`} fill className="object-contain p-4" />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <Button
              variant="secondary" size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80"
              onClick={() => scrollTo(Math.max(0, selectedIndex - 1))}
              aria-label="Previous image"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="secondary" size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80"
              onClick={() => scrollTo(Math.min(images.length - 1, selectedIndex + 1))}
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </Button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => scrollTo(i)}
              className={cn(
                "relative shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors",
                selectedIndex === i ? "border-primary" : "border-transparent"
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
