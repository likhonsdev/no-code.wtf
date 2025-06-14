# AI SDK UI

The AI SDK UI provides React components for building AI-powered user interfaces.

## Overview

The UI components are designed to work seamlessly with the AI SDK Core and provide:
- Ready-to-use chatbot interfaces
- Message persistence
- Tool integration UI
- Generative interfaces

## Chatbot Component

```typescript
import { Chatbot } from 'ai/react'

function MyChat() {
  return (
    <Chatbot
      initialMessages={[]}
      onMessage={async (message) => {
        // Handle new messages
      }}
      tools={myTools}
    />
  )
}
```

## Message Persistence

```typescript
import { useChatStorage } from 'ai/react'

function PersistentChat() {
  const { messages, addMessage } = useChatStorage('chat-history')
  
  return (
    <Chatbot
      messages={messages}
      onMessage={addMessage}
    />
  )
}
```

## Generative User Interfaces

```typescript
import { GenerativeUI } from 'ai/react'

function AIForm() {
  return (
    <GenerativeUI
      schema={formSchema}
      onGenerate={async (data) => {
        // Handle generated form data
      }}
    />
  )
}
```

## Streaming Custom Data

```typescript
import { useStreamingText } from 'ai/react'

function StreamingComponent() {
  const { text, isStreaming } = useStreamingText({
    prompt: "Generate a story",
  })
  
  return <div>{text}</div>
}
```

## Error Handling

```typescript
import { AIErrorBoundary } from 'ai/react'

function SafeAIComponent() {
  return (
    <AIErrorBoundary fallback={<ErrorDisplay />}>
      <AIComponent />
    </AIErrorBoundary>
  )
}
```
