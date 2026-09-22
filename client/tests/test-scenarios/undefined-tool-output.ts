import type { Page } from "@playwright/test";

export async function injectUndefinedToolOutput(page: Page) {
  let requestCount = 0;

  await page.route("**/api/ai/chat", async (route) => {
    requestCount++;

    const chunks = [
      {
        type: "start",
        messageId: "undefined-tool-message",
      },
      {
        type: "tool-input-available",
        toolCallId: "tool-call-1",
        toolName: "recommendMovies",
        input: {
          mood: "gentle",
        },
      },
      {
        type: "tool-output-available",
        toolCallId: "tool-call-1",
        output: undefined,
      },
      {
        type: "finish",
      },
    ];

    const body = chunks
      .map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`)
      .join("");

    await route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "x-vercel-ai-ui-message-stream": "v1",
      },
      body,
    });
  });

  return {
    requestCount: () => requestCount,

    async dispose() {
      await page.unroute("**/api/ai/chat");
    },
  };
}