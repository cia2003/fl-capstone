// tests/chat.test.ts

import { test, expect } from "@playwright/test";
import { ChatPage } from "./pages/chat";
import { injectServerError } from "./test-scenarios/error";
import { injectRateLimit } from "./test-scenarios/rate-limit";
import { injectSlowResponse } from "./test-scenarios/slow";
import { injectStreamError } from "./test-scenarios/stream-error";
import { injectNetworkFailure } from "./test-scenarios/network-error";
import { injectMalformedResponse } from "./test-scenarios/malformed-response";
import { failThenSucceed, doubleClick } from "./test-scenarios/duplicate-retries";
import { injectPreferenceFollowUp } from "./test-scenarios/preference-follow-up";

test.describe("chat failure handling", () => {
  let chatPage: ChatPage;

  test.beforeEach(async ({ page }) => {
    chatPage = new ChatPage(page);

    await chatPage.createNewChat();
  });

  test("can access chat", async () => {
    await expect(chatPage.input).toBeVisible()
  })

  test("sends the preferences prompt from the chat header", async ({ page }) => {
    await page.getByRole("button", { name: "Help me find my preferences" }).click()

    await expect(page.getByText("Help me find my preferences")).toBeVisible()
  })

  test("handles server error", async ({ page }) => {
    await injectServerError(page);

    await chatPage.sendUserMessage(
      "Recommend me a movie"
    );

    const errorMessage = await chatPage.getErrorMessage()

    await expect(errorMessage).toBe(
      "{\"error\":\"This is a test server error\"}"
    )
  });

  test("handles rate limit", async ({ page }) => {
    await injectRateLimit(page);

    await chatPage.sendUserMessage(
      "Recommend me a movie"
    );

    const errorMessage = await chatPage.getErrorMessage()

    await expect(errorMessage).toBe(
      "{\"error\":\"Too many requests\"}"
    )
  });

  test("shows thinking indicator during slow response", async ({
    page,
  }) => {
    await injectSlowResponse(page);

    await chatPage.sendUserMessage(
      "Recommend me a movie"
    );

    await chatPage.isGenerationStarted();

    await expect(chatPage.thinkingIndicator).toBeVisible();

    await expect(chatPage.thinkingIndicator).toBeHidden({
      timeout: 30000
    });
  });

  test("handles stream error", async ({ page }) => {
    await injectStreamError(page)

    await chatPage.sendUserMessage("I want a gentle movie")

    await expect
      .poll(() => chatPage.hasError(), {
        timeout: 3000,
      })
      .toBe(true)
  })

  test("handles network failure before response", async ({ page }) => {
    await injectNetworkFailure(page)

    await chatPage.sendUserMessage(
      "Recommend me a movie"
    );

    await expect
      .poll(() => chatPage.hasError())
      .toBe(true);
  });

  test("handles malformed response", async ({ page }) => {
    await injectMalformedResponse(page)

    await chatPage.sendUserMessage(
      "Recommend me a movie"
    );

    await expect
      .poll(() => chatPage.hasError())
      .toBe(true);
  })

  test("stops streaming when user clicks stop", async () => {
    await chatPage.sendUserMessage(
      "I want a gentle movie"
    );

    await expect(chatPage.stopButton).toBeVisible();

    await chatPage.stopButton.click();

    await expect(chatPage.stopButton).toBeHidden();

    await expect(chatPage.isStreaming()).resolves.toBe(false);
  });

  test("prevents duplicate retry requests", async ({ page }) => {
    const scenario = await failThenSucceed(page, { successDelayMs: 1000 });

    await chatPage.sendUserMessage("Recommend me a movie");
    await expect.poll(() => chatPage.hasError(), { timeout: 3000 }).toBe(true);
    expect(scenario.requestCount()).toBe(1);

    const retryButton = chatPage.retryButton;
    await expect(retryButton).toBeVisible();

    await doubleClick(retryButton);

    // Give the app a moment to settle, then verify no duplicate fired.
    await expect
      .poll(() => chatPage.hasError(), { timeout: 3000 })
      .toBe(false);

    expect(scenario.requestCount()).toBe(2);

    await scenario.dispose();
  });

  test("retry button re-enables after a successful retry", async ({ page }) => {
    const scenario = await failThenSucceed(page, { successDelayMs: 300 });

    await chatPage.sendUserMessage("Recommend me a movie");
    await expect.poll(() => chatPage.hasError(), { timeout: 3000 }).toBe(true);

    await chatPage.retryButton.click();

    // The retry button is swapped out (not disabled) while the retry runs.
    await expect(chatPage.retryButton).not.toBeVisible();

    await expect
      .poll(() => chatPage.hasError(), { timeout: 3000 })
      .toBe(false);

    // No error → no retry button should reappear.
    await expect(chatPage.retryButton).not.toBeVisible();

    expect(scenario.requestCount()).toBe(2);

    await scenario.dispose();
  });

  test("submits a selected preference for recommendations", async ({ page }) => {
    const scenario = await injectPreferenceFollowUp(page);

    await chatPage.sendUserMessage("How about Harry Potter?");
    const preference = page.getByRole("button", { name: "Magical adventures" });
    await expect(preference).toBeVisible();
    await preference.click();

    await expect(page.getByText("Recommendations found")).toBeVisible();
    expect(scenario.requestBodies).toHaveLength(2);
    expect(JSON.stringify(scenario.requestBodies[1])).toContain("Magical adventures");
  });

  test("submits free-text preference for recommendations", async ({ page }) => {
    const scenario = await injectPreferenceFollowUp(page);

    await chatPage.sendUserMessage("How about Harry Potter?");
    await expect(page.getByRole("button", { name: "Magical adventures" })).toBeVisible();

    await chatPage.sendUserMessage("I want something with a cat");

    await expect(page.getByText("Recommendations found")).toBeVisible();
    expect(scenario.requestBodies).toHaveLength(2);
    expect(JSON.stringify(scenario.requestBodies[1])).toContain("I want something with a cat");
  });
});