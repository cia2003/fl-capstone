import type { Film } from "@/types";
import type { ChatMessage } from "@/types/chat";
import { rankLocally } from "./local";
import { chat } from "../api/geminiClient";
import { parseRecommendations, streamParser } from "./parser";
import { buildGeminiHistory } from "./history";

export interface StreamRecommendationsInput {
  query: string;
  films: Film[];
  messages: ChatMessage[];
}

export type RecommendationStreamEvent =
  | {
      type: "message";
      content: string;
    }
  | {
      type: "recommendations";
      recommendations: ReturnType<typeof rankLocally>["recommendations"];
    };

export async function* streamRecommendations({
  query,
  films,
  messages,
}: StreamRecommendationsInput): AsyncGenerator<RecommendationStreamEvent> {

  // Gemini tidak tersedia
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    const fallback = rankLocally(query, films);

    yield {
      type: "recommendations",
      recommendations: fallback.recommendations,
    };

    return;
  }

  try {
    const history = buildGeminiHistory(messages);
    const parser = streamParser();

    for await (const chunk of chat(history, films)) {
      const messageChunks = parser.push(chunk);

      for (const message of messageChunks) {
        yield {
          type: "message",
          content: message,
        };
      }
    }

    const recommendationOutput = parser.getRecommendationsOutput();

    const result = parseRecommendations(
      recommendationOutput,
      films
    );

    if (!result) {
      const fallback = rankLocally(query, films);

      yield {
        type: "recommendations",
        recommendations: fallback.recommendations,
      };

      return;
    }

    yield {
      type: "recommendations",
      recommendations: result.recommendations,
    };

  } catch {
    const fallback = rankLocally(query, films);

    yield {
      type: "recommendations",
      recommendations: fallback.recommendations,
    };
  }
}


// import { Film } from "@/types";
// import { ChatMessage } from "@/types/chat";
// import { RecommendationResponse } from "@/types";
// import { rankLocally } from "./local";
// import { chat } from "../api/geminiClient";
// import { parseRecommendations } from "./parser";
// import { buildGeminiHistory } from "./history";


// export interface GetRecommendationsInput {
//     query: string, 
//     films: Film[], 
//     messages: ChatMessage[]
// }
// export interface StreamRecommendationsInput {
//     films: Film[], 
//     messages: ChatMessage[]
// }

// export async function getRecommendations({
//     query, 
//     films, 
//     messages
// }: GetRecommendationsInput): Promise<RecommendationResponse> {

//   if (!process.env.GEMINI_API_KEY) {
//     return rankLocally(query, films)
//   }

//   try {
//     const history = buildGeminiHistory(messages)
//     // const stream = await chat(history, films)
//     const output = await chat(history, films)
    
//     const result = parseRecommendations(output, films)

//     return result ?? rankLocally(query, films)

//   } catch {
//     return rankLocally(query, films)
//   }
// }