import Image from "next/image";
import Link from "next/link";

export function CategoryCard({
  category,
  description,
  imageUrl,
  imageAlt,
  href,
}: {
  category: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="relative h-48 w-full cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
        quality={75}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-4 text-center">
        <h3 className="text-xl font-semibold text-white">{category}</h3>
        <p className="mt-2 text-sm text-white">{description}</p>
      </div>
    </Link>
  );
}