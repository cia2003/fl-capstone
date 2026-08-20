import { GoogleGenAI } from "@google/genai";
import type { GeminiHistoryItem } from "../utils/helpers";
import { filmRecommenderPrompt } from "@/agents/prompts/filmRecommender";
import { Film } from "@/types";

export async function chat(history: GeminiHistoryItem[], films: Film[]) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini is not configured.");

    const ai = new GoogleGenAI({ apiKey })
    const interaction = await ai.interactions.create({
        model: 'gemini-3.5-flash-lite', 
        store: false, 
        // stream: true,
        system_instruction: `${filmRecommenderPrompt}\n\nVerified film list:\n${JSON.stringify(films)}`,
        input: history
    })

    return interaction.output_text

    
}
