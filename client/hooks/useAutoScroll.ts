"use client"

import { useState, useEffect } from "react"
import { scrollToBottom } from "@/lib/utils/helpers"
import { UIMessage } from "ai"

type AutoScrollProps = {
    messages: UIMessage[],
    isStreaming: boolean,
    isThinking: boolean, 
    bottomRef: React.RefObject<HTMLDivElement | null>
}

export default function useAutoScroll({
    messages, 
    isStreaming,
    isThinking, 
    bottomRef
}: AutoScrollProps) {
    const [showScrollButton, setShowScrollButton] = useState(false)

    const scrollToLatest = () => scrollToBottom(bottomRef)

    function handleWindowScroll() {
        const distanceFromBottom =
            document.documentElement.scrollHeight -
            window.scrollY -
            window.innerHeight;

        setShowScrollButton(distanceFromBottom > 100);
    }

    useEffect(() => {
        if (!showScrollButton) {
            requestAnimationFrame(() => {
                bottomRef.current?.scrollIntoView({
                    behavior: "auto",
                });
            });
        }
    }, [messages, isStreaming, isThinking]);

    useEffect(() => {
        window.addEventListener("scroll", handleWindowScroll)

        return () => {
        window.removeEventListener("scroll", handleWindowScroll)
        }
    }, []);

    const scroll = {
        scrollToLatest, 
        showScrollButton
    }

    return scroll
}