import type { Film } from "@/types";
import ReactMarkdown from "react-markdown"
import { FilmUIMessage } from "@/types/chat";
import ToolPart from "../Tools/ToolPart";

type AIMessageProps = {
  message: FilmUIMessage,
  films: Film[], 
  loading: boolean, 
  onNewChat: () => void, 
  addToolOutput: any
}

export function AIMessage({ message, films, loading=false, onNewChat, addToolOutput }: AIMessageProps) {
  return (
    <div className="mt-6">
      {
        message.parts.map(
          (part, index) => {
            if (part.type === "text") {
              return (
                <div key={`text-${index}`} className="font-medium">
                  <ReactMarkdown>
                    {part.text}
                  </ReactMarkdown>
                </div>
              )
            }

            if (part.type.startsWith('tool-')) {
              return (
                <ToolPart key={part.toolCallId} part={part} addToolOutput={addToolOutput} films={films} />
              )
            }
          }
        )
      }
    </div>
  )
}