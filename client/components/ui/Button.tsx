import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ChatStatus = "ready" | "submitted" | "streaming" | "error";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  idleLabel?: string;
  loadingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  idleIcon?: ReactNode;
  loadingIcon?: ReactNode;
  successIcon?: ReactNode;
  errorIcon?: ReactNode;
  loadingMinDuration?: number;
  successDuration?: number;
  chatStatus?: ChatStatus;
  chatError?: unknown;
  onAction?: () => void | Promise<void>;
};

export function Button({
  children,
  className,
  disabled,
  idleLabel,
  loadingLabel = "Loading...",
  successLabel = "Done",
  errorLabel = "Retry",
  idleIcon,
  loadingIcon,
  successIcon,
  errorIcon,
  loadingMinDuration = 0,
  successDuration = 700,
  chatStatus,
  chatError,
  onAction,
  onClick,
  variant = "primary",
  ...props
}: ButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const loadingStartedAt = useRef<number | null>(null);
  const completionTimeout = useRef<number | null>(null);
  const chatResetTimeout = useRef<number | null>(null);
  const previousChatStatus = useRef<ChatStatus | undefined>(chatStatus);
  const [chatActionStarted, setChatActionStarted] = useState(false);
  const [chatActionCompleted, setChatActionCompleted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lifecycleEnabled = onAction !== undefined;
  const usesChatLifecycle = chatStatus !== undefined;

  useEffect(() => {
    if (!usesChatLifecycle) return;

    const wasLoading =
      previousChatStatus.current === "submitted" ||
      previousChatStatus.current === "streaming";

    if (chatActionStarted && (chatStatus === "submitted" || chatStatus === "streaming")) {
      // New action started — cancel any pending reset left over from a previous success.
      if (chatResetTimeout.current !== null) {
        window.clearTimeout(chatResetTimeout.current);
        chatResetTimeout.current = null;
      }
      setChatActionCompleted(false);
    } else if (chatActionStarted && wasLoading && chatStatus === "ready" && !chatError) {
      setChatActionCompleted(true);
    }

    previousChatStatus.current = chatStatus;
  }, [chatActionStarted, chatError, chatStatus, usesChatLifecycle]);

  const currentStatus = usesChatLifecycle
    ? !chatActionStarted
      ? "idle"
      : chatError || chatStatus === "error"
      ? "error"
      : chatStatus === "submitted" || chatStatus === "streaming"
        ? "loading"
        : chatActionCompleted
          ? "success"
          : "idle"
    : status;

  const lifecycleLabel = lifecycleEnabled
    ? { idle: idleLabel, loading: loadingLabel, success: successLabel, error: errorLabel }[currentStatus]
    : undefined;

  const lifecycleIcon = lifecycleEnabled
    ? { idle: idleIcon, loading: loadingIcon, success: successIcon, error: errorIcon }[currentStatus]
    : undefined;

  // Manual mode: auto-return to idle after success.
  useEffect(() => {
    if (usesChatLifecycle || status !== "success") return;

    const timeout = window.setTimeout(() => setStatus("idle"), successDuration);
    return () => window.clearTimeout(timeout);
  }, [status, successDuration, usesChatLifecycle]);

  // Chat-driven mode: same auto-return, same duration. Cancelled above if a
  // new action starts before it fires.
  useEffect(() => {
    if (!usesChatLifecycle || !chatActionCompleted) return;

    chatResetTimeout.current = window.setTimeout(() => {
      chatResetTimeout.current = null;
      setChatActionStarted(false);
      setChatActionCompleted(false);
    }, successDuration);

    return () => {
      if (chatResetTimeout.current !== null) {
        window.clearTimeout(chatResetTimeout.current);
        chatResetTimeout.current = null;
      }
    };
  }, [chatActionCompleted, successDuration, usesChatLifecycle]);

  useEffect(() => {
    return () => {
      if (completionTimeout.current !== null) window.clearTimeout(completionTimeout.current);
      if (chatResetTimeout.current !== null) window.clearTimeout(chatResetTimeout.current);
    };
  }, []);

  // Focus management: keep focus on the button after success/error so
  // keyboard and screen reader users don't lose their place.
  useEffect(() => {
    if (currentStatus === "success" || currentStatus === "error") {
      buttonRef.current?.focus();
    }
  }, [currentStatus]);

  const handleClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"] = (event) => {
    onClick?.(event);

    if (!onAction || currentStatus === "loading") return;

    if (usesChatLifecycle) {
      setChatActionStarted(true);
      void Promise.resolve(onAction()).catch(() => undefined);
      return;
    }

    loadingStartedAt.current = Date.now();
    setStatus("loading");

    const finish = (nextStatus: "success" | "error") => {
      const elapsed = Date.now() - (loadingStartedAt.current ?? Date.now());
      const remaining = Math.max(0, loadingMinDuration - elapsed);

      if (remaining === 0) {
        setStatus(nextStatus);
        return;
      }

      completionTimeout.current = window.setTimeout(() => {
        completionTimeout.current = null;
        setStatus(nextStatus);
      }, remaining);
    };

    try {
      Promise.resolve(onAction()).then(
        () => finish("success"),
        () => finish("error")
      );
    } catch {
      finish("error");
    }
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        "group rounded-button px-button-x py-button-y text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        variant === "primary"
          ? "bg-accent text-[#21170d] hover:bg-accent/85"
          : "border-[1.5px] border-primary bg-transparent text-primary hover:bg-primary/10",
        className
      )}
      disabled={disabled || currentStatus === "loading"}
      onClick={handleClick}
      aria-live={lifecycleEnabled ? "polite" : undefined}
      aria-busy={lifecycleEnabled && currentStatus === "loading" ? true : undefined}
      data-button-state={lifecycleEnabled ? currentStatus : undefined}
      {...props}
    >
      <span
        key={lifecycleEnabled ? currentStatus : "content"}
        className={cn("inline-flex items-center gap-2", lifecycleEnabled && "animate-label-in motion-reduce:animate-none")}
      >
        {lifecycleEnabled && lifecycleIcon && (
          <span
            className={cn(
              "inline-flex [&>svg]:size-4 motion-reduce:animate-none motion-reduce:transition-none",
              currentStatus === "idle" && "transition-transform duration-300 group-hover:rotate-180",
              currentStatus === "loading" && "animate-spin",
              currentStatus === "success" && "animate-success-pop",
              currentStatus === "error" && "animate-error-shake"
            )}
          >
            {lifecycleIcon}
          </span>
        )}
        {lifecycleLabel ?? children}
      </span>
    </button>
  );
}