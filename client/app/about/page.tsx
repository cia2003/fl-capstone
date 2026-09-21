import { AboutHero } from "@/components/features/about/AboutHero";
import { HowItWorks } from "@/components/features/about/HowItWorks";
import { AboutData } from "@/components/features/about/AboutData";

export default async function Page() {
  return (
    <main id="main-content" tabIndex={-1} role="main" className="bg-background">
      <AboutHero />
      <HowItWorks />
      <AboutData />
    </main>
  );
}
