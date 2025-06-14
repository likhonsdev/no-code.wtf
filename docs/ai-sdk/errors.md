# AI SDK Errors

Comprehensive guide to error handling in the AI SDK.

## Overview

The AI SDK provides a robust error handling system that includes:
- Standard error types
- Error boundaries
- Recovery strategies
- Telemetry integration

## Standard Error Types

```typescript
import { AIError, StreamError, ToolError } from 'ai/errors'

// Base AI Error
class AIError extends Error {
  constructor(message: string, public code: string) {
    super(message)
  }
}

// Streaming Error
class StreamError extends AIError {
  constructor(message: string, public stream: string) {
    super(message, 'STREAM_ERROR')
  }
}

// Tool Execution Error
class ToolError extends AIError {
  constructor(message: string, public tool: string) {
    super(message, 'TOOL_ERROR')
  }
}
```

## Error Handling Examples

```typescript
try {
  await ai.generateText({ prompt: "..." })
} catch (error) {
  if (error instanceof StreamError) {
    // Handle streaming errors
  } else if (error instanceof ToolError) {
    // Handle tool execution errors
  } else if (error instanceof AIError) {
    // Handle general AI errors
  }
}
```

## Error Recovery

```typescript
const result = await ai.generateText({
  prompt: "...",
  retry: {
    attempts: 3,
    backoff: 'exponential'
  },
  fallback: "Default response if all retries fail"
})
```

## Error Boundaries

```typescript
import { AIErrorBoundary } from 'ai/react'

function SafeAIComponent() {
  return (
    <AIErrorBoundary
      fallback={<ErrorDisplay />}
      onError={(error) => {
        // Log error to service
      }}
    >
      <AIComponent />
    </AIErrorBoundary>
  )
}
```
