"use client"

import * as React from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Markdown from "markdown-to-jsx"

interface ReasoningProps {
  isStreaming?: boolean
  children?: React.ReactNode
  initialOpen?: boolean
  autoClose?: boolean
  className?: string
}

interface ReasoningTriggerProps {
  children?: React.ReactNode
  className?: string
}

interface ReasoningContentProps {
  children?: React.ReactNode
  className?: string
}

export function Reasoning({
  children,
  isStreaming = false,
  initialOpen = false,
  autoClose = true,
  className,
}: ReasoningProps) {
  const [isOpen, setIsOpen] = React.useState(initialOpen)

  React.useEffect(() => {
    if (!isStreaming && autoClose) {
      setIsOpen(false)
    }
  }, [isStreaming, autoClose])

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("w-full", className)}
    >
      {children}
    </Collapsible>
  )
}

export function ReasoningTrigger({
  children,
  className,
}: ReasoningTriggerProps) {
  return (
    <CollapsibleTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "px-2 font-normal text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
          className
        )}
      >
        {children}
      </Button>
    </CollapsibleTrigger>
  )
}

export function ReasoningContent({
  children,
  className,
}: ReasoningContentProps) {
  return (
    <CollapsibleContent className={cn("space-y-2", className)}>
      {typeof children === "string" ? (
        <Markdown>{children}</Markdown>
      ) : (
        children
      )}
    </CollapsibleContent>
  )
}
