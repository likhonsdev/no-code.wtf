import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { telegramTools, giphyTools, calculatorTools, postgresTools } from '@/lib/tools';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Initialize tools similar to artifacts/gemini/server.ts
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const giphyApiKey = process.env.GIPHY_API_KEY;
  const dbConnectionString = process.env.DATABASE_URL;

  const allTools = {
    ...(botToken && chatId ? telegramTools({ botToken, chatId }) : {}),
    ...(giphyApiKey ? giphyTools({ apiKey: giphyApiKey }) : {}),
    ...calculatorTools(),
    ...(dbConnectionString ? postgresTools({ connectionString: dbConnectionString }) : {}),
  };

  const result = streamText({
    model: openai('gpt-4o'), // Using gpt-4o as suggested in the migration guide
    system: 'You are a helpful AI assistant.',
    messages,
    tools: allTools,
  });

  return result.toDataStreamResponse();
}