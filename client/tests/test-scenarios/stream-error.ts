import { Page } from "@playwright/test";

export async function injectStreamError(page: Page) {
  await page.route("**/api/ai/chat", async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      body:
        `data: {"type":"text-start","id":"test-message"}\n\n` +
        `data: {"type":"text-delta","id":"test-message","delta":"I recommend"}\n\n` +
        `data: {"type":"error","errorText":"Something went wrong"}\n\n` +
        `data: [DONE]\n\n`,
    });
  });
}