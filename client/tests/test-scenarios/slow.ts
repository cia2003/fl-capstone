// tests/test-scenarios/slow.ts

import type { Page } from '@playwright/test';
import { fulfillUiMessageStream } from './ai-stream';

export async function injectSlowResponse(page: Page) {
  await page.route("**/api/ai/chat", async route => {
    await fulfillUiMessageStream(route, [
      { type: "start", messageId: "slow-message" },
      { type: "text-start", id: "slow-text" },
      { type: "text-delta", id: "slow-text", delta: "A calm recommendation is ready." },
      { type: "text-end", id: "slow-text" },
      { type: "finish", finishReason: "stop" },
    ], 1500);
  });
}