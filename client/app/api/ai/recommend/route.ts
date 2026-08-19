import { NextResponse } from "next/server";
import type { Film, RecommendationResponse } from "@/types";
import { chat } from "@/lib/api/geminiClient";
import { addAssistantMessage, addUserMessage, type ChatRole, type GeminiHistoryItem } from "@/lib/utils/helpers";
import { recommendationQuerySchema } from "@/lib/validations/query";
import { filmRecommenderPrompt } from "@/agents/prompts/filmRecommender";

export const runtime = "nodejs";

function rankLocally(query: string, films: Film[]): RecommendationResponse {
  const terms = query.toLowerCase().split(/\W+/).filter(term => term.length > 2);
  const ranked = films.map(film => {
    const searchable = `${film.title} ${film.description} ${film.director}`.toLowerCase();
    const matches = terms.filter(term => searchable.includes(term)).length;

    return { film, score: Math.min(98, 62 + matches * 12) };
  }).sort(
    (a, b) => b.score - a.score || a.film.title.localeCompare(b.film.title)
  ).slice(0, 3);
  return { 
    recommendations: ranked.map(({ film, score }) => ({ 
      filmId: film.id, 
      score, 
      reasoning: `${film.title} is a strong fit: ${film.description.slice(0, 170).trim()}${film.description.length > 170 ? "…" : ""}` })) 
    };
}

function parseRecommendations(content: string | undefined, films: Film[]): RecommendationResponse | null {
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

    return recommendations.length ? { recommendations } : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = recommendationQuerySchema.safeParse(body);
  
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid query." }, { status: 400 });

  const films = Array.isArray(body?.films) ? body.films as Film[] : [];

  if (!films.length) return NextResponse.json({ error: "No films were supplied." }, { status: 400 });

  let recommendationResponse: RecommendationResponse | null = null;

  if (process.env.GEMINI_API_KEY) {
    const history: GeminiHistoryItem[] = [];
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    // addUserMessage(history, `${filmRecommenderPrompt}\n\nVerified film list:\n${JSON.stringify(films)}`);
    messages.forEach((message: { 
      type: ChatRole; 
      content: [{
        type: "text", 
        text: string
      }] }) => {
      if (typeof message.content[0].text !== "string") return;
      if (message.type === "model_output") addAssistantMessage(history, message.content[0].text);
      if (message.type === "user_input") addUserMessage(history, message.content[0].text);
    });

    try {
      console.log("messages", messages)
      console.log("history", history)
      recommendationResponse = parseRecommendations(await chat(history, films), films);
    } catch (err) {
      // console.log("error", err)
      recommendationResponse = null;
    }
  }
  console.log("recommendationResponse: ", recommendationResponse)

  const result = JSON.stringify(recommendationResponse ?? rankLocally(parsed.data.query, films));

  return new Response(result, { 
    headers: { 
      "Content-Type": "application/json; charset=utf-8", 
      "Cache-Control": "no-store" 
    } 
  });
}
