# Stream Helpers

Utility functions and components for handling streaming AI responses.

## Overview

The Stream Helpers provide utilities for:
- Managing streaming responses
- Handling different languages
- Protocol implementations
- Error handling

## Japanese Text Streaming

```typescript
import { useJapaneseStream } from 'ai/streams'

function JapaneseText() {
  const { text, isComplete } = useJapaneseStream({
    prompt: "日本語のテキストを生成してください",
    smoothing: true
  })
  
  return <div>{text}</div>
}
```

## Chinese Text Streaming

```typescript
import { useChineseStream } from 'ai/streams'

function ChineseText() {
  const { text, isComplete } = useChineseStream({
    prompt: "请生成中文文本",
    smoothing: true
  })
  
  return <div>{text}</div>
}
```

## Stream Protocols

```typescript
import { createStreamProtocol } from 'ai/streams'

const protocol = createStreamProtocol({
  type: 'sse',
  parser: customParser,
  errorHandler: (error) => {
    // Handle streaming errors
  }
})
```

## Error Handling

```typescript
import { StreamErrorBoundary } from 'ai/streams'

function SafeStream() {
  return (
    <StreamErrorBoundary fallback={<Error />}>
      <StreamingComponent />
    </StreamErrorBoundary>
  )
}
```
