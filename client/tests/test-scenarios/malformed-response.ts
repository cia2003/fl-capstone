// tests/test-scenarios/malformed-response.ts

import { Page } from "@playwright/test";
import { fulfillUiMessageStream } from "./ai-stream";

export async function injectMalformedResponse(page: Page) {
  await page.route("**/api/ai/chat", async (route) => {
    await fulfillUiMessageStream(route, [
      { type: "start", messageId: "malformed-response" },
      { type: "start-step" },
      { type: "text-start", id: "text-1" },
      { type: "text-delta", id: "text-1", delta: "I found a recommendation" },
      { type: "tool-input-available", toolCallId: "tool-1", toolName: "recommendMovies", input: { recommendations: "This should be an array" } },
      { type: "tool-output-available", toolCallId: "tool-1", output: { message: "bad", recommendations: "This should be an array" } },
      { type: "finish-step" },
      { type: "finish", finishReason: "stop" },
    ]);
  });
}