"use client";

type FilterSelectProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
};

export function FilterSelect({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onChange,
}: FilterSelectProps) {
  const selected = options.find((option) => option.value === value);

  const hasValue = Boolean(value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="relative flex w-full items-center justify-between rounded-md border bg-background px-3 pb-2 pt-4 text-left text-sm outline-none hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
      >
        <span
          className={
            value ? "text-foreground" : "text-muted-foreground"
          }
        >
          {selected?.label ?? label}
        </span>

        <span
          aria-hidden="true"
          className={`transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>

        {/* Floating label */}
        <span
          className={`pointer-events-none absolute left-3 bg-background px-1 transition-all duration-150 ${
            hasValue || isOpen
              ? "-top-2 text-xs font-medium text-primary"
              : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
          }`}
        >
          {label}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-md border bg-background shadow-lg">
          <button
            type="button"
            className={`w-full px-3 py-3 text-left text-sm hover:bg-primary/10 ${
              !value ? "font-medium" : ""
            }`}
            onClick={() => onChange("")}
          >
            {label}
          </button>

          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`w-full px-3 py-3 text-left text-sm hover:bg-primary/10 ${
                option.value === value
                  ? "bg-primary/10 font-medium"
                  : ""
              }`}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}