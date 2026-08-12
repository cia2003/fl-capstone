type BreedDetailPageProps = {
  params: {
    id: string;
  };
};

export default function BreedDetailPage({ params }: BreedDetailPageProps) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Breed detail: {params.id}
      </h1>
      <p className="mt-3 text-zinc-600">
        This route will render raw breed stats and AI interpretation.
      </p>
    </main>
  );
}
