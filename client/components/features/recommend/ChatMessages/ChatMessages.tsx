"use client"

import { Film } from "@/types";
import { UserMessage } from "./UserMessage";
import { AIMessage } from "./AIMessage";
import ThinkingIndicator from "@/components/ui/ThinkingIndicator";
import { getTextFromMessage } from "@/lib/utils/helpers";
import { useFilmChat } from "@/hooks/useChat";
import { ToolErrorCard } from "@/components/ui/ToolErrorCard";
import { useState } from "react";

type ChatMessagesProps = {
    chat: ReturnType<typeof useFilmChat>
    films: Film[],
    addToolOutput: any, 
}

function getErrorMessage(error: unknown) {
    if (typeof error !== "string") {
        return "We couldn't complete this request. Please try again."
    }

    try {
        const parsed = JSON.parse(error)

        if (typeof parsed.error === "string") {
            return parsed.error
        }

        return error
    } catch {
        return error
    }
}

export default function ChatMessages({ 
    chat,
    films, 
    addToolOutput, 
 }: ChatMessagesProps) {
    const hasError = Boolean(chat.error || chat.responseError)
    const [isRegenerating, setIsRegenerating] = useState(false)

    const handleRegenerate = async () => {
        setIsRegenerating(true)

        try {
            await chat.regenerate()

            window.setTimeout(() => setIsRegenerating(false), 800)
        } catch (err) {
            setIsRegenerating(false)
            throw err
        }
    }

    const showRegenerateCard = isRegenerating || (!chat.loading && hasError)

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
                        <AIMessage key={message.id} message={message} films={films} loading={false} onNewChat={chat.newChat} addToolOutput={addToolOutput} />
                    )
                }

                return null
            })}

            {
                chat.loading && chat.isThinking && !isRegenerating && (
                    <ThinkingIndicator />
                )
            }
            { showRegenerateCard && (
                <div className="mt-3">
                    <ToolErrorCard
                        title="Something went wrong"
                        message={ hasError ? getErrorMessage(
                                    chat.error?.message ||
                                    chat.responseError ||
                                    "We couldn't complete this request. Please try again."
                                ) : undefined}
                        actionType="regenerate"
                        onRegenerate={handleRegenerate}
                        onNewChat={chat.newChat}
                        chatStatus={chat.status}
                        chatError={chat.error || chat.responseError}
                    />
                </div>
            )}

            <div ref={chat.bottomRef} />
        </div>
    )
}