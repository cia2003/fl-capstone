import { Film, Recommendation } from "@/types";
import { RankedResultList } from "../RankedResultList";
import ToolState from "./ToolState";
import { FilmToolPart } from "@/types/chat";

type MovieRecommendationsProps = {
  part: Extract<FilmToolPart, { type: "tool-recommendMovies" }>;
  films: Film[];
};

export default function MovieRecommendations({
  part,
  films,
}: MovieRecommendationsProps) {
  const recommendedMovies = part.output?.recommendations as Recommendation[]
  return (
    <ToolState
      state={part.state}
      title="Movie recommendations"
      streamingText="Understanding your preferences..."
      availableContent={
        <p className="text-sm text-muted-foreground">
          Finding movies based on your preferences.
        </p>
      }
      outputContent={
        <>
          <p className="font-medium">
            {part.output?.message}
          </p>

          <div className="mt-4">
            <RankedResultList
              recommendations={recommendedMovies}
              films={films}
            />
          </div>
        </>
      }
      errorText={part.errorText}
    />
  );
}