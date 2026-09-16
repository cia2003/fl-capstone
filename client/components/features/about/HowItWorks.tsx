// components/features/about/HowItWorks.tsx
import Image from "next/image";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Choose Your Mood",
      description:
        "Start with how you're feeling or what kind of story you're looking for.",
      image: "/images/about/how-it-works/point-1-image-about.jpg",
      alt: "Mei exploring the forest with Totoro",
    },
    {
      number: "02",
      title: "Tell Us Your Preferences",
      description:
        "Share your interests, favourite themes, or the kind of Ghibli story you enjoy.",
      image: "/images/about/how-it-works/point-2-image-about.jpg",
      alt: "Shizuku reaching for a book in Whisper of the Heart",
    },
    {
      number: "03",
      title: "Get Your Recommendations",
      description:
        "Ghibli Compass finds films that match what you're looking for.",
      image: "/images/about/how-it-works/point-3-image-about.jpg",
      alt: "Kiki flying over the city",
    },
    {
      number: "04",
      title: "Discover Your Next Story",
      description:
        "Explore the recommendations and find a film worth watching.",
      image: "/images/about/how-it-works/point-4-image-about.jpg",
      alt: "Chihiro and No-Face riding the train in Spirited Away",
    },
  ];

  return (
    <section className="relative">
      <div
        className="
          mx-5
          rounded-[10px]
          border
          border-primary/20
          bg-background
          px-10
          py-5
          shadow-md
          md:mx-10
          lg:mx-16
          min-[1440px]:mx-24
        "
      >
        <div className="mx-auto max-w-[1280px] py-section-mobile md:py-section">
          <div className="max-w-xl">
            <h2>How it works.</h2>

            <p className="mt-2 text-sm leading-relaxed text-text/80 md:text-base">
              Get personalized recommendations in just a few steps.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="flex items-start gap-4 md:block">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/40 text-caption font-semibold text-primary md:h-12 md:w-12">
                    {step.number}
                  </div>

                  <div className="pt-1 md:mt-5 md:pt-0">
                    <h3 className="text-sm lg:text-base">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-text/80">
                      {step.description}
                    </p>

                    <div className="relative mt-5 aspect-[4/3] w-full overflow-hidden rounded-[8px]">
                      <Image
                        src={step.image}
                        alt={step.alt}
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {index < steps.length && (
                  <div className="absolute left-14 top-5 hidden h-px w-[calc(100%-3.5rem)] bg-primary/20 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}