import type { Page, Route } from "@playwright/test";

const preferenceResponse =
  'data: {"type":"start","messageId":"preference-message"}\n\n' +
  'data: {"type":"start-step"}\n\n' +
  'data: {"type":"text-start","id":"preference-text"}\n\n' +
  'data: {"type":"text-delta","id":"preference-text","delta":"What kind of vibe are you looking for?"}\n\n' +
  'data: {"type":"tool-input-start","toolCallId":"preference-tool","toolName":"askMoviePreferences"}\n\n' +
  'data: {"type":"tool-input-available","toolCallId":"preference-tool","toolName":"askMoviePreferences","input":{"question":"What kind of vibe are you looking for?","options":["Magical adventures","Cozy everyday life"]}}\n\n' +
  'data: {"type":"finish-step"}\n\n' +
  'data: {"type":"finish"}\n\n';

const recommendationResponse =
  'data: {"type":"start","messageId":"recommendation-message"}\n\n' +
  'data: {"type":"start-step"}\n\n' +
  'data: {"type":"tool-input-start","toolCallId":"recommendation-tool","toolName":"recommendMovies"}\n\n' +
  'data: {"type":"tool-input-available","toolCallId":"recommendation-tool","toolName":"recommendMovies","input":{"recommendations":[]}}\n\n' +
  'data: {"type":"tool-output-available","toolCallId":"recommendation-tool","output":{"message":"Recommendations found","recommendations":[]}}\n\n' +
  'data: {"type":"finish-step"}\n\n' +
  'data: {"type":"finish"}\n\n';

export async function injectPreferenceFollowUp(page: Page) {
  const requestBodies: unknown[] = [];

  await page.route("**/api/ai/chat", async (route: Route) => {
    const body = route.request().postDataJSON();
    requestBodies.push(body);

    await route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      body: requestBodies.length === 1 ? preferenceResponse : recommendationResponse,
    });
  });

  return {
    requestBodies,
  };
}
