"use client";

import type { Film } from "@/types";
import { Button } from "@/components/ui";
import { ChatHeader } from "./ChatHeader";
import { LuArrowDown } from "react-icons/lu";
import ChatComposer from "./ChatMessages/ChatComposer";
import ChatMessages from "./ChatMessages/ChatMessages";
import { useFilmChat } from "@/hooks/useChat";
import useAutoScroll from "@/hooks/useAutoScroll";

export function ChatInput({ films }: { films: Film[] }) {
  const chat = useFilmChat({ films })

  const scroll = useAutoScroll({
    messages: chat.messages, 
    isStreaming: chat.isStreaming, 
    isThinking: chat.isThinking, 
    bottomRef: chat.bottomRef
  })

  return (
    <>
    {chat.messages.length === 0 && <ChatHeader />}

    <ChatMessages messages={chat.messages}  films={films} bottomRef={chat.bottomRef} loading={chat.loading} isThinking={chat.isThinking}  error={chat.error} newChat={chat.newChat} />

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
    <ChatComposer loading={chat.loading} onSubmit={ chat.submit } onStop={ chat.stop } />
    </>
  );
}
