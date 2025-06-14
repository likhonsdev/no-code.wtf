"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SuggestedActions } from "@/components/suggested-actions"
import type { UseChatHelpers } from "@ai-sdk/react"
import type { VisibilityType } from "@/components/visibility-selector"

const promptInputVariants = cva("flex flex-col gap-0", {
  variants: {
    variant: {
      default: "relative w-full rounded-xl border px-0 py-0",
    },
    size: {
      default: "w-full",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

interface PromptInputProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof promptInputVariants> {
  isLoading?: boolean
  value?: string
  onValueChange?: (value: string) => void
  onSubmit?: () => void
  chatId?: string
  append?: UseChatHelpers["append"]
  selectedVisibilityType?: VisibilityType
}

const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  ({ className, variant, size, isLoading, value, onValueChange, onSubmit, children, chatId, append, selectedVisibilityType, ...props }, ref) => {

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        onSubmit?.()
      }
    }

    return (
      <div
        className={cn(promptInputVariants({ variant, size, className }))}
        ref={ref}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
        {value === "" && append && chatId && selectedVisibilityType && (
          <div className="px-4 pb-4">
            <SuggestedActions
              chatId={chatId}
              append={append}
              selectedVisibilityType={selectedVisibilityType}
            />
          </div>
        )}
      </div>
    )
  }
)
PromptInput.displayName = "PromptInput"

const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "text-foreground bg-transparent w-full resize-none px-3 py-[10px] outline-none placeholder:opacity-50",
        className
      )}
      rows={1}
      ref={ref}
      {...props}
    />
  )
})
PromptInputTextarea.displayName = "PromptInputTextarea"

const promptInputActionsVariants = cva("flex items-center", {
  variants: {
    variant: {
      default: "",
    },
    size: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

interface PromptInputActionsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof promptInputActionsVariants> {}

const PromptInputActions = React.forwardRef<HTMLDivElement, PromptInputActionsProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(promptInputActionsVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
PromptInputActions.displayName = "PromptInputActions"

interface PromptInputActionProps {
  children: React.ReactNode
  tooltip?: string
  delayDuration?: number
}

function PromptInputAction({
  children,
  tooltip,
  delayDuration = 0,
}: PromptInputActionProps) {
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

export { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea }
