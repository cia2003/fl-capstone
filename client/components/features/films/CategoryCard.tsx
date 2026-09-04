
export function CategoryCard({ category, description, imageUrl }: { category: string; description: string; imageUrl: string }) {
    return (
        <div className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform transform hover:scale-105">
            <img src={imageUrl} alt={category} className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black/50 bg-opacity-50 flex flex-col justify-center items-center text-center p-4">
                <h3 className="text-white text-xl font-semibold">{category}</h3>
                <p className="text-white text-sm mt-2">{description}</p>
            </div>
        </div>
    );
}