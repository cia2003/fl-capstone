export type ChatMessage = {
  type: "user_input" | "model_output";
  content: [{
    type: "text", 
    text: string
  }];
};