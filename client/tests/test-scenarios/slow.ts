// tests/test-scenarios/slow.ts

import type { Page } from '@playwright/test';

export async function injectSlowResponse(page: Page) {
  await page.route("**/api/ai/chat", async route => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    await route.continue();
  });
}