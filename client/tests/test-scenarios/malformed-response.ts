// tests/test-scenarios/malformed-response.ts

import { Page } from "@playwright/test";

export async function injectMalformedResponse(page: Page) {
  await page.route("**/api/ai/recommend", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        recommendations: "This should be an array",
      }),
    });
  });
}