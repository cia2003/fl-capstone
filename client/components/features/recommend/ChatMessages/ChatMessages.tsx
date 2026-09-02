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
}

export default function ChatMessages({ 
    chat,
    films, 
    addToolOutput, 
 }: ChatMessagesProps) {
    const hasError = Boolean(chat.error || chat.responseError)

    return (
        <div className="relative">
            {chat.messages.map((message) => {
                if (message.role === "user") {
                    return (
                        <UserMessage key={message.id} message={getTextFromMessage(message)} />
                    )
                }

                if (message.role === "assistant") {
                    return (
                        <AIMessage key={message.id} message={message} films={films} loading={false} onNewChat={chat.newChat} addToolOutput={addToolOutput} hideToolParts={hasError} />
                    )
                }

                return null
            })}

            {
                chat.loading && chat.isThinking && (
                    <ThinkingIndicator />
                )
            }
            { !chat.loading && (chat.error || chat.responseError) && (
                <div className="mt-3">
                    <ToolErrorCard
                        title="Something went wrong"
                        message={chat.error?.message || chat.responseError || "We couldn't complete this request. Please start a new chat and try again."}
                        actionType="regenerate"
                        onRegenerate={() => {
                            chat.regenerate()
                        }}
                        onNewChat={() => {
                            chat.newChat()
                        }}
                    />
                </div>
            )}

            <div ref={chat.bottomRef} />
        </div>
    )
}