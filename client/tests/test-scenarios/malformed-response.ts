// tests/test-scenarios/malformed-response.ts

import { Page } from "@playwright/test";

export async function injectMalformedResponse(page: Page) {
  await page.route("**/api/ai/chat", async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      body:
        'data: {"type":"start","messageId":"malformed-response"}\n\n' +
        'data: {"type":"start-step"}\n\n' +
        'data: {"type":"text-start","id":"text-1"}\n\n' +
        'data: {"type":"text-delta","id":"text-1","delta":"I found a recommendation"}\n\n' +
        'data: {"type":"tool-input-start","toolCallId":"tool-1","toolName":"recommendMovies","input":{"recommendations":"This should be an array"}}\n\n' +
        'data: {"type":"tool-input-available","toolCallId":"tool-1","toolName":"recommendMovies","input":{"recommendations":"This should be an array"}}\n\n' +
        'data: {"type":"tool-output-available","toolCallId":"tool-1","output":{"message":"bad","recommendations":"This should be an array"}}\n\n' +
        'data: {"type":"finish-step"}\n\n' +
        'data: {"type":"finish"}\n\n',
    });
  });
}