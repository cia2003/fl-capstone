"use client"

import { LuSquare, LuSend } from "react-icons/lu"
import { Button, Input } from "@/components/ui"

type ChatComposerProps = {
    query: string, 
    setQuery: (value: string) => void, 
    loading: boolean, 
    onSubmit: (
        event: React.FormEvent<HTMLFormElement>
    ) => void, 
    onStop: () => void
}
export default function ChatComposer({
    query, 
    setQuery, 
    loading, 
    onSubmit, 
    onStop
}: ChatComposerProps) {
    return (
        <form
            onSubmit={onSubmit}
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
