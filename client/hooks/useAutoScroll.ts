"use client"

import { useState, useEffect, useRef } from "react"
import { UIMessage } from "ai"

type AutoScrollProps = {
    messages: UIMessage[],
    isStreaming: boolean,
    isThinking: boolean, 
    bottomRef: React.RefObject<HTMLDivElement | null>,
    composerRef: React.RefObject<HTMLDivElement | null>
}

export default function useAutoScroll({
    messages, 
    isStreaming,
    isThinking, 
    bottomRef,
    composerRef
}: AutoScrollProps) {
    const [showScrollButton, setShowScrollButton] = useState(false)
    const shouldAutoScrollRef = useRef(true)

    const updateScrollState = () => {
        const bottomElement = bottomRef.current
        const composerElement = composerRef.current
        if (!bottomElement || !composerElement) return

        const bottomRect = bottomElement.getBoundingClientRect()
        const composerRect = composerElement.getBoundingClientRect()
        const distanceFromLatest = bottomRect.bottom - composerRect.top
        const latestMessageIsOutOfRange = distanceFromLatest > 100

        shouldAutoScrollRef.current = !latestMessageIsOutOfRange
        setShowScrollButton(messages.length > 0 && latestMessageIsOutOfRange)
    }

    const scrollToLatest = (behavior: ScrollBehavior = "smooth") => {
        const bottomElement = bottomRef.current
        const composerElement = composerRef.current
        if (!bottomElement || !composerElement) return

        const bottomRect = bottomElement.getBoundingClientRect()
        const composerRect = composerElement.getBoundingClientRect()
        const scrollOffset = bottomRect.bottom - composerRect.top

        shouldAutoScrollRef.current = true
        window.scrollTo({
            top: window.scrollY + scrollOffset,
            behavior,
        })
    }

    useEffect(() => {
        if (shouldAutoScrollRef.current) {
            requestAnimationFrame(() => {
                scrollToLatest("auto")
                updateScrollState()
            });
        } else {
            updateScrollState()
        }
    }, [messages, isStreaming, isThinking, bottomRef, composerRef]);

    useEffect(() => {
        updateScrollState()
        window.addEventListener("scroll", updateScrollState)
        window.addEventListener("resize", updateScrollState)

        return () => {
        window.removeEventListener("scroll", updateScrollState)
        window.removeEventListener("resize", updateScrollState)
        }
    }, [messages.length, bottomRef, composerRef]);

    const scroll = {
        scrollToLatest, 
        showScrollButton
    }

    return scroll
}