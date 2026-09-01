"use client"

import { Film } from "@/types";
import { UserMessage } from "./UserMessage";
import { AIMessage } from "./AIMessage";
import ThinkingIndicator from "@/components/ui/ThinkingIndicator";
import { getTextFromMessage } from "@/lib/utils/helpers";
import { useFilmChat } from "@/hooks/useChat";
import { ToolErrorCard } from "@/components/ui/ToolErrorCard";

type ChatMessagesProps = {
    chat: ReturnType<typeof useFilmChat>
    films: Film[],
    addToolOutput: any,
    errorMessage?: string | null,
    setRequestError?: (value: string | null) => void,
    setIsRequestPending?: (value: boolean) => void,
}

export default function ChatMessages({ 
    chat,
    films, 
    addToolOutput,
    errorMessage,
    setRequestError,
    setIsRequestPending,
 }: ChatMessagesProps) {

    return (
        <div className="relative">
            {chat.messages.map((message) => {
                if (message.role === "user") {
                    return (
                        <UserMessage key={message.id} message={getTextFromMessage(message)} />
                    )
                }

                if (message.role === "assistant") {
                    console.log("AIMessage", message)
                    return (
                        <AIMessage key={message.id} message={message} films={films} loading={false} onNewChat={chat.newChat} addToolOutput={addToolOutput} />
                    )
                }

                return null
            })}

            {
                chat.loading && chat.isThinking && (
                    <ThinkingIndicator />
                )
            }
            {(chat.error || errorMessage) && (
                <div className="mt-3">
                    <ToolErrorCard
                        title="Something went wrong"
                        message={chat.error?.message || errorMessage || "We couldn't complete this request. Please start a new chat and try again."}
                        onNewChat={() => {
                            setRequestError?.(null)
                            setIsRequestPending?.(false)
                            chat.newChat()
                        }}
                    />
                </div>
            )}

            <div ref={chat.bottomRef} />
        </div>
    )
}