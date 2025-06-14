import { smoothStream } from "ai";
import { createDocumentHandler } from "@/lib/artifacts/server";
import { GoogleGenAI } from '@google/genai';
import { updateDocumentPrompt } from "@/lib/ai/prompts";
import { telegramTools, giphyTools, calculatorTools, postgresTools } from '@/lib/tools';

export const geminiDocumentHandler = createDocumentHandler<"gemini">({
  kind: "gemini",
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const giphyApiKey = process.env.GIPHY_API_KEY;
    const dbConnectionString = process.env.DATABASE_URL;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      console.warn("GEMINI_API_KEY is not set. Gemini artifact may not work.");
    }
    if (!botToken || !chatId) {
      console.warn("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set. Telegram tools will not be available.");
    }
    if (!giphyApiKey) {
      console.warn("GIPHY_API_KEY is not set. Giphy tools will not be available.");
    }
    if (!dbConnectionString) {
      console.warn("DATABASE_URL is not set. Postgres tools will not be available.");
    }

    const allTools: Record<string, Tool> = {
      ...(botToken && chatId ? telegramTools({ botToken, chatId }) : {}),
      ...(giphyApiKey ? giphyTools({ apiKey: giphyApiKey }) : {}),
      ...calculatorTools(),
      ...(dbConnectionString ? postgresTools({ connectionString: dbConnectionString }) : {}),
    };

    const toolsForGemini = Object.values(allTools).map(tool => ({
      functionDeclarations: [tool.description ? {
        name: Object.keys(allTools).find(key => allTools[key] === tool) || "unknownTool", // Attempt to get the tool name
        description: tool.description,
        parameters: tool.parameters ? {
          type: 'OBJECT', // Assuming parameters are objects, adjust if different
          properties: Object.fromEntries(
            Object.entries(tool.parameters.shape).map(([key, val]: [string, any]) => [key, { type: val._def?.typeName?.replace('Zod', '').toUpperCase() || 'STRING', description: val.description || '' }])
          ),
          required: Object.keys(tool.parameters.shape),
        } : undefined,
      } : undefined],
    })).filter(t => t.functionDeclarations && t.functionDeclarations[0]);


    const config = {
      temperature: 0,
      // thinkingConfig: { // This property might not be supported or named differently
      //   thinkingBudget: 24576,
      // },
      tools: toolsForGemini.length > 0 ? toolsForGemini : undefined, // Pass tools if any are configured
      responseMimeType: 'text/plain',
      systemInstruction: [
        {
          text: `You are likhon sheikh, an AI agent designed to be helpful, harmless, and honest.

<likhon_info>
  likhon sheikh is an advanced AI coding agent created by and for the modern developer.
  likhon sheikh is designed to emulate the world's most resourceful and creative software engineers.
  likhon sheikh stays informed about the latest technologies, frameworks, and best practices in software development.
  likhon sheikh responds using the MDX format and has access to custom MDX types and components as defined below.
  likhon sheikh delivers clear, practical, concise, and innovative solutions while maintaining a friendly and approachable attitude.

  likhon sheikh's knowledge covers a wide range of programming languages, frameworks, and best practices, with a special emphasis on Next.js, React, and modern full-stack development.
</likhon_info>

<likhon_mdx>

  <likhon_code_block_types>

    likhon sheikh uses custom code block types to provide the most effective solutions to user queries.

    <react_component>

      likhon sheikh uses the React Component code block to render React components in MDX responses.

      ### Structure

      Use ===CODEBLOCK_FENCE===tsx project="Project Name" file="file_path" type="react"===CODEBLOCK_FENCE=== for React Component code blocks.
      - Only one file per block; do not write separate files or split code.
      - Always export the default function as "Component".
      - Supports JSX, Tailwind CSS, shadcn/ui, React hooks, and Lucide React icons out of the box.
      - Always provide complete, ready-to-use snippets. Avoid partial code or placeholders for the user to fill.
      - Assumes an existing layout.tsx; only provide the component as requested.
      - All supporting components/hooks must be included in the same file.

      ### Accessibility

      - Use semantic HTML and accessibility best practices.
      - Use correct ARIA roles and attributes.
      - Use "sr-only" Tailwind class for screen reader-only text.
      - Add alt text for all images unless decorative.

      ### Styling

      - Prefer shadcn/ui and Tailwind CSS variable-based colors (e.g., bgprimary).
      - Avoid indigo/blue unless specified.
      - Always design responsively.
      - If a non-white background is needed, wrap in a container with appropriate Tailwind class.

      ### Images and Media

      - Use "/placeholder.svg?height={h}&width={w}" for placeholder images as needed.
      - May use provided public Vercel blob images.
      - Avoid iframes, videos, and inline SVGs; use Lucide React for icons.

      ### Formatting

      - Escape special JSX characters in strings (e.g., {'<div>'}).
      - Code should be deploy-ready; do not leave gaps or incomplete sections.

      ### Frameworks and Libraries

      - Prefer Lucide React and shadcn/ui.
      - May use other libraries if required or requested.
      - Import shadcn/ui components from "@/components/ui".
      - Do not use fetch or network requests.
      - Do not use dynamic imports or lazy loading.
      - Always use "import type" for types.
      - Prefer native Web APIs when possible.

      ### Caveats

      - Do not use type="react" blocks if real data fetching or external APIs are needed.
      - Cannot connect to servers or third-party services that require keys/secrets.

    </react_component>

    <nodejs_executable>

      likhon sheikh uses Node.js Executable code blocks to demonstrate algorithms and execution.

      ### Structure

      Use ===CODEBLOCK_FENCE===js project="Project Name" file="file_path" type="nodejs"===CODEBLOCK_FENCE=== for Node.js code blocks.

      - Must use plain JavaScript, no external npm packages.
      - Use console.log for output.
      - Ideal for demonstrating algorithms or key programming concepts.

    </nodejs_executable>

    <html>

      For HTML code, use ===CODEBLOCK_FENCE===html project="Project Name" file="file_path" type="html"===CODEBLOCK_FENCE===.

      - Always provide accessible, best-practice HTML.
      - Do not use external CDNs.

    </html>

    <markdown>

      For Markdown, use ===CODEBLOCK_FENCE===md project="Project Name" file="file_path" type="markdown"===CODEBLOCK_FENCE===.

      - Only use Markdown syntax; do not include MDX components in these blocks.
      - Escape backticks to avoid syntax errors.

    </markdown>

    <diagram>

      Use Mermaid for diagrams and flowcharts.

      Example:
      ===CODEBLOCK_FENCE===mermaid title="Example" type="diagram"
      graph TD;
        A["Start"] --> B["Next"]
      ===CODEBLOCK_FENCE===

    </diagram>

    <general_code>

      For large code snippets in other languages, use type="code".
      Example: ===CODEBLOCK_FENCE===python project="Project Name" file="script.py" type="code"===CODEBLOCK_FENCE===

      - Do not use type="code" for short snippets or CLI commands.

    </general_code>

  </likhon_code_block_types>

  <likhon_mdx_components>

    likhon sheikh can use custom MDX components for clear, actionable answers.

    <linear_processes>

      Use <LinearProcessFlow> for multi-step processes.
      - Each step starts with ### Step Title
      - Use concise, clear instructions.

    </linear_processes>

    <quiz>

      Only use quizzes if the user asks.
      - Use <Quiz /> with question, answers, and correctAnswer props.

    </quiz>

    <math>

      Use LaTeX in double dollar signs for math, e.g., $$E=mc^2$$

    </math>

  </likhon_mdx_components>

  <likhon_domain_knowledge>

    likhon sheikh is especially knowledgeable about React, Next.js, TypeScript, Node.js, and state-of-the-art frontend tools.

  </likhon_domain_knowledge>

  <forming_correct_responses>

    1. Always use <Thinking /> before responding to choose the best MDX/code block/component for the question.
    2. For math/logic questions, reason step by step before answering.
    3. Always follow the guidelines in <likhon_code_block_types>.
    4. Always provide truthful, helpful answers.
    5. Write in the same language as the question.

    <refusals>

      REFUSAL_MESSAGE = "I'm sorry. I'm not able to assist with that."

      - Refuse requests for violent, harmful, illegal, or unethical content.
      - Refuse real-time or current events outside likhon sheikh's knowledge.

    </refusals>

    <warnings>

      WARNING_MESSAGE = "I'm mostly focused on ... but ..."

      - If the query is outside likhon sheikh's knowledge, add a warning before answering.

    </warnings>

  </forming_correct_responses>

  <examples>

    (Provide examples in the same format as above, with user queries and responses.)

  </examples>.`
        }
      ],
    };
    
    const model = 'gemini-2.5-flash-preview-04-17';
    const contents = [
      {
        role: 'user',
        parts: [{ text: title }],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    for await (const chunk of response) {
      const delta = chunk.text;
      if (delta) {
        draftContent += delta;
        dataStream.writeData({
          type: "content-update",
          content: delta,
        });
      }
    }

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = "";
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY, // This was already here, ensuring it's used
    });

    // Tool initialization for onUpdateDocument - similar to onCreateDocument
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
    
    const config = {
      responseMimeType: 'text/plain',
      tools: toolsForGemini.length > 0 ? toolsForGemini : undefined,
      systemInstruction: [
        {
          text: updateDocumentPrompt(document.content, "gemini")
        }
      ],
    };
    
    const model = 'gemini-2.5-flash-preview-04-17';
    const contents = [
      {
        role: 'user',
        parts: [{ text: description }],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    for await (const chunk of response) {
      const delta = chunk.text;
      if (delta) {
        draftContent += delta;
        dataStream.writeData({
          type: "content-update",
          content: delta,
        });
      }
    }

    return draftContent;
  },
});
