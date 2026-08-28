import { Film } from "@/types";
import { RankedResultList } from "../RankedResultList";
import ToolState from "./ToolState";

type MovieRecommendationsProps = {
  part: any;
  films: Film[];
};

export default function MovieRecommendations({
  part,
  films,
}: MovieRecommendationsProps) {
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
              recommendations={part.output?.recommendations}
              films={films}
            />
          </div>
        </>
      }
      errorText={part.errorText}
    />
  );
}