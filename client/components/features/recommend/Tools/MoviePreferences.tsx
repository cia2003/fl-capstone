import { FilmToolPart } from "@/types/chat";
import ToolState from "./ToolState";

type MoviePreferencesProps = {
  part: Extract<FilmToolPart, { type: "tool-askMoviePreferences" }>;
  addToolOutput: (args: {
    tool: "askMoviePreferences";
    toolCallId: string;
    output: string;
    state: "output-available";
  }) => void;
};

export default function MoviePreferences({
  part,
  addToolOutput,
}: MoviePreferencesProps) {
  const callId = part.toolCallId;

  const handleSelect = (option: string) => {
    addToolOutput({
      tool: "askMoviePreferences",
      toolCallId: callId,
      output: option,
      state: "output-available",
    });
  };

  const result =
    part.input?.options?.filter(
      (option): option is string => option !== undefined
    ) ?? [];

  return (
    <ToolState
      state={part.state}
      title="Movie preferences"
      streamingText="Preparing a preference question..."
      availableContent={
        <div className="space-y-4">
          <p className="text-sm">
            {part.input?.question}
          </p>

          <div className="flex flex-wrap gap-2">
            {result.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option || "")}
                className="rounded-full border px-4 py-2 text-sm transition hover:bg-muted cursor-pointer"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      }
      outputContent={
        <p className="text-sm font-medium">
          Preference selected: {part.output}
        </p>
      }
      errorText={part.errorText}
    />
  );
}