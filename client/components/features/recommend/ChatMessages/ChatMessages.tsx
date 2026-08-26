"use client"

import { Film, Recommendation } from "@/types";
import { UserMessage } from "./UserMessage";
import { AIMessage } from "./AIMessage";
import { FilmUIMessage } from "@/types/chat";
import ThinkingIndicator from "@/components/ui/ThinkingIndicator";
import { getTextFromMessage } from "@/lib/utils/helpers";

type ChatMessagesProps = {
    messages: FilmUIMessage[]
    films: Film[],
    bottomRef: React.RefObject<HTMLDivElement | null>, 
    loading: boolean, 
    isThinking: boolean, 
    error: string | undefined, 
    newChat: () => void
}

export default function ChatMessages({ 
    messages, 
    films, 
    bottomRef, 
    loading, 
    isThinking, 
    error,
    newChat
 }: ChatMessagesProps) {

    return (
        <div className="relative">
            {messages.map((message) => {
                if (message.role === "user") {
                    return (
                        <UserMessage key={message.id} message={getTextFromMessage(message)} />
                    )
                }

                if (message.role === "assistant") {
                    return (
                        <AIMessage key={message.id} message={message} films={films} loading={false} onNewChat={newChat} />
                    )
                }

                return null
            })}

            {
                loading && isThinking && (
                    <ThinkingIndicator />
                )
            }
            {
                error && (
                    <p role="alert" className="mt-3 text-primary">{error}</p>
                )
            }

            <div ref={bottomRef} />
        </div>
    )
}