import { Page } from "@playwright/test";
import { fulfillUiMessageStream } from "./ai-stream";

export async function injectStreamError(page: Page) {
  await page.route("**/api/ai/chat", async (route) => {
    await fulfillUiMessageStream(route, [
      { type: "start", messageId: "stream-error-message" },
      { type: "text-start", id: "stream-error-text" },
      { type: "text-delta", id: "stream-error-text", delta: "I recommend" },
      { type: "error", errorText: "Something went wrong" },
      { type: "finish", finishReason: "error" },
    ]);
  });
}