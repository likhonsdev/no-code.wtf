# AI SDK Streaming

Comprehensive guide to streaming capabilities in the AI SDK, with focus on system prompts and advanced features.

## Text Streaming with System Prompts

```typescript
import { streamText, smoothStream } from "ai";

const { fullStream } = await streamText({
  model: "gemini-2.5-flash-preview-04-17",
  system: "You are a helpful assistant that specializes in technical documentation.",
  prompt: "Explain streaming in AI systems",
  experimental_transform: smoothStream({ chunking: "word" })
});

for await (const delta of fullStream) {
  if (delta.type === "text-delta") {
    console.log(delta.textDelta);
  }
}
```

## MCP Server Integration

The AI SDK supports Model Context Protocol (MCP) servers for extended capabilities:

```typescript
const mcpConfig = {
  mcpServers: {
    puppeteer: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-puppeteer"]
    },
    time: {
      command: "uvx",
      args: ["mcp-server-time"]
    },
    e2b: {
      command: "npx",
      args: ["-y", "@e2b/mcp-server"],
      env: {
        E2B_API_KEY: "your_api_key"
      }
    }
  }
};

const { fullStream } = await streamText({
  model: "gemini-2.5-flash-preview-04-17",
  system: "You are an AI agent with access to browser automation.",
  prompt: "Search for recent AI news",
  experimental_mcpServers: mcpConfig
});
```

## Smooth Streaming

Enable word-by-word or character-by-character smooth streaming:

```typescript
import { smoothStream } from "ai";

const { fullStream } = await streamText({
  model: "gemini-2.5-flash-preview-04-17",
  system: "You are a storytelling AI.",
  prompt: "Tell me a story",
  experimental_transform: smoothStream({
    chunking: "word", // or "character"
    smoothing: true
  })
});
```

## Advanced Transforms

Custom stream transformations for special use cases:

```typescript
const customTransform = (stream: AsyncIterable<any>) => {
  return async function* () {
    for await (const chunk of stream) {
      // Custom transformation logic
      yield chunk;
    }
  };
};

const { fullStream } = await streamText({
  model: "gemini-2.5-flash-preview-04-17",
  system: "Custom system prompt",
  prompt: "Input text",
  experimental_transform: customTransform
});
```
