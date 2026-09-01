import { Locator, Page, Route } from "@playwright/test";

type FailThenSucceedOptions = {
  /** URL pattern to intercept. Defaults to the chat endpoint. */
  urlPattern?: string;
  /** Artificial delay (ms) on the successful response, so races are testable. */
  successDelayMs?: number;
  /** Status/body for the initial failing response. */
  failure?: {
    status: number;
    body?: unknown;
  };
};

export type NetworkScenario = {
  /** Number of requests observed so far. */
  requestCount: () => number;
  /** Stop intercepting. Call in test teardown if not using the fixture. */
  dispose: () => Promise<void>;
};

/**
 * Registers a single persistent route handler that fails the first
 * request and succeeds (after an optional delay) on every request after.
 *
 * Using one handler for the whole test avoids Playwright's route-stacking
 * behavior (last-registered-wins) and the footgun of `page.unroute`
 * silently removing a counting handler along with the one you meant to
 * remove.
 */
export async function failThenSucceed(
  page: Page,
  options: FailThenSucceedOptions = {}
): Promise<NetworkScenario> {
  const {
    urlPattern = "**/api/ai/chat",
    successDelayMs = 1000,
    failure = { status: 500, body: { error: "Internal Server Error" } },
  } = options;

  let requestCount = 0;
  let shouldFail = true;

  const handler = async (route: Route) => {
    requestCount++;

    if (shouldFail) {
      shouldFail = false;
      await route.fulfill({
        status: failure.status,
        contentType: "application/json",
        body: JSON.stringify(failure.body ?? {}),
      });
      return;
    }

    if (successDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, successDelayMs));
    }
    await route.continue();
  };

  await page.route(urlPattern, handler);

  return {
    requestCount: () => requestCount,
    dispose: () => page.unroute(urlPattern, handler),
  };
}

/**
 * Fires two near-simultaneous clicks on a locator to probe for
 * duplicate-submission bugs. Uses Promise.all rather than sequential
 * clicks so the second click lands before React has a chance to
 * re-render the element as disabled — this exercises app-level
 * dedup logic, not just the `disabled` DOM attribute.
 */
export async function doubleClick(locator: Locator) {
  const handle = await locator.elementHandle();
  if (!handle) {
    throw new Error("doubleClick: element not found for locator");
  }

  await Promise.all([
    handle.evaluate((el) => (el as HTMLElement).click()),
    handle.evaluate((el) => (el as HTMLElement).click()),
  ]);

  await handle.dispose();
}