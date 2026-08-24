import { FilmUIMessage } from "@/types/chat"
import { UIMessage } from "ai"

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

export function getTextFromMessage(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")
}

export function getRecommendationsFromMessage(message: FilmUIMessage) {
    for (const part of message.parts) {
        if (part.type !== 'tool-recommendFilms') {
            continue
        }

        if (part.state === 'output-available') {
            return part.output
        }
    }

    return []
}