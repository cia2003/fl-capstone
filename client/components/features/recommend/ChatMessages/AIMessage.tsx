import type { Film, Recommendation } from "@/types";
import { RankedResultList } from "../RankedResultList";
import ReactMarkdown from "react-markdown"
import { FilmUIMessage } from "@/types/chat";
import { getTextFromMessage, getToolErrorFromMessage, getToolOutputFromMessage } from "@/lib/utils/helpers";
import { ToolErrorCard } from "@/components/ui/ToolErrorCard";
import { useState } from "react";

type AIMessageProps = {
  message: FilmUIMessage,
  films: Film[], 
  loading: boolean, 
  onNewChat: () => void
}

export function AIMessage({ message, films, loading=false, onNewChat }: AIMessageProps) {
  const [input, setInput] = useState("")

  const text = getTextFromMessage(message)
  const toolResult = getToolOutputFromMessage(message)
  const toolError = getToolErrorFromMessage(message)

  if (toolError) {
    return (
      <div className="mt-6">
        <ToolErrorCard
          title="Something went wrong"
          message="We couldn't complete this request. Please start a new chat and try again."
          onNewChat={onNewChat}
        />
      </div>
    )
  }

  const displayMessage = toolResult?.output.message ?? text

  return (
    <div className="mt-6">
      <div className="font-medium">
        {
        displayMessage && (
          <ReactMarkdown >
            {displayMessage}
          </ReactMarkdown>
        )
        }
      </div>

      <RankedResultList recommendations={toolResult?.output.recommendations ?? []} films={films} loading={loading} />
    </div>
  );
}
