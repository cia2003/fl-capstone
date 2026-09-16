import { LuDatabase, LuExternalLink, LuInfo } from "react-icons/lu";

export function AboutData() {
  const dataSources = [
    {
      number: "01",
      title: "Film Information",
      description:
        "Film titles, directors, release dates, runtimes, and other details are sourced from the Studio Ghibli film database.",
    },
    {
      number: "02",
      title: "Recommendations",
      description:
        "Recommendations are based on the information available for each film and the preferences you provide.",
    },
    {
      number: "03",
      title: "Your Watchlist",
      description:
        "Your saved films are stored locally in your browser. Ghibli Compass does not require an account to keep your watchlist.",
    },
  ];

  return (
    <section className="relative">
      <div className="mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
        <div className="mx-auto max-w-[1280px] py-section-mobile md:py-section">

          {/* Heading */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <LuDatabase
                  className="h-5 w-5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <h2>About the Data</h2>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-text/80 md:text-base">
              Ghibli Compass uses publicly available film information to help
              you explore Studio Ghibli movies. Here is a little more about
              what powers the experience.
            </p>

            {/* Source */}
            <a
              href="https://ghibliapi.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <LuDatabase
                className="h-4 w-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>Source: Ghibli API</span>

              <LuExternalLink
                className="h-3.5 w-3.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </a>
          </div>

          {/* Data Sources */}
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
            {dataSources.map((source) => (
              <div
                key={source.number}
                className="border-t border-primary/20 pt-5"
              >
                <span className="text-sm font-semibold text-primary">
                  {source.number}
                </span>

                <h3 className="mt-3">{source.title}</h3>

                <p className="mt-2 text-sm leading-relaxed text-text/80">
                  {source.description}
                </p>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-10 rounded-xl border border-primary/15 bg-primary/5 px-5 py-4 md:mt-14 md:px-6 md:py-5">
            <div className="flex items-center gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <LuInfo
                  className="h-4 w-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <p className="text-sm leading-relaxed text-text/75">
                <span className="font-medium text-text">A small note:</span>{" "}
                Ghibli Compass is an independent project and is not affiliated
                with or endorsed by Studio Ghibli.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}