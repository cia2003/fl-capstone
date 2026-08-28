import ToolState from "./ToolState";
import { FilmCard } from "../../films/FilmCard";
import { FilmToolPart } from "@/types/chat";

type FilmInformationProps = {
  part: FilmToolPart;
};

export default function FilmInformation({
  part,
}: FilmInformationProps) {
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
        <FilmCard film={part.output?.film} />
        </>
      }
      errorText={part.errorText}
    />
  );
}