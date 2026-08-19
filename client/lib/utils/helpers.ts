// export type ChatRole = "user" | "assistant";
export type ChatRole = "user_input" | "model_output"

// export type GeminiHistoryItem = {
//   role: "user" | "model";
//   parts: Array<{ text: string }>;
// };

export type GeminiHistoryItem = {
  type: "user_input" | "model_output", 
  content: [{
    type: "text", 
    text: string
  }]
}

export function addUserMessage(history: GeminiHistoryItem[], message: string) {
  // const userMessage = {
  //   role: "user", 
  //   parts: [{
  //     text: message
  //   }]
  // } as GeminiHistoryItem

  const userMessage = {
    type: "user_input", 
    content: [{
      type: "text", 
      text: message
    }]
  } as GeminiHistoryItem
  
  history.push(userMessage);
}

export function addAssistantMessage(history: GeminiHistoryItem[], message: string) {
  // const modelMessage = {
  //   role: "model", 
  //   parts: [{
  //     text: message
  //   }]
  // } as GeminiHistoryItem
  const modelMessage = {
    type: "model_output", 
    content: [{
      type: "text", 
      text: message
    }]
  } as GeminiHistoryItem

  history.push(modelMessage);
}
