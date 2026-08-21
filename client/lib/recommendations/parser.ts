import { Film } from "@/types";
import { RecommendationResponse } from "@/types";
import Stream from "stream";

export function parseRecommendations(content: string | undefined, films: Film[]): RecommendationResponse | null {
  if (!content) return null;

  try {
    const parsed = JSON.parse(content.replace(/```json\n?/g, "").replace(/```/g, "")) as RecommendationResponse;
    const filmIds = new Set(films.map(film => film.id));
    const recommendations = Array.isArray(parsed.recommendations)
      ? parsed.recommendations.filter(recommendation => (
        filmIds.has(recommendation.filmId)
        && typeof recommendation.score === "number"
        && typeof recommendation.reasoning === "string"
      )).slice(0, 3)
      : [];

    return { recommendations }
  } catch {
    return null;
  }
}

export type StreamEvent =
  | {
      type: "message";
      content: string;
    }
  | {
      type: "recommendations";
      content: string;
    };

export function streamParser() {
  let buffer = "";
  let mode: "message" | "recommendations" = "message";

  return {
    push(chunk: string): string[] {
      buffer += chunk;

      if (mode === "message") {
        const markerIndex = buffer.indexOf("RECOMMENDATIONS:");

        if (markerIndex === -1) {
          const safeLength = Math.max(
            0,
            buffer.length - "RECOMMENDATIONS:".length
          );

          let message = buffer.slice(0, safeLength);

          buffer = buffer.slice(safeLength);
          message = message.replace(/^MESSAGE:\s*/, "");

          return message ? [message] : [];
        }

        const message = buffer.slice(0, markerIndex);

        buffer = buffer.slice(
          markerIndex + "RECOMMENDATIONS:".length
        );

        mode = "recommendations";

        return [
          message.replace(/^MESSAGE:\s*/, ""),
        ].filter(Boolean);
      }

      // Jangan kirim JSON ke client.
      return [];
    },

    getRecommendationsOutput() {
      return buffer;
    },
  };
}