'use client'

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import { Film } from "@/types"
import { useRef } from "react"
import { FilmUIMessage } from "@/types/chat"

type UseChatProps = {
    films: Film[]
}

export function useFilmChat({ films }: UseChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const chat = useChat<FilmUIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat", 
      body: {
        films,
      }
    }), 

    sendAutomaticallyWhen: ({ messages }) => {
      if (!lastAssistantMessageIsCompleteWithToolCalls({ messages })) {
        return false
      }
      const lastMessage = messages.at(-1)

      if (!lastMessage || lastMessage.role !== "assistant") {
        return false
      }

      return lastMessage.parts.some(
        (part) => 
          part.type === "tool-askMoviePreferences"
      )
    }
  })

  const newChat = () => {
    chat.setMessages([])
  }

  const result = {
    messages: chat.messages, 
    isStreaming: chat.status === "streaming",
    isThinking: chat.status === "submitted", 
    loading: chat.status === "submitted" || chat.status === "streaming", 
    error: chat.error?.message, 
    bottomRef, 
    submit: chat.sendMessage, 
    stop: chat.stop,
    newChat, 
    addToolOutput: chat.addToolOutput
  }

  return result
}