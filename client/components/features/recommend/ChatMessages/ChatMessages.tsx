"use client"

import { Film, Recommendation } from "@/types";
import { UserMessage } from "./UserMessage";
import { AIMessage } from "./AIMessage";
import { FilmUIMessage } from "@/types/chat";
import ThinkingIndicator from "@/components/ui/ThinkingIndicator";
import { getRecommendationsFromMessage, getTextFromMessage } from "@/lib/utils/helpers";

type ChatMessagesProps = {
    messages: FilmUIMessage[]
    films: Film[],
    bottomRef: React.RefObject<HTMLDivElement | null>, 
    loading: boolean, 
    isThinking: boolean, 
    error: string | undefined
}

export default function ChatMessages({ 
    messages, 
    films, 
    bottomRef, 
    loading, 
    isThinking, 
    error,
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
                    const text = getTextFromMessage(message)
                    const recommendations = getRecommendationsFromMessage(message)
                    
                    return (
                        <AIMessage key={message.id} content={text} recommendations={recommendations} films={films} loading={false} />
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