import {
    streamText, 
    UIMessage, 
    convertToModelMessages, 
    createUIMessageStreamResponse, 
    toUIMessageStream,
    stepCountIs
} from 'ai'

import { google } from '@ai-sdk/google'
import { Film } from '@/types'
import { filmRecommenderPrompt } from '@/agents/prompts/filmRecommender'
import { filmTools } from '@/agents/tools/filmTools'

export const runtime = "nodejs"
export const maxDuration = 30

export async function POST(req: Request) {
    const { messages, films }: { messages: UIMessage[], films: Film[] } = await req.json()

    const result = streamText({
        model: google("gemini-3.5-flash-lite"),
        system: `${filmRecommenderPrompt} Verified film list: ${JSON.stringify(films)}`,
        messages: await convertToModelMessages(messages), 
        tools: filmTools(films), 
        stopWhen: stepCountIs(2),
    })

    return createUIMessageStreamResponse({
        stream: toUIMessageStream({ 
            stream: result.stream
         })
    })
}