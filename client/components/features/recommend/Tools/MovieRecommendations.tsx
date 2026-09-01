import { Film, Recommendation } from "@/types";
import { RankedResultList } from "../RankedResultList";
import ToolState from "./ToolState";
import { FilmToolPart } from "@/types/chat";
import { ToolSkeleton } from "@/components/ui";

type MovieRecommendationsProps = {
  part: Extract<FilmToolPart, { type: "tool-recommendMovies" }>;
  films: Film[];
};

export default function MovieRecommendations({
  part,
  films,
}: MovieRecommendationsProps) {
  const recommedations = part.output?.recommendations 
  const recommendedMovies: Recommendation[] | null = Array.isArray(recommedations) ? recommedations : null; 
  return (
    <ToolState
      state={part.state}
      title="Movie recommendations"
      streamingText="Understanding your preferences..."
      availableContent={
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Finding movies based on your preferences.
          </p>
          <ToolSkeleton variant="recommendations" ariaLabel="Loading movie recommendations" />
        </div>
      }
      outputContent={
        <>
          <p className="font-medium">
            {part.output?.message}
          </p>

          <div className="mt-4">
            {recommendedMovies ? (
              <RankedResultList
                recommendations={recommendedMovies}
                films={films}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                We couldn't load the movie recommendations. Please try again.
              </p>
            )}
          </div>
        </>
      }
      errorText={part.errorText}
    />
  );
}