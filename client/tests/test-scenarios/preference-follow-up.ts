import type { Page, Route } from "@playwright/test";
import { fulfillUiMessageStream } from "./ai-stream";

const preferenceResponse = [
  { type: "start", messageId: "preference-message" },
  { type: "start-step" },
  { type: "text-start", id: "preference-text" },
  { type: "text-delta", id: "preference-text", delta: "What kind of vibe are you looking for?" },
  { type: "text-end", id: "preference-text" },
  { type: "tool-input-available", toolCallId: "preference-tool", toolName: "askMoviePreferences", input: { question: "What kind of vibe are you looking for?", options: ["Magical adventures", "Cozy everyday life"] } },
  { type: "finish-step" },
  { type: "finish", finishReason: "tool-calls" },
];

const recommendationResponse = [
  { type: "start", messageId: "recommendation-message" },
  { type: "start-step" },
  { type: "tool-input-available", toolCallId: "recommendation-tool", toolName: "recommendMovies", input: { recommendations: [] } },
  { type: "tool-output-available", toolCallId: "recommendation-tool", output: { message: "Recommendations found", recommendations: [] } },
  { type: "finish-step" },
  { type: "finish", finishReason: "stop" },
];

export async function injectPreferenceFollowUp(page: Page) {
  const requestBodies: unknown[] = [];

  await page.route("**/api/ai/chat", async (route: Route) => {
    const body = route.request().postDataJSON();
    requestBodies.push(body);

    await fulfillUiMessageStream(
      route,
      requestBodies.length === 1 ? preferenceResponse : recommendationResponse,
    );
  });

  return {
    requestBodies,
  };
}
