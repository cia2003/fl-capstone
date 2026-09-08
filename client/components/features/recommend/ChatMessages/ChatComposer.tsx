"use client"

import { LuArrowDown, LuSquare, LuSend } from "react-icons/lu"
import { Button, Input } from "@/components/ui"
import { useState } from "react"
import { useFilmChat } from "@/hooks/useChat"
import useAutoScroll from "@/hooks/useAutoScroll"

type ChatComposerProps = {
    chat: ReturnType<typeof useFilmChat>
    composerRef: React.RefObject<HTMLDivElement | null>
}
export default function ChatComposer({
    chat,
    composerRef
}: ChatComposerProps) {
    const [query, setQuery] = useState("")
    const scroll = useAutoScroll({
        messages: chat.messages,
        isStreaming: chat.isStreaming,
        isThinking: chat.isThinking,
        bottomRef: chat.bottomRef,
        composerRef
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!query.trim()) return

        if (chat.error != null || chat.responseError != null) {
        chat.setMessages(messages =>
            messages.at(-1)?.role === 'assistant'
            ? messages.slice(0, -2)
            : messages.slice(0, -1),
        );
        }

        const submittedAsPreference = chat.submitPreference(query)

        if (!submittedAsPreference) {
            chat.sendMessage({
                text: query
            })
        }

        setQuery("")
    }

    return (
        <div ref={composerRef} className="relative sticky bottom-0">
            <form
                onSubmit={handleSubmit}
                className="relative sticky bottom-0 mt-6 flex flex-col gap-3 sm:flex-row"
            >
                {scroll.showScrollButton && (
                    <Button
                        type="button"
                        onClick={() => scroll.scrollToLatest()}
                        aria-label="Scroll to latest message"
                        className="absolute bottom-full left-1/2 z-10 mb-3 -translate-x-1/2 rounded-full cursor-pointer"
                    >
                        <LuArrowDown />
                    </Button>
                )}
                <label
                className="sr-only"
                htmlFor="film-query"
                >
                What are you in the mood for?
                </label>

                <div className="flex w-full gap-2">
                    <Input
                        id="film-query"
                        value={query}
                        onChange={event =>
                        setQuery(event.target.value)
                        }
                        disabled={chat.error != null || chat.responseError != null}
                        placeholder="I want a gentle, hopeful adventure…"
                        required
                    />

                    <Button
                        type={chat.loading ? "button" : "submit"}
                        onClick={chat.loading ? chat.stop : undefined}
                        className="cursor-pointer"
                        aria-label={chat.loading ? "Stop generating response" : "Send message"}
                        disabled={chat.error != null || chat.responseError != null}
                    >
                        {chat.loading ? <LuSquare /> : <LuSend />}
                    </Button>
                </div>
            </form>            
        </div>

    )
}
