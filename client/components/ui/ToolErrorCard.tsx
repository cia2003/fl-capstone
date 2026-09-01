type ToolErrorCardProps = {
  title: string
  message: string
  actionType?: "regenerate" | "new-chat"
  onRegenerate?: () => void
  onNewChat?: () => void
}

export function ToolErrorCard({
  title,
  message,
  actionType = "new-chat",
  onRegenerate,
  onNewChat,
}: ToolErrorCardProps) {
  const actionLabel = actionType === "regenerate" ? "Regenerate response" : "Start a new chat"

  const handleAction = () => {
    if (actionType === "regenerate") {
      onRegenerate?.()
      return
    }

    onNewChat?.()
  }

  return (
    <div
      role="alert"
      className="max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-red-900"
    >
      <div className="flex gap-3">
        <div
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100"
        >
          ⚠️
        </div>

        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>

          <p role="alert" className="mt-1 text-sm text-red-700 text-primary">
            {message}
          </p>

          <button
            type="button"
            onClick={handleAction}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 cursor-pointer"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}