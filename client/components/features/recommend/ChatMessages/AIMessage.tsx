import type { Film, Recommendation } from "@/types";
import { RankedResultList } from "../RankedResultList";

export function AIMessage({ content, recommendations, films }: { content: string; recommendations: Recommendation[]; films: Film[] }) {
  return (
    <div className="mt-6">
      <p className="font-medium">{content}</p>
      <RankedResultList recommendations={recommendations} films={films} />
    </div>
  );
}
