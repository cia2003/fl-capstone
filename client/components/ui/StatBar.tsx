type StatBarProps = {
  label: string;
  value: number;
  max?: number;
};

export function StatBar({ label, value, max = 100 }: StatBarProps) {
  const width = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-700">{label}</span>
        <span className="text-zinc-500">{value}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200" aria-hidden="true">
        <div
          className="h-full rounded-full bg-zinc-900 transition-all"
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="sr-only">{label}: {value} out of {max}</span>
    </div>
  );
}
