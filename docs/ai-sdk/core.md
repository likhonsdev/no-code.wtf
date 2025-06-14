# AI SDK Core

The AI SDK Core provides fundamental building blocks for AI-powered applications.

## Overview

The AI SDK Core offers a comprehensive set of tools and utilities for building AI-powered applications with a focus on:
- Text generation
- Structured data handling
- Tool integration
- Advanced language model interactions

## Generating Text

```typescript
import { AI } from 'ai'

const ai = new AI()
const completion = await ai.generateText({
  prompt: "Tell me about AI SDK",
  model: "gpt-4"
})
```

## Generating Structured Data

```typescript
interface UserProfile {
  name: string;
  interests: string[];
}

const profile = await ai.generateStructured<UserProfile>({
  prompt: "Generate a user profile",
  schema: UserProfileSchema
})
```

## Tool Calling

The SDK supports seamless tool integration:

```typescript
const tools = {
  calculator: (a: number, b: number) => a + b,
  weatherApi: (location: string) => fetch(`/api/weather/${location}`)
}

const result = await ai.run({
  prompt: "What's 2+2 and the weather?",
  tools
})
```

## Settings

Configure the SDK behavior:

```typescript
ai.configure({
  defaultModel: "gpt-4",
  temperature: 0.7,
  maxTokens: 1000
})
```

## Embeddings

Generate and work with embeddings:

```typescript
const embedding = await ai.createEmbedding({
  text: "Sample text for embedding",
  model: "text-embedding-3-small"
})
```

## Error Handling

```typescript
try {
  const result = await ai.generateText({ prompt: "..." })
} catch (error) {
  if (error instanceof AIError) {
    console.error("AI Error:", error.message)
  }
}
```
