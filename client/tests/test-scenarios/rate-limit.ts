// tests/test-scenarios/rate-limit.ts

import type { Page } from '@playwright/test';

export async function injectRateLimit(page: Page) {
  await page.route('**/api/ai/chat', async route => {
    await route.fulfill({
      status: 429,
      contentType: 'application/json',
      headers: {
        'Retry-After': '30',
      },
      body: JSON.stringify({
        error: 'Too many requests',
      }),
    });
  });
}