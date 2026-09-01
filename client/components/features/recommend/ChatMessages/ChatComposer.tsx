"use client"

import { LuSquare, LuSend } from "react-icons/lu"
import { Button, Input } from "@/components/ui"
import { useState } from "react"
import { useFilmChat } from "@/hooks/useChat"

type ChatComposerProps = {
    chat: ReturnType<typeof useFilmChat>
    isRequestPending: boolean
    setIsRequestPending: (value: boolean) => void
    requestError?: string | null
    setRequestError?: (value: string | null) => void
}
export default function ChatComposer({
    chat,
    isRequestPending,
    setIsRequestPending,
    setRequestError,
}: ChatComposerProps) {
    const [query, setQuery] = useState("")
    const isBusy = isRequestPending || chat.loading

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!query.trim()) return

        if (chat.error != null) {
        chat.setMessages(messages =>
            messages.at(-1)?.role === 'assistant'
            ? messages.slice(0, -2)
            : messages.slice(0, -1),
        );
        }

        setRequestError?.(null)
        setIsRequestPending(true)
        chat.sendMessage({
            text: query
        })

        setQuery("")
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="sticky bottom-[20px] mt-6 flex flex-col gap-3 sm:flex-row"
        >
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
                disabled={chat.error != null}
                placeholder="I want a gentle, hopeful adventure…"
                required
            />

            <Button
                type={isBusy ? "button" : "submit"}
                onClick={isBusy ? () => {
                    setIsRequestPending(false)
                    setRequestError?.(null)
                    chat.stop()
                } : undefined}
                className="cursor-pointer"
                aria-label={isBusy ? "Stop generating response" : "Send message"}
                disabled={chat.error != null}
            >
                {isBusy ? <LuSquare /> : <LuSend />}
            </Button>
            </div>
        </form>
    )
}
