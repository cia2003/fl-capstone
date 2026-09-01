"use client";

import type { Film } from "@/types";
import { Button } from "@/components/ui";
import { ChatHeader } from "./ChatHeader";
import { LuArrowDown } from "react-icons/lu";
import ChatComposer from "./ChatMessages/ChatComposer";
import ChatMessages from "./ChatMessages/ChatMessages";
import { useFilmChat } from "@/hooks/useChat";
import useAutoScroll from "@/hooks/useAutoScroll";
import { useEffect, useState } from "react";

export function ChatInput({ films }: { films: Film[] }) {
  const chat = useFilmChat({ films })
  const [isRequestPending, setIsRequestPending] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)

  useEffect(() => {
    if (chat.error) {
      setRequestError(chat.error.message)
      setIsRequestPending(false)
      return
    }

    if (!isRequestPending || chat.loading) {
      return
    }

    const lastMessage = chat.messages.at(-1)
    const hasValidAssistantResponse =
      lastMessage?.role === "assistant" &&
      lastMessage.parts.some((part) => {
        if (part.type === "text") {
          return part.text.trim().length > 0
        }

        return part.type.startsWith("tool-")
      })

    if (!hasValidAssistantResponse) {
      setRequestError("We couldn't complete this request. Please start a new chat and try again.")
    }

    setIsRequestPending(false)
  }, [chat.error, chat.loading, chat.messages, isRequestPending])

  const scroll = useAutoScroll({
    messages: chat.messages, 
    isStreaming: chat.isStreaming, 
    isThinking: chat.isThinking, 
    bottomRef: chat.bottomRef
  })

  return (
    <>
    {chat.messages.length === 0 && <ChatHeader />}

    <ChatMessages 
      chat={chat}
      films={films} 
      addToolOutput={chat.addToolOutput}
      errorMessage={requestError}
      setRequestError={setRequestError}
      setIsRequestPending={setIsRequestPending}
       />

    {scroll.showScrollButton && (
      <Button
        type="button"
        onClick={ () => scroll.scrollToLatest() }
        aria-label="Scroll to latest message"
        className="fixed bottom-24 left-1/2 z-10 -translate-x-1/2 rounded-full cursor-pointer"
      >
        <LuArrowDown />
      </Button>
    )}
    <ChatComposer
      chat={chat}
      isRequestPending={isRequestPending}
      setIsRequestPending={setIsRequestPending}
      requestError={requestError}
      setRequestError={setRequestError}
    />
    </>
  );
}
