# AI SDK RSC (React Server Components)

Documentation for using AI SDK with React Server Components.

## Overview

The AI SDK provides first-class support for React Server Components, enabling:
- Server-side AI processing
- Streaming responses
- Efficient data handling
- Integration with Next.js App Router

## Basic Usage

```typescript
// app/page.tsx
import { AI } from 'ai/rsc'

export default async function Page() {
  const ai = new AI()
  const completion = await ai.generateText({
    prompt: "Server-side generated content"
  })
  
  return <div>{completion}</div>
}
```

## Streaming with RSC

```typescript
// app/streaming/page.tsx
import { StreamingText } from 'ai/rsc'

export default function StreamingPage() {
  return (
    <StreamingText 
      prompt="Generate a story"
      model="gpt-4"
    />
  )
}
```

## Data Fetching

```typescript
import { createAIAction } from 'ai/rsc'

const fetchAIData = createAIAction(async (prompt: string) => {
  const ai = new AI()
  return ai.generateStructured({
    prompt,
    schema: MyDataSchema
  })
})
```

## Error Handling

```typescript
import { AIErrorBoundary } from 'ai/rsc'

export default function SafePage() {
  return (
    <AIErrorBoundary fallback={<Error />}>
      <AIComponent />
    </AIErrorBoundary>
  )
}
```
