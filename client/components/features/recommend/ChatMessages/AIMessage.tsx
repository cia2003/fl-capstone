import type { Film } from "@/types";
import ReactMarkdown from "react-markdown";
import { FilmToolPart, FilmUIMessage } from "@/types/chat";
import ToolPart from "../Tools/ToolPart";

type AddToolOutput = (args: {
  tool: "askMoviePreferences";
  toolCallId: string;
  output: string;
}) => void;

type AIMessageProps = {
  message: FilmUIMessage;
  films: Film[];
  loading: boolean;
  onNewChat: () => void;
  addToolOutput: AddToolOutput;
};

function isFilmToolPart(
  part: FilmUIMessage["parts"][number]
): part is FilmToolPart {
  return (
    part.type === "tool-recommendMovies" ||
    part.type === "tool-getFilmInformation" ||
    part.type === "tool-askMoviePreferences"
  );
}

export function AIMessage({
  message,
  films,
  loading = false,
  onNewChat,
  addToolOutput,
}: AIMessageProps) {
  return (
    <div className="mt-6">
      {message.parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <div key={`text-${index}`} className="font-medium">
              <ReactMarkdown>
                {part.text}
              </ReactMarkdown>
            </div>
          );
        }

        if (isFilmToolPart(part)) {
          return (
            <ToolPart
              key={part.toolCallId}
              part={part}
              addToolOutput={addToolOutput}
              films={films}
            />
          );
        }

        return null;
      })}
    </div>
  );
}