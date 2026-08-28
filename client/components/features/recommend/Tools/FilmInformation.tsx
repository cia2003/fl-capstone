import ToolState from "./ToolState";
import { FilmCard } from "../../films/FilmCard";
import { FilmToolPart } from "@/types/chat";
import { Film } from "@/types";

type FilmInformationProps = {
  part: Extract<FilmToolPart, { type: "tool-getFilmInformation" }>;
};

export default function FilmInformation({
  part,
}: FilmInformationProps) {
  const result = part.output?.film as Film
  return (
    <ToolState
      state={part.state}
      title="Film information"
      streamingText="Preparing your film lookup..."
      availableContent={
        <p className="text-sm text-muted-foreground">
          Looking for information about{" "}
          <span className="font-medium text-foreground">
            {part.input?.title}
          </span>
          .
        </p>
      }
      outputContent={
        <>
        <p className="font-medium mb-5">
          {part.output?.message}
        </p>
        <FilmCard film={result} />
        </>
      }
      errorText={part.errorText}
    />
  );
}