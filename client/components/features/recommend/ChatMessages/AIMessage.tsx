import type { Film, Recommendation } from "@/types";
import { RankedResultList } from "../RankedResultList";
import ReactMarkdown from "react-markdown"

export function AIMessage({ content, recommendations, films, loading=false }: { content: string; recommendations: Recommendation[]; films: Film[]; loading: boolean }) {
  return (
    <div className="mt-6">
      <div className="font-medium">
        {
        content && (
          <ReactMarkdown >
            {content}
          </ReactMarkdown>
        )
        }
        </div>
      <RankedResultList recommendations={recommendations} films={films} loading={loading} />
    </div>
  );
}
