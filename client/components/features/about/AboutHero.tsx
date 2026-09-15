// components/features/about/AboutHero.tsx
"use client";

import HeroDesktopImage from "@/public/images/about/kikis-delivery-desktop.jpg";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
        <div className="mx-auto max-w-[1280px] py-section-mobile md:py-section">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_1.15fr] md:gap-8 lg:gap-12">
            <div className="order-1 w-full md:order-2 md:justify-self-end">
              <img
                src={HeroDesktopImage.src}
                alt="Kiki overlooking a seaside town"
                className="
                  w-full
                  max-w-[700px]
                  object-contain
                  object-center

                  [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_92%)]
                  [-webkit-mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_92%)]

                  md:max-w-[650px]
                  lg:max-w-[700px]
                "
              />
            </div>

            <div className="order-2 md:order-1">
              <p className="text-caption font-medium tracking-caption text-primary">
                About
              </p>

              <h1 className="mt-2">Ghibli Compass</h1>

              <p className="mt-4 max-w-[420px] text-lg leading-relaxed md:text-xl lg:text-[22px]">
                A simpler way to find your next Ghibli story.
              </p>

              <p className="mt-4 max-w-[560px] text-sm leading-relaxed text-text/80 md:text-base">
                Ghibli Compass is a friendly guide for anyone who loves Studio
                Ghibli. Whether you&apos;re new to the world of Ghibli or a
                lifelong fan, our goal is to help you discover the perfect film
                — based on your mood, interests, and curiosity.
              </p>

              <div className="mt-6 flex items-center gap-3 md:justify-start">
                <div className="h-px flex-1 bg-primary/40" />
                <span className="text-primary" aria-hidden="true">
                  ✧
                </span>
                <div className="h-px flex-1 bg-primary/40 " />
              </div>

              <p className="mt-4 text-center font-heading text-base italic leading-relaxed text-primary md:mt-5 md:text-left md:text-lg">
                “Every journey begins
                with a single story.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}