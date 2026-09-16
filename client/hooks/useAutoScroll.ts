"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type AutoScrollProps = {
    messages: unknown[]
    isStreaming: boolean
    isThinking: boolean
    bottomRef: React.RefObject<HTMLDivElement | null>
    composerRef: React.RefObject<HTMLDivElement | null>
}

export default function useAutoScroll({
    messages,
    isStreaming,
    isThinking,
    bottomRef,
    composerRef,
}: AutoScrollProps) {
    const [showScrollButton, setShowScrollButton] = useState(false)

    const shouldAutoScrollRef = useRef(true)
    const rafRef = useRef<number | null>(null)

    /**
     * Read DOM geometry once per frame.
     */
    const getScrollDistance = useCallback(() => {
        const bottomElement = bottomRef.current
        const composerElement = composerRef.current

        if (!bottomElement || !composerElement) {
            return null
        }

        const bottomRect = bottomElement.getBoundingClientRect()
        const composerRect = composerElement.getBoundingClientRect()

        return bottomRect.bottom - composerRect.top
    }, [bottomRef, composerRef])

    /**
     * Update whether the user is currently near the latest message.
     */
    const updateScrollState = useCallback(() => {
        const distanceFromLatest = getScrollDistance()

        if (distanceFromLatest === null) return

        const latestMessageIsOutOfRange = distanceFromLatest > 100

        shouldAutoScrollRef.current = !latestMessageIsOutOfRange

        setShowScrollButton((previous) => {
            const next =
                messages.length > 0 && latestMessageIsOutOfRange

            return previous === next ? previous : next
        })
    }, [getScrollDistance, messages.length])

    /**
     * Scroll to the latest message.
     */
    const scrollToLatest = useCallback(
        (behavior: ScrollBehavior = "smooth") => {
            const distanceFromLatest = getScrollDistance()

            if (distanceFromLatest === null) return

            shouldAutoScrollRef.current = true

            window.scrollTo({
                top: window.scrollY + distanceFromLatest,
                behavior,
            })

            setShowScrollButton(false)
        },
        [getScrollDistance]
    )

    /**
     * Schedule DOM reads/writes into one animation frame.
     *
     * If React updates the chat several times during streaming,
     * we only process the latest update once per frame.
     */
    const scheduleScrollUpdate = useCallback(() => {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current)
        }

        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null

            if (shouldAutoScrollRef.current) {
                scrollToLatest("auto")
            }

            updateScrollState()
        })
    }, [scrollToLatest, updateScrollState])

    /**
     * React to chat/message changes.
     *
     * During streaming, messages can change many times.
     * requestAnimationFrame prevents us from doing layout work
     * for every single React update.
     */
    useEffect(() => {
        scheduleScrollUpdate()
    }, [
        messages,
        isStreaming,
        isThinking,
        scheduleScrollUpdate,
    ])

    /**
     * Track manual scrolling and window resizing.
     *
     * Both events can fire very frequently, so they are
     * also throttled through requestAnimationFrame.
     */
    useEffect(() => {
        const handleScroll = () => {
            if (rafRef.current !== null) return

            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null
                updateScrollState()
            })
        }

        const handleResize = () => {
            if (rafRef.current !== null) return

            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null
                updateScrollState()
            })
        }

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        })

        window.addEventListener("resize", handleResize)

        updateScrollState()

        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", handleResize)

            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current)
                rafRef.current = null
            }
        }
    }, [updateScrollState])

    return {
        scrollToLatest,
        showScrollButton,
    }
}