// tests/test-scenarios/error.ts

import type { Page } from '@playwright/test';

export async function injectServerError(page: Page) {
  await page.route('**/api/ai/chat', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'This is a test server error',
      }),
    });
  });
}