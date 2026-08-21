"use client"

import { Film, Recommendation } from "@/types";
import { UserMessage } from "./UserMessage";
import { AIMessage } from "./AIMessage";
import { ChatMessage } from "@/types/chat";
import ThinkingIndicator from "@/components/ui/ThinkingIndicator";

type ChatMessagesProps = {
    messages: ChatMessage[],
    results: Recommendation[][],
    films: Film[],
    bottomRef: React.RefObject<HTMLDivElement | null>, 
    loading: boolean, 
    isThinking: boolean, 
    streamingMessage: string, 
    error: string
}

export default function ChatMessages({ 
    messages, results, films, bottomRef, 
    loading, isThinking, streamingMessage, error
 }: ChatMessagesProps) {
    return (
        <div className="relative">
        {messages.map((message, index) => {
            if (message.type === "user_input") {
            return (
                <UserMessage
                key={`${message.type}-${index}`}
                message={message.content[0].text}
                />
            );
            }

            const resultIndex = messages
            .slice(0, index)
            .filter(item => item.type === "model_output")
            .length;

            return (
            <AIMessage
                key={`${message.type}-${index}`}
                content={message.content[0].text}
                recommendations={results[resultIndex] ?? []}
                films={films}
                loading={false}
            />
            );
        })}

        {loading && isThinking && (
            <ThinkingIndicator />
        )}

        {loading && streamingMessage && (
            <AIMessage
            content={streamingMessage}
            recommendations={[]}
            films={films}
            loading={loading}
            />
        )}

        {error && (
            <p role="alert" className="mt-3 text-primary">
            {error}
            </p>
        )}

        <div ref={bottomRef} />
        </div>
    )
}