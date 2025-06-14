import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { telegramTools, giphyTools, calculatorTools, postgresTools } from '@/lib/tools';
import { Tool } from '@/lib/tools/types'; // Assuming you have a types file for Tool

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    // Initialize tools similar to artifacts/gemini/server.ts
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const giphyApiKey = process.env.GIPHY_API_KEY;
    const dbConnectionString = process.env.DATABASE_URL;

    const allTools: Record<string, Tool> = {
      ...(botToken && chatId ? telegramTools({ botToken, chatId }) : {}),
      ...(giphyApiKey ? giphyTools({ apiKey: giphyApiKey }) : {}),
      ...calculatorTools(),
      ...(dbConnectionString ? postgresTools({ connectionString: dbConnectionString }) : {}),
    };

    const toolsForGemini = Object.values(allTools).map(tool => ({
      functionDeclarations: [tool.description ? {
        name: Object.keys(allTools).find(key => allTools[key] === tool) || "unknownTool",
        description: tool.description,
        parameters: tool.parameters ? {
          type: 'OBJECT',
          properties: Object.fromEntries(
            Object.entries(tool.parameters.shape).map(([key, val]: [string, any]) => [key, { type: val._def?.typeName?.replace('Zod', '').toUpperCase() || 'STRING', description: val.description || '' }])
          ),
          required: Object.keys(tool.parameters.shape),
        } : undefined,
      } : undefined],
    })).filter(t => t.functionDeclarations && t.functionDeclarations[0]);

    const model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash-preview-04-17',
      tools: toolsForGemini.length > 0 ? toolsForGemini : undefined,
      systemInstruction: [
        {
          text: `You are an AI assistant that generates shell commands based on user requests.
          Respond only with the shell command, without any additional text or explanation.
          If the request cannot be fulfilled with a shell command, respond with "I cannot generate a command for that request."
          Examples:
          User: List all files in the current directory
          Command: ls -la
          User: Create a new directory called 'my_project'
          Command: mkdir my_project
          User: Remove a file named 'old_file.txt'
          Command: rm old_file.txt
          User: Install a new npm package called 'axios'
          Command: npm install axios
          User: What is the weather like today?
          Command: I cannot generate a command for that request.
          `
        }
      ],
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ command: responseText });

  } catch (error: any) {
    console.error('Error generating command:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate command' }, { status: 500 });
  }
}