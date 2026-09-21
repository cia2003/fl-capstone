import HeroDesktopImage from "@/public/images/home/ghibli-desktop-hero.webp";
import HeroMobileImage from "@/public/images/home/ghibli-mobile-hero.webp";
import type { Film } from "@/types/film";
import Image from "next/image";
import { HeroActions } from "./HeroActions";
import { HeroShader } from "./HeroShader";

export function GhibliHero({ films }: { films: Film[] }) {
  return (
    <section className="relative overflow-hidden">
      {/*
        Lapisan paling belakang. HeroShader menulis --hero-px / --hero-py (-1..1)
        ke <section> ini, jadi gambar bergeser sedikit berlawanan arah pointer.
        scale(1.04) menyisakan margin agar tepi gambar tidak terlihat saat bergeser.
        Tanpa JS / WebGL, variabel bernilai 0 dan gambar diam.
      */}
      <picture
        className="absolute inset-0 will-change-transform"
        style={{
          transform:
            "translate3d(calc(var(--hero-px, 0) * -14px), calc(var(--hero-py, 0) * 8px), 0) scale(1.04)",
        }}
      >
        <source
          media="(max-width: 767px)"
          srcSet={HeroMobileImage.src}
        />

        <Image
          src={HeroDesktopImage}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
      </picture>

      {/* Awan berlapis (three.js). Harus anak langsung <section>. */}
      <HeroShader className="absolute inset-0" />

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
        <div className="mx-auto max-w-[1280px] py-section-mobile md:py-section md:h-100 grid grid-cols-2 items-center">
          <div>
            <p className="text-caption font-medium tracking-caption text-primary">
              {films.length} FILMS, ENDLESS STORIES
            </p>

            <h1 className="mt-2">
              Discover the Ghibli film that fits your mood.
            </h1>

            <p className="mt-4 max-w-2xl">
              Browse verified film details, save your favourites locally,
              or ask Ghibli Compass for a thoughtful starting point.
            </p>

            <HeroActions films={films} />            
          </div>

        </div>
      </div>
    </section>
  );
}