import type { Page } from "@playwright/test";

export async function injectNetworkFailure(page: Page) {
  await page.route("**/api/ai/chat", async (route) => {
    await route.abort("failed");
  });
}