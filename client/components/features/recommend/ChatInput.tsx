"use client";

import { useState } from "react";
import type { Film, Recommendation } from "@/types";
import { Button, Input } from "@/components/ui";
import { ChatHeader } from "./ChatHeader";
import { AIMessage } from "./ChatMessages/AIMessage";
import { UserMessage } from "./ChatMessages/UserMessage";
import { LuSend, LuLoader } from "react-icons/lu";
import { ChatMessage } from "@/types/chat";

export function ChatInput({ films }: { films: Film[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Recommendation[][]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingMessage, setStreamingMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const userMessage = query.trim();

    if (!userMessage || loading) return;

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
    setError("");
    setQuery("");
    setStreamingMessage("");

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
      });

      if (!response.ok) {
        throw new Error("Could not find a film.");
      }

      if (!response.body) {
        throw new Error("Streaming is not supported.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      let streamedMessage = "";

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

      /*
       * Gemini:
       *   streamedMessage = "These are the best matches..."
       *
       * Local fallback:
       *   streamedMessage = ""
       *
       * Jadi kita tetap punya message untuk AIMessage.
       */
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
      setStreamingMessage("");

      setError(
        reason instanceof Error
          ? reason.message
          : "Could not find a film."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {messages.length === 0 && <ChatHeader />}

      {messages.map((message, index) => {
        if (message.type === "user_input") {
          return (
            <UserMessage
              key={`${message.type}-${index}`}
              message={message.content[0].text}
            />
          );
        }

        const resultIndex = messages
          .slice(0, index)
          .filter(item => item.type === "model_output")
          .length;

        return (
          <AIMessage
            key={`${message.type}-${index}`}
            content={message.content[0].text}
            recommendations={results[resultIndex] ?? []}
            films={films}
          />
        );
      })}

      {loading && streamingMessage && (
        <AIMessage
          content={streamingMessage}
          recommendations={[]}
          films={films}
        />
      )}

      {error && (
        <p role="alert" className="mt-3 text-primary">
          {error}
        </p>
      )}

      <form
        onSubmit={submit}
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
            type="submit"
            className="cursor-pointer"
            disabled={loading}
          >
            {loading ? <LuLoader /> : <LuSend />}
          </Button>
        </div>
      </form>
    </>
  );
}
