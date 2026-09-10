import { Button } from "./Button"
import { LuCheck, LuLoaderCircle, LuRefreshCw, LuTriangleAlert } from "react-icons/lu"

type ToolErrorCardProps = {
  title: string
  message: string
  actionType?: "regenerate" | "new-chat"
  pending?: boolean
  onRegenerate?: () => void | Promise<void>
  onNewChat?: () => void | Promise<void>
  chatStatus?: "ready" | "submitted" | "streaming" | "error"
  chatError?: unknown
}

export function ToolErrorCard({
  title,
  message,
  actionType = "new-chat",
  pending = false,
  onRegenerate,
  onNewChat,
  chatStatus,
  chatError,
}: ToolErrorCardProps) {
  const actionLabel = actionType === "regenerate" ? "Regenerate response" : "Start a new chat"

  const handleAction = () => {
    if (actionType === "regenerate") {
      return onRegenerate?.()
    }

    return onNewChat?.()
  }

  const isDisabled = !onRegenerate && !onNewChat

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

          <p role={pending ? undefined : "alert"} className="mt-1 text-sm text-red-700 text-primary">
            {message}
          </p>

          <Button
            type="button"
            idleLabel={actionLabel}
            loadingLabel="Regenerating..."
            successLabel="Regenerated"
            errorLabel="Retry"
            idleIcon={<LuRefreshCw aria-hidden="true" />}
            loadingIcon={<LuLoaderCircle aria-hidden="true" />}
            successIcon={<LuCheck aria-hidden="true" />}
            errorIcon={<LuTriangleAlert aria-hidden="true" />}
            loadingMinDuration={800}
            successDuration={700}
            onAction={handleAction}
            chatStatus={chatStatus}
            chatError={chatError}
            disabled={isDisabled}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-red-400 disabled:hover:bg-red-400"
          />
        </div>
      </div>
    </div>
  )
}