// components/features/home/GhibliHero.tsx
"use client";

import { Button } from "@/components/ui/Button";
import HeroDesktopImage from "@/public/images/home/ghibli-desktop-hero.jpg";
import HeroMobileImage from "@/public/images/home/ghibli-mobile-hero.jpg";

export function AboutHero() {

  return (
    <section className="relative overflow-hidden">
      {/* Responsive Hero Background */}
      <picture className="absolute inset-0">
        <source
          media="(max-width: 767px)"
          srcSet={HeroMobileImage.src}
        />
        <img
          src={HeroDesktopImage.src}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </picture>

      {/* Overlay */}
      <div
      className="
        absolute inset-0
        bg-gradient-to-t
        from-background
        via-background/50
        to-background/0
        md:bg-gradient-to-r
        md:from-background
        md:via-background/50
        md:to-background/0
      "
    />

      {/* Content */}
      <div className="relative mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
        <div className="mx-auto max-w-[1280px] py-section-mobile md:py-section">
          <h1 className="mt-2">
            Discover the Ghibli film that fits your mood.
          </h1>

          <p className="mt-4 max-w-2xl">
            Browse verified film details, save your favourites locally,
            or ask Ghibli Compass for a thoughtful starting point.
          </p>

          <div className="mt-8 flex items-center gap-3">
          </div>
        </div>
      </div>
    </section>
  );
}