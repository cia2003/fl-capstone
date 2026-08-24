import { filmTools } from "@/agents/tools/filmTools";
import { InferUITools, UIMessage } from "ai";

export type ChatMessage = {
  type: "user_input" | "model_output";
  content: [{
    type: "text", 
    text: string
  }];
};

export type FilmTools = InferUITools<typeof filmTools>
export type FilmUIMessage = UIMessage<never, never, FilmTools>