"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useState } from "react"

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("group", className)} {...props} />
  }
)
Message.displayName = "Message"

interface MessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  markdown?: boolean
}

const MessageContent = React.forwardRef<HTMLDivElement, MessageContentProps>(
  ({ className, markdown, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl px-4 py-2 text-sm",
          markdown && "prose",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
MessageContent.displayName = "MessageContent"

interface MessageActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const MessageActions = React.forwardRef<HTMLDivElement, MessageActionsProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex gap-2", className)} {...props} />
  }
)
MessageActions.displayName = "MessageActions"

interface MessageActionProps {
  children: React.ReactNode
  tooltip?: string
  delayDuration?: number
}

function MessageAction({ children, tooltip, delayDuration = 0 }: MessageActionProps) {
  if (!tooltip) {
    return <>{children}</>
  }

  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

interface MessageAvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

function MessageAvatar({ className, src, alt, ...props }: MessageAvatarProps) {
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [src])

  if (error) {
    return null
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("rounded-full object-cover", className)}
      onError={() => setError(true)}
      {...props}
    />
  )
}

export { Message, MessageAction, MessageActions, MessageAvatar, MessageContent }
