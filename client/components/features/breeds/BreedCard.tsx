type BreedCardProps = {
  name: string;
  description?: string;
};

export function BreedCard({ name, description = "Breed details coming soon." }: BreedCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-zinc-900">{name}</h3>
      <p className="mt-2 text-sm text-zinc-600">{description}</p>
    </article>
  );
}
