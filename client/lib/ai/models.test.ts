// lib/ai/models.test.ts

import { simulateReadableStream } from 'ai';
import { MockLanguageModelV3 } from 'ai/test';

export const chatModel = new MockLanguageModelV3({
  doStream: async ({ prompt }) => {
    const promptText = JSON.stringify(prompt);

    if (promptText.includes('TEST_SERVER_ERROR')) {
      throw new Error('This is a test server error');
    }

    if (promptText.includes('TEST_RATE_LIMIT')) {
      throw new Error('Too many requests');
    }

    if (promptText.includes('TEST_SLOW_RESPONSE')) {
      return {
        stream: simulateReadableStream({
          initialDelayInMs: 5000,
          chunkDelayInMs: 500,
          chunks: [
            {
              type: 'text-start',
              id: 'text-1',
            },
            {
              type: 'text-delta',
              id: 'text-1',
              delta: 'This response was intentionally delayed.',
            },
            {
              type: 'text-end',
              id: 'text-1',
            },
            {
              type: 'finish',
              finishReason: 'stop',
              usage: {
                inputTokens: 1,
                outputTokens: 7,
                totalTokens: 8,
              },
            },
          ],
        }),
        warnings: [],
      };
    }

    if (promptText.includes('TEST_STREAM_ERROR')) {
      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue({
            type: 'text-start',
            id: 'text-1',
          });

          controller.enqueue({
            type: 'text-delta',
            id: 'text-1',
            delta: 'This response started successfully...',
          });

          await new Promise(resolve =>
            setTimeout(resolve, 1000),
          );

          controller.enqueue({
            type: 'text-delta',
            id: 'text-1',
            delta: ' but then the stream failed.',
          });

          await new Promise(resolve =>
            setTimeout(resolve, 1000),
          );

          controller.error(
            new Error('This is a test stream error'),
          );
        },
      });

      return {
        stream,
        warnings: [],
      };
    }

    return {
      stream: simulateReadableStream({
        initialDelayInMs: 100,
        chunkDelayInMs: 50,
        chunks: [
          {
            type: 'text-start',
            id: 'text-1',
          },
          {
            type: 'text-delta',
            id: 'text-1',
            delta: 'This is a normal test response.',
          },
          {
            type: 'text-end',
            id: 'text-1',
          },
          {
            type: 'finish',
            finishReason: 'stop',
            usage: {
              inputTokens: 1,
              outputTokens: 6,
              totalTokens: 7,
            },
          },
        ],
      }),
      warnings: [],
    };
  },
});