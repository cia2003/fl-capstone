import { comparePrompt } from "./prompts/compare";
import { interpretPrompt } from "./prompts/interpret";

export async function interpretBreed() {
  return {
    prompt: interpretPrompt,
    message: "Interpretation placeholder",
  };
}

export async function compareBreeds() {
  return {
    prompt: comparePrompt,
    message: "Comparison placeholder",
  };
}
