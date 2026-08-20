import { Film } from "@/types";
import { ChatMessage } from "@/types/chat";
import { RecommendationResponse } from "@/types";
import { rankLocally } from "./local";
import { chat } from "../api/geminiClient";
import { parseRecommendations } from "./parser";
import { buildGeminiHistory } from "./history";


export interface GetRecommendationsInput {
    query: string, 
    films: Film[], 
    messages: ChatMessage[]
}
export async function getRecommendations({
    query, 
    films, 
    messages
}: GetRecommendationsInput): Promise<RecommendationResponse> {

  if (!process.env.GEMINI_API_KEY) {
    return rankLocally(query, films)
  }

  try {
    const history = buildGeminiHistory(messages)
    const output = await chat(history, films)
    
    const result = parseRecommendations(output, films)

    return result ?? rankLocally(query, films)

  } catch {
    return rankLocally(query, films)
  }

}