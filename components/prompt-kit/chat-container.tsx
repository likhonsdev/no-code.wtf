"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChatContainerRootProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChatContainerRoot = React.forwardRef<HTMLDivElement, ChatContainerRootProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative flex flex-col overflow-y-auto", className)}
        {...props}
      />
    )
  }
)
ChatContainerRoot.displayName = "ChatContainerRoot"

interface ChatContainerContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChatContainerContent = React.forwardRef<HTMLDivElement, ChatContainerContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative flex flex-col gap-6", className)}
        {...props}
      />
    )
  }
)
ChatContainerContent.displayName = "ChatContainerContent"

interface ChatContainerScrollAnchorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ChatContainerScrollAnchor = React.forwardRef<
  HTMLDivElement,
  ChatContainerScrollAnchorProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("h-0 w-full flex-none", className)}
      {...props}
    />
  )
})
ChatContainerScrollAnchor.displayName = "ChatContainerScrollAnchor"

export { ChatContainerRoot, ChatContainerContent, ChatContainerScrollAnchor }
