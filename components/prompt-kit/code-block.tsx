"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { getHighlighter, type Highlighter } from "shiki"

// Initialize a Shiki highlighter instance
let highlighter: Highlighter | null = null

async function ensureHighlighter() {
  if (!highlighter) {
    highlighter = await getHighlighter({
      themes: ["github-light", "github-dark", "dracula", "nord"],
      langs: [
        "javascript",
        "typescript",
        "tsx",
        "python",
        "css",
        "bash",
        "json",
        "markdown",
      ],
    })
  }
  return highlighter
}

interface CodeBlockProps extends React.HTMLProps<HTMLDivElement> {}

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-md border bg-muted font-sans",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CodeBlockCodeProps extends React.HTMLProps<HTMLDivElement> {
  code: string
  language?: string
  theme?: string
}

function CodeBlockCode({
  code,
  language = "tsx",
  theme = "github-light",
  className,
  ...props
}: CodeBlockCodeProps) {
  const [highlightedCode, setHighlightedCode] = React.useState("")

  React.useEffect(() => {
    let isMounted = true
    const highlight = async () => {
      const h = await ensureHighlighter()
      if (isMounted) {
        const html = h.codeToHtml(code, {
          lang: language,
          theme: theme,
        })
        setHighlightedCode(html)
      }
    }
    highlight()

    return () => {
      isMounted = false
    }
  }, [code, language, theme])

  return (
    <div
      className={cn("overflow-x-auto p-4", className)}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
      {...props}
    />
  )
}

interface CodeBlockGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

function CodeBlockGroup({ children, className, ...props }: CodeBlockGroupProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { CodeBlock, CodeBlockCode, CodeBlockGroup }