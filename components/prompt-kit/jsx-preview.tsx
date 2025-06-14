"use client"

import { JsxParser } from "react-jsx-parser"

interface JSXPreviewProps {
  jsx: string
  isStreaming?: boolean
  className?: string
  [key: string]: any
}

export function JSXPreview({ jsx, isStreaming = false, className, ...props }: JSXPreviewProps) {
  return (
    <div className={className}>
      <JsxParser
        jsx={jsx}
        disableKeyGeneration={true}
        blacklistedTags={["script", "iframe"]}
        {...props}
      />
    </div>
  )
}