import { NextResponse } from "next/server";
import type { Film } from "@/types";
import { recommendationQuerySchema } from "@/lib/validations/query";
import { getRecommendations } from "@/lib/recommendations/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = recommendationQuerySchema.safeParse(body);


  
  if (!parsed.success) {
    return NextResponse.json(
      { 
        error: parsed.error.issues[0]?.message ?? "Invalid query." 
      }, 
      { 
        status: 400 
      }
    );
  }

  const films = Array.isArray(body?.films) ? body.films as Film[] : [];

  if (!films.length) {
    return NextResponse.json(
      { error: "No films were supplied." }, 
      { status: 400 }
    );
  }
  
  const messages = Array.isArray(body?.messages) ? body.messages : []
  const recommendations = await getRecommendations({
    query: parsed.data.query, 
    films, 
    messages
  })

  console.log("recommendations", recommendations)
  return new Response(JSON.stringify(recommendations), { 
    headers: { 
      "Content-Type": "application/json; charset=utf-8", 
      "Cache-Control": "no-store" 
    } 
  });
}
