import { NextResponse } from "next/server";
import type { Film } from "@/types";
import { recommendationQuerySchema } from "@/lib/validations/query";
import { streamRecommendations } from "@/lib/recommendations/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const parsed = recommendationQuerySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          "Invalid query.",
      },
      { status: 400 }
    );
  }

  const films = Array.isArray(body?.films)
    ? (body.films as Film[])
    : [];

  if (!films.length) {
    return NextResponse.json(
      { error: "No films were supplied." },
      { status: 400 }
    );
  }

  const messages = Array.isArray(body?.messages)
    ? body.messages
    : [];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (
          const event of streamRecommendations({
            query: parsed.data.query,
            films,
            messages,
          })
        ) {
          controller.enqueue(
            encoder.encode(
              JSON.stringify(event) + "\n"
            )
          );
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache, no-store",
    },
  });
}
