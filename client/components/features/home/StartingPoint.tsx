import { CategoryCard } from "@/components/features/films/CategoryCard";
import SpiritedAwayImage from "@/public/images/category/spirited-away-thumb.jpg";
import TotoroImage from "@/public/images/category/totoro-thumb.jpg";
import CatReturnsImage from "@/public/images/category/cat-returns-thumb.jpg";


export function StartingPoint() {
  return (
    <section className="mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
        <div className="mx-auto max-w-[1280px] pt-section-mobile md:pt-section-desktop">
            <h2 className="mb-4 text-2xl font-semibold">Where Should I Start?</h2>
            <p className="mb-6 text-sm text-muted-foreground">
                Not sure where to begin your Studio Ghibli journey? Explore our curated categories to find the perfect starting point for your adventure.
            </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mx-auto max-w-[1280px]">
            <CategoryCard category="Highly Rated" description="Experience the magic of animation with Studio Ghibli's timeless classics." imageUrl={SpiritedAwayImage.src} />
            <CategoryCard category="Classics" description="Dive into fantastical worlds and imaginative storytelling." imageUrl={TotoroImage.src} />
            <CategoryCard category="Short & Simple" description="Embark on thrilling adventures with unforgettable characters." imageUrl={CatReturnsImage.src} />
        </div>
    </section>
  );
}