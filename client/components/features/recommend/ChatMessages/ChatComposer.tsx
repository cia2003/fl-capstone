"use client"

import { LuSquare, LuSend } from "react-icons/lu"
import { Button, Input } from "@/components/ui"
import { useState } from "react"
import { useFilmChat } from "@/hooks/useChat"

type ChatComposerProps = {
    chat: ReturnType<typeof useFilmChat>
}
export default function ChatComposer({
    chat
}: ChatComposerProps) {
    const [query, setQuery] = useState("")

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
    )
}
