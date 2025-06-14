"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface PromptInputProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export interface PromptInputTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export interface PromptInputActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export interface PromptInputActionProps {
  className?: string;
  children: React.ReactNode;
  tooltip?: string;
}

const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full items-end gap-2 rounded-lg border bg-background p-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PromptInput.displayName = "PromptInput";

const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  PromptInputTextareaProps
>(({ className, ...props }, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [props.value]);

  return (
    <textarea
      ref={(el) => {
        if (typeof ref === "function") {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
        textareaRef.current = el;
      }}
      rows={1}
      className={cn(
        "flex min-h-[60px] w-full resize-none bg-transparent px-4 py-3 text-base focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
PromptInputTextarea.displayName = "PromptInputTextarea";

const PromptInputActions = React.forwardRef<HTMLDivElement, PromptInputActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 px-2", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PromptInputActions.displayName = "PromptInputActions";

const PromptInputAction = React.forwardRef<HTMLDivElement, PromptInputActionProps>(
  ({ className, children, tooltip, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        title={tooltip}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PromptInputAction.displayName = "PromptInputAction";

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
};
