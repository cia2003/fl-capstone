type ComparisonPanelProps = {
  title?: string;
  summary?: string;
};

export function ComparisonPanel({
  title = "Breed comparison",
  summary = "AI-ranked comparison output will appear here.",
}: ComparisonPanelProps) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
      <p className="mt-3 text-sm text-zinc-600">{summary}</p>
    </section>
  );
}
