"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const SLIDES = [
  { src: "https://ecommerce.routemisr.com/Route-Academy-projects/1681291680621.jpeg", alt: "Slide 1" },
  { src: "https://ecommerce.routemisr.com/Route-Academy-projects/1681291733972.jpeg", alt: "Slide 2" },
  { src: "https://ecommerce.routemisr.com/Route-Academy-projects/1681291703016.jpeg", alt: "Slide 3" },
];

export function HomeCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  return (
    <div className="overflow-hidden rounded-xl" ref={emblaRef}>
      <div className="flex">
        {SLIDES.map((slide) => (
          <div key={slide.src} className="relative flex-[0_0_100%] aspect-[16/5]">
            <Image src={slide.src} alt={slide.alt} fill className="object-cover" priority />
          </div>
        ))}
      </div>
    </div>
  );
}
