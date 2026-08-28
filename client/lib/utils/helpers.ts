import { FilmUIMessage } from "@/types/chat"

export type ChatRole = "user_input" | "model_output"

export type GeminiHistoryItem = {
  type: "user_input" | "model_output", 
  content: [{
    type: "text", 
    text: string
  }]
}

export function addUserMessage(history: GeminiHistoryItem[], message: string) {
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
  const modelMessage = {
    type: "model_output", 
    content: [{
      type: "text", 
      text: message
    }]
  } as GeminiHistoryItem

  history.push(modelMessage);
}

export function scrollToBottom(element: React.RefObject<HTMLDivElement | null>) {
    element.current?.scrollIntoView({
      behavior: "smooth",
    });
  }

export function stopStreaming(element: React.RefObject<AbortController | null>) {
  element.current?.abort()
}

export function getTextFromMessage(message: FilmUIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")
}