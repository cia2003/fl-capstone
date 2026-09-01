// tests/chat.test.ts

import { test, expect } from "@playwright/test";
import { ChatPage } from "./pages/chat";
import { injectServerError } from "./test-scenarios/error";
import { injectRateLimit } from "./test-scenarios/rate-limit";
import { injectSlowResponse } from "./test-scenarios/slow";
import { injectStreamError } from "./test-scenarios/stream-error";
import { injectNetworkFailure } from "./test-scenarios/network-error";
import { injectMalformedResponse } from "./test-scenarios/malformed-response";

test.describe("chat failure handling", () => {
  let chatPage: ChatPage;

  test.beforeEach(async ({ page }) => {
    chatPage = new ChatPage(page);

    await chatPage.createNewChat();
  });

  test("can access chat", async () => {
    await expect(chatPage.input).toBeVisible()
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
      timeout: 15000
    });
  });

  test("handles stream error", async ({ page }) => {
    await injectStreamError(page)

    await chatPage.sendUserMessage("Hello")

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
});