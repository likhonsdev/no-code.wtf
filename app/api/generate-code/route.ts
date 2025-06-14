import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { ReadableStream } from 'stream/web'; // Import ReadableStream

// Ensure GEMINI_API_KEY is available
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set. Code generation will fail.");
  // Optionally, throw an error or handle this case appropriately
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { userPrompt, language = "code" } = await req.json();

    if (!userPrompt) {
      return NextResponse.json({ error: "userPrompt is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest", // Using a common model, adjust if needed
      // The system instruction from your artifacts/gemini/server.ts is very extensive.
      // For a focused code generation task, a simpler one might be better.
      // You can expand this based on 'likhon sheikh's' persona if desired.
      systemInstruction: {
        role: "model", // or "system" depending on exact API, "model" is common for Gemini
        parts: [{
          text: `You are an expert ${language} programmer.
You generate only the raw code as requested by the user.
Do not include any explanatory text, introductions, or markdown formatting like \`\`\`${language} ... \`\`\` or \`\`\` ... \`\`\`.
Just output the plain code.
If the request is unclear or requires more than just code, ask for clarification instead of generating potentially incorrect code.
Ensure the generated code is complete and functional for the given prompt.`
        }],
      },
      generationConfig: {
        temperature: 0.2, // Lower temperature for more deterministic code
        maxOutputTokens: 2048,
      },
      safetySettings: [ // Basic safety settings
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ]
    });

    const stream = await model.generateContentStream([{
      role: "user",
      parts: [{ text: userPrompt }],
    }]);

    // Adapt the stream to a format Next.js can send
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff', // Prevent browser from interpreting content as HTML
      },
    });

  } catch (error) {
    console.error("Error in generate-code API:", error);
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
