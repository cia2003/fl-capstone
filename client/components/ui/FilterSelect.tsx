// components/ui/FilterSelect.tsx
import type { SelectHTMLAttributes } from "react";

type FilterSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string; label: string }[];
};

export function FilterSelect({
  label,
  options,
  value,
  className = "",
  ...props
}: FilterSelectProps) {
  const hasValue = Boolean(value);
  const labelId = `filter-select-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className="relative">
      <label htmlFor={labelId} className="sr-only">
        {label}
      </label>
      <select
        id={labelId}
        value={value}
        className={`peer min-w-0 w-full rounded-md border bg-background px-3 pb-2 pt-4 text-sm outline-none hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${className}`}
        {...props}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <span
        className={`pointer-events-none absolute left-3 bg-background px-1 transition-all duration-150 ${
          hasValue
            ? "-top-2 text-xs font-medium text-primary"
            : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
