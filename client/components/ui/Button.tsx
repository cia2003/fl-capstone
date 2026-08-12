type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const variantClasses =
    variant === "secondary"
      ? "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
      : "bg-zinc-900 text-white hover:bg-zinc-700";

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition ${variantClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
