import { addAssistantMessage, addUserMessage } from "../utils/helpers";

import type { GeminiHistoryItem } from "../utils/helpers";
import { ChatMessage } from "@/types/chat";

export function buildGeminiHistory(
    messages: ChatMessage[]
): GeminiHistoryItem[] {
    const history: GeminiHistoryItem[] = []

    for (const message of messages) {
        const text = message.content[0].text

        if (typeof text !== 'string') {
            continue
        }

        if (message.type === "model_output") {
            addAssistantMessage(history, text)
            continue
        }

        if (message.type === "user_input") {
            addUserMessage(history, text)
        }
    }

    return history
}