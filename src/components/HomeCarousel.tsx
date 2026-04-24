"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const SLIDES = [
  { src: "/assets/homeSlider1.png", alt: "Black Friday Sale" },
  { src: "/assets/homeSlider2.jpg", alt: "Fresh Deals" },
  { src: "/assets/homeSlider3.jpg", alt: "New Arrivals" },
  { src: "/assets/homeSlider4.jpg", alt: "Best Sellers" },
  { src: "/assets/homeSlider5.jpg", alt: "Special Offers" },
  { src: "/assets/homeSlider6.jpg", alt: "Top Picks" },
];

export function HomeCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  return (
    <div className="overflow-hidden rounded-xl shadow" ref={emblaRef}>
      <div className="flex">
        {SLIDES.map((slide) => (
          <div key={slide.src} className="relative flex-[0_0_100%] aspect-16/5">
            <Image src={slide.src} alt={slide.alt} fill className="object-cover" priority />
          </div>
        ))}
      </div>
    </div>
  );
}
