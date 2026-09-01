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

type FilmPart = FilmUIMessage["parts"][number]

function isToolPart(part: FilmPart) {
  return part.type.startsWith("tool-")
}

function isToolStillRunning(part: FilmPart) {
  if (!isToolPart(part)) {
    return false
  }

  if (!("state" in part)) {
    return false
  }

  return (
    part.state === "input-streaming" ||
    part.state === "input-available"
  )
}

function isValidToolOutput(part: FilmPart) {
  if (!isToolPart(part)) {
    return false
  }

  // Tool masih berjalan.
  // Jangan menganggapnya sebagai malformed response.
  if (isToolStillRunning(part)) {
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
        typeof output === "string" &&
          output.trim().length > 0
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

  const toolParts = message.parts.filter(isToolPart)

  if (toolParts.length > 0) {
    // Ada tool yang masih berjalan.
    // Response belum boleh dianggap invalid.
    if (toolParts.some(isToolStillRunning)) {
      return true
    }

    // Semua tool sudah selesai.
    // Minimal satu tool harus menghasilkan output yang valid.
    return toolParts.some(isValidToolOutput)
  }

  // Tidak menggunakan tool.
  // Text-only assistant response tetap merupakan response yang valid.
  return message.parts.some(
    (part) =>
      part.type === "text" &&
      "text" in part &&
      typeof part.text === "string" &&
      part.text.trim().length > 0
  )
}

export function useFilmChat({ films }: UseChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Error yang berasal dari validasi response aplikasi sendiri.
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
    // Jangan validasi selama request masih berjalan.
    if (chat.status !== "ready") {
      return
    }

    // Kalau AI SDK sudah menghasilkan error,
    // gunakan chat.error sebagai sumber error.
    if (chat.error) {
      setResponseError(null)
      return
    }

    const lastAssistantMessage = [...chat.messages]
      .reverse()
      .find((message) => message.role === "assistant")

    if (!lastAssistantMessage) {
      return
    }

    const toolParts = lastAssistantMessage.parts.filter(isToolPart)

    // Tool masih berjalan.
    // Tunggu sampai tool selesai sebelum melakukan validation.
    if (toolParts.some(isToolStillRunning)) {
      return
    }

    if (!hasValidAssistantResponse(lastAssistantMessage)) {
      setResponseError(
        "We couldn't complete this request. Please try again."
      )
      return
    }

    // Response valid → bersihkan error sebelumnya.
    setResponseError(null)
  }, [chat.messages, chat.status, chat.error])

  const newChat = () => {
    chat.setMessages([])
    setResponseError(null)
  }

  return {
    ...chat,

    // Error dari AI SDK:
    // network, server, stream, dll.
    error: chat.error,

    // Error dari validasi response aplikasi:
    // malformed atau invalid tool output.
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