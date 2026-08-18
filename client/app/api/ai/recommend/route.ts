import { NextResponse } from "next/server";
import type { Film, RecommendationResponse } from "@/types";
import { recommendationQuerySchema } from "@/lib/validations/query";

export const runtime = "nodejs";

function rankLocally(query: string, films: Film[]): RecommendationResponse {
  const terms = query.toLowerCase().split(/\W+/).filter(term => term.length > 2);
  const ranked = films.map(film => {
    const searchable = `${film.title} ${film.description} ${film.director}`.toLowerCase();
    const matches = terms.filter(term => searchable.includes(term)).length;
    return { film, score: Math.min(98, 62 + matches * 12) };
  }).sort((a, b) => b.score - a.score || a.film.title.localeCompare(b.film.title)).slice(0, 3);
  return { recommendations: ranked.map(({ film, score }) => ({ filmId: film.id, score, reasoning: `${film.title} is a strong fit: ${film.description.slice(0, 170).trim()}${film.description.length > 170 ? "…" : ""}` })) };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = recommendationQuerySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid query." }, { status: 400 });
  const films = Array.isArray(body?.films) ? body.films as Film[] : [];
  if (!films.length) return NextResponse.json({ error: "No films were supplied." }, { status: 400 });
  const result = JSON.stringify(rankLocally(parsed.data.query, films));
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode(result)); controller.close(); } });
  return new Response(stream, { headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}
