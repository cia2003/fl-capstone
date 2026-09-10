import type { Route } from "@playwright/test";

type UiMessageChunk = Record<string, unknown>;

export function createUiMessageStream(chunks: UiMessageChunk[]) {
  return chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join("");
}

export async function fulfillUiMessageStream(
  route: Route,
  chunks: UiMessageChunk[],
  delayMs = 0,
) {
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  await route.fulfill({
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "x-vercel-ai-ui-message-stream": "v1",
    },
    body: createUiMessageStream(chunks),
  });
}
