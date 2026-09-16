import Image from "next/image";
import Link from "next/link";

export function CategoryCard({
    category,
    description,
    imageUrl,
    href,
}: {
    category: string;
    description: string;
    imageUrl: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="relative w-full h-48 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform transform hover:scale-105"
        >
            <Image
                src={imageUrl}
                alt={category}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
            />

            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center p-4">
                <h3 className="text-white text-xl font-semibold">{category}</h3>
                <p className="text-white text-sm mt-2">{description}</p>
            </div>
        </Link>
    );
}