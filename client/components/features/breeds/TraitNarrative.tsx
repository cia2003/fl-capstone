type TraitNarrativeProps = {
  title: string;
  summary?: string;
};

export function TraitNarrative({ title, summary = "Trait interpretation will be generated here." }: TraitNarrativeProps) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{summary}</p>
    </section>
  );
}
