import {
    streamText, 
    UIMessage, 
    convertToModelMessages, 
    createUIMessageStreamResponse, 
    toUIMessageStream,
} from 'ai'

import { google } from '@ai-sdk/google'
import { Film } from '@/types'
import { filmRecommenderPrompt } from '@/agents/prompts/filmRecommender'
import { filmTools } from '@/agents/tools/filmTools'

export const runtime = "nodejs"

export async function POST(req: Request) {
    const { messages, films }: { messages: UIMessage[], films: Film[] } = await req.json()

    const result = streamText({
        model: google("gemini-3.5-flash-lite"),
        system: `${filmRecommenderPrompt} Verified film list: ${JSON.stringify(films)}`,
        messages: await convertToModelMessages(messages), 
        tools: filmTools(films), 
    })

    const delayedStream = result.stream.pipeThrough(new TransformStream({
        async transform(chunk, controller) {
            // Introduce a 100ms delay for each chunk
            await new Promise(resolve => setTimeout(resolve, 500));
            controller.enqueue(chunk);
        }
    }))

    return createUIMessageStreamResponse({
        stream: toUIMessageStream({ 
            stream: delayedStream
         })
    })
}