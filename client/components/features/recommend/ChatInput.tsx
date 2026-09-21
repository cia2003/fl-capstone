"use client";

import { ChatHeader } from "./ChatHeader";
import ChatComposer from "./ChatMessages/ChatComposer";
import ChatMessages from "./ChatMessages/ChatMessages";
import { useFilmChat } from "@/hooks/useChat";
import { useRef } from "react";

export function ChatInput() {
  const chat = useFilmChat();
  const composerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col">
      {chat.messages.length === 0 && (
        <ChatHeader
          onPrompt={(prompt) =>
            chat.sendMessage({ text: prompt })
          }
        />
      )}

      <main>
        <ChatMessages
          chat={chat}
          addToolOutput={chat.addToolOutput}
        />
      </main>

      <ChatComposer
        chat={chat}
        composerRef={composerRef}
      />
    </div>
  );
}