'use client'

import { useChat } from "@ai-sdk/react"
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai"
import { useEffect, useRef, useState } from "react"

import { Film } from "@/types"
import { FilmUIMessage } from "@/types/chat"

type UseChatProps = {
  films: Film[]
}

function isValidToolOutput(part: FilmUIMessage["parts"][number]) {
  if (!part.type.startsWith("tool-")) {
    return false
  }

  const output = "output" in part ? part.output : undefined

  switch (part.type) {
    case "tool-recommendMovies":
      return Boolean(
        output &&
          typeof output === "object" &&
          Array.isArray(
            (output as { recommendations?: unknown }).recommendations
          )
      )

    case "tool-getFilmInformation":
      return Boolean(
        output &&
          typeof output === "object" &&
          typeof (output as { film?: unknown }).film === "object"
      )

    case "tool-askMoviePreferences":
      return Boolean(
        typeof output === "string" && output.trim().length > 0
      )

    default:
      return false
  }
}

function hasValidAssistantResponse(
  message: FilmUIMessage | undefined
) {
  if (!message || message.role !== "assistant") {
    return false
  }

  const toolParts = message.parts.filter((part) =>
    part.type.startsWith("tool-")
  )

  if (toolParts.length > 0) {
    return toolParts.some(isValidToolOutput)
  }

  return false
}

export function useFilmChat({ films }: UseChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Untuk error yang berasal dari validasi response kita sendiri
  const [responseError, setResponseError] = useState<string | null>(null)

  const chat = useChat<FilmUIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      body: { films },
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
        (part) => part.type === "tool-askMoviePreferences"
      )
    },
  })

  useEffect(() => {
    // Jangan validasi ketika request masih berjalan
    if (chat.status !== "ready") {
      return
    }

    const lastAssistantMessage = [...chat.messages]
      .reverse()
      .find((message) => message.role === "assistant")

    if (!lastAssistantMessage) {
      return
    }

    if (!hasValidAssistantResponse(lastAssistantMessage)) {
      setResponseError(
        "We couldn't complete this request. Please try again."
      )
      return
    }

    setResponseError(null)
  }, [chat.messages, chat.status, chat.error])

  const newChat = () => {
    chat.setMessages([])
    setResponseError(null)
  }

  return {
    ...chat,

    // AI SDK error: network, server, stream, dll.
    error: chat.error,

    // Error hasil validasi response kita sendiri
    responseError,

    isStreaming: chat.status === "streaming",
    isThinking: chat.status === "submitted",
    loading:
      chat.status === "submitted" ||
      chat.status === "streaming",

    bottomRef,
    newChat,
  }
}