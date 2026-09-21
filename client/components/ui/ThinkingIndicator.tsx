"use client"

import { useEffect, useState } from "react"
import { LuLoader } from "react-icons/lu"

const messages = [
    "AI is thinking",
    "Be patient, there is an incoming message",
    "Hang in there, right now",
]

export default function ThinkingIndicator() {
    const [messageIndex, setMessageIndex] = useState(0)

    useEffect(() => {
        const timers = [
            setTimeout(() => setMessageIndex(1), 3000),
            setTimeout(() => setMessageIndex(2), 7000),
        ]

        return () => timers.forEach(clearTimeout)
    }, [])

    return (
        <div className="flex gap-[5px] items-center mt-2">
            <LuLoader className="text-gray-500 animate-spin" />

            <p className="font-medium text-gray-500">
                {messages[messageIndex]}
            </p>
        </div>
    )
}