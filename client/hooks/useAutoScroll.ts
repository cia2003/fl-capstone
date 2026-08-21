"use client"

import { useState, useEffect } from "react"
import { scrollToBottom } from "@/lib/utils/helpers"
import { ChatMessage } from "@/types/chat"
import { Recommendation } from "@/types"

type AutoScrollProps = {
    messages: ChatMessage[], 
    streamingMessage: string, 
    isThinking: boolean, 
    results: Recommendation[][], 
    bottomRef: React.RefObject<HTMLDivElement | null>
}

export default function useAutoScroll({
    messages, 
    streamingMessage, 
    isThinking, 
    results, 
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
    }, [messages, streamingMessage, isThinking, results]);

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