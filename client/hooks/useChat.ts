'use client'

import { Film } from "@/types"
import { useState, useRef, useEffect } from "react";
import { Recommendation } from "@/types";
import { ChatMessage } from "@/types/chat";
import { stopStreaming } from "@/lib/utils/helpers";

type UseChatProps = {
    films: Film[]
}

export function useChat({ films }: UseChatProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Recommendation[][]>([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingMessage, setStreamingMessage] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const stop = () => stopStreaming(abortControllerRef)

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const userMessage = query.trim();

    if (!userMessage || loading) return;

    const controller = new AbortController()
    abortControllerRef.current = controller

    const nextMessages = [
      ...messages,
      {
        type: "user_input",
        content: [
          {
            type: "text",
            text: userMessage,
          },
        ],
      },
    ] satisfies ChatMessage[];

    setMessages(nextMessages);
    setLoading(true);
    setIsThinking(true);

    setError("");
    setQuery("");
    setStreamingMessage("");

    let buffer = "";
    let streamedMessage = "";

    try {
      const response = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage,
          films,
          messages: nextMessages,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Could not find a film.");
      }

      if (!response.body) {
        throw new Error("Streaming is not supported.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
          stream: true,
        });

        const lines = buffer.split("\n");

        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;

          const event = JSON.parse(line) as
            | {
                type: "message";
                content: string;
              }
            | {
                type: "recommendations";
                recommendations: Recommendation[];
              };

          if (event.type === "message") {
            setIsThinking(false)
            streamedMessage += event.content;            
            setStreamingMessage(streamedMessage.replace(/^MESSAGE:\s*/, ""));
          }

          if (event.type === "recommendations") {
            setResults(currentResults => [
              ...currentResults,
              event.recommendations,
            ]);
          }
        }
      }

      const finalMessage =
        streamedMessage ||
        "Here are the best matches for your request.";

      setMessages(currentMessages => [
        ...currentMessages,
        {
          type: "model_output",
          content: [
            {
              type: "text",
              text: finalMessage,
            },
          ],
        },
      ]);

      setStreamingMessage("");
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === "AbortError") {
        if (streamedMessage) {
          setMessages(currentMessages => [
            ...currentMessages, 
            {
              type: "model_output", 
              content: [{
                type: "text", 
                text: streamedMessage.replace(/^MESSAGE:\s*/, ""),
              }]
            }
          ])
        }

        setStreamingMessage("")
        return
      }

      setStreamingMessage("");

      setError(
        reason instanceof Error
          ? reason.message
          : "Could not find a film."
      );
    } finally {
      setLoading(false);
      abortControllerRef.current = null
    }
  }

  const chat = {
    messages, 
    streamingMessage, 
    isThinking, 
    results, 
    loading, 
    error, 
    bottomRef, 
    query, 
    setQuery, 
    submit, 
    stop
  }

  return chat
}