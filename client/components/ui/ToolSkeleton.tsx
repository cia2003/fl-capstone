type ToolSkeletonProps = {
  variant?: "recommendations" | "film-information"
  ariaLabel?: string
  className?: string
}

export function ToolSkeleton({
  variant = "recommendations",
  ariaLabel = "Loading content",
  className = "",
}: ToolSkeletonProps) {
  const cardBase =
    "animate-pulse rounded-xl border border-border/60 bg-muted/40"

  if (variant === "film-information") {
    return (
      <div
        aria-label={ariaLabel}
        className={`space-y-3 ${className}`}
        role="status"
      >
        <div className={`${cardBase} h-5 w-40`} />
        <div className={`${cardBase} h-28 w-full`} />
        <div className="grid grid-cols-2 gap-3">
          <div className={`${cardBase} h-20 w-full`} />
          <div className={`${cardBase} h-20 w-full`} />
        </div>
      </div>
    )
  }

  return (
    <div
      aria-label={ariaLabel}
      className={`space-y-3 ${className}`}
      role="status"
    >
      <div className={`${cardBase} h-5 w-32`} />
      <div className="space-y-2">
        <div className={`${cardBase} h-12 w-full`} />
        <div className={`${cardBase} h-12 w-full`} />
        <div className={`${cardBase} h-12 w-full`} />
      </div>
    </div>
  )
}
