import { filmTools } from "@/agents/tools/filmTools";
import { InferUITools, ToolUIPart, UIMessage } from "ai";

export type ChatMessage = {
  type: "user_input" | "model_output";
  content: [{
    type: "text", 
    text: string
  }];
};

export type FilmTools = InferUITools<ReturnType<typeof filmTools>>
export type FilmToolPart = ToolUIPart<FilmTools>
export type FilmUIMessage = UIMessage<never, never, FilmTools>