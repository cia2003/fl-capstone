import { Button } from "@/components/ui";

type ChatHeaderProps = {
  onPrompt: (prompt: string) => void;
};

export function ChatHeader({ onPrompt }: ChatHeaderProps) {
  return (
    <>
      <p className="text-caption font-medium tracking-caption text-primary">GHIBLI COMPASS</p>
      <h1 className="mt-2">What kind of story do you need?</h1>
      <p className="mt-4">Describe a feeling, pace, or theme. Recommendations are ranked against the verified Ghibli film list.</p>
      <div className="mt-6 flex gap-3 align-center justify-center">
        <Button
          type="button"
          idleLabel="Help me find my preferences"
          loadingLabel="Preparing..."
          successLabel="Ready"
          errorLabel="Retry"
          onAction={() => onPrompt("Help me find my preferences")}
        >
        </Button>
        <Button
          type="button"
          idleLabel="Show me a random film"
          loadingLabel="Preparing..."
          successLabel="Ready"
          errorLabel="Retry"
          onAction={() => onPrompt("Show me a random film")}
        >
        </Button>
      </div>
    </>
  );
}
