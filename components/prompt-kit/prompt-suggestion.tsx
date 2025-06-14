"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const promptSuggestionVariants = cva(
  "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 transition-colors duration-100 ease-in-out cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        default: "text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface PromptSuggestionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof promptSuggestionVariants> {
  children: React.ReactNode
  highlight?: string
}

function PromptSuggestion({
  className,
  variant,
  size,
  children,
  highlight,
  ...props
}: PromptSuggestionProps) {
  const content = React.useMemo(() => {
    if (!highlight) return children

    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = String(children).split(regex)

    return parts.map((part, i) =>
      part.toLowerCase() === highlight?.toLowerCase() ? (
        <span key={i} className="text-primary font-medium">
          {part}
        </span>
      ) : (
        part
      )
    )
  }, [children, highlight])

  return (
    <button
      className={cn(promptSuggestionVariants({ variant, size, className }))}
      {...props}
    >
      {content}
    </button>
  )
}

export { PromptSuggestion }
