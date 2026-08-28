import { ReactNode } from "react";

type ToolStateProps = {
  state: string;
  title?: string;
  streamingText?: string;
  availableContent?: ReactNode;
  outputContent?: ReactNode;
  errorText?: string;
};

export default function ToolState({
  state,
  title = "AI tool",
  streamingText = "Preparing...",
  availableContent,
  outputContent,
  errorText,
}: ToolStateProps) {
  switch (state) {
    case "input-streaming":
      return (
        <div className="mt-5 bg-muted/40 mb-5">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />

            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-sm text-muted-foreground">
                {streamingText}
              </p>
            </div>
          </div>
        </div>
      );

    case "input-available":
      return (
        <div className="mt-5 bg-muted/40 mb-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />

            <p className="text-sm font-medium">
              {title}
            </p>
          </div>

          {availableContent}

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            Running tool...
          </div>
        </div>
      );

    case "output-available":
      return (
        <div className="mt-5 bg-background mb-5">
          {outputContent}
        </div>
      );

    case "output-error":
      return (
        <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/5 mb-5">
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-sm text-destructive">
              !
            </div>

            <div>
              <p className="text-sm font-medium">
                Something went wrong
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {errorText || "The tool could not complete the request."}
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}