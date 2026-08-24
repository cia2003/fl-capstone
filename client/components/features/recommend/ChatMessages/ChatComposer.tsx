"use client"

import { LuSquare, LuSend } from "react-icons/lu"
import { Button, Input } from "@/components/ui"
import { useState } from "react"
import { UseChatHelpers } from "@ai-sdk/react"
import { FilmUIMessage } from "@/types/chat"

type ChatComposerProps = {
    loading: boolean, 
    onSubmit: UseChatHelpers<FilmUIMessage>["sendMessage"],
    onStop: UseChatHelpers<FilmUIMessage>["stop"]
}
export default function ChatComposer({
    loading, 
    onSubmit, 
    onStop
}: ChatComposerProps) {
    const [query, setQuery] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!query.trim()) return

        onSubmit({
            text: query
        })

        setQuery("")
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
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
                placeholder="I want a gentle, hopeful adventure…"
                required
            />

            <Button
                type={loading ? "button" : "submit"}
                onClick={loading ? onStop : undefined}
                className="cursor-pointer"
                aria-label={loading ? "Stop generating response" : "Send message"}
            >
                {loading ? <LuSquare /> : <LuSend />}
            </Button>
            </div>
        </form>
    )
}
