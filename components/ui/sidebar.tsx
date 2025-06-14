"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import { Button } from "./button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

interface SidebarProviderProps {
  children: React.ReactNode
}

const SidebarContext = React.createContext<{
  showSidebar: boolean
  setShowSidebar: (show: boolean) => void
}>({
  showSidebar: false,
  setShowSidebar: () => {},
})

function SidebarProvider({ children }: SidebarProviderProps) {
  const [showSidebar, setShowSidebar] = React.useState(true)

  return (
    <SidebarContext.Provider value={{ showSidebar, setShowSidebar }}>
      <div className="flex min-h-screen">
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, ...props }, ref) => {
    const { showSidebar } = React.useContext(SidebarContext)

    return (
      <aside
        ref={ref}
        className={cn(
          "bg-background fixed left-0 top-0 z-30 h-full w-72 overflow-y-auto overflow-x-hidden border-r transition-transform lg:relative lg:translate-x-0",
          !showSidebar && "-translate-x-full",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    )
  }
)
Sidebar.displayName = "Sidebar"

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("", className)} {...props} />
    )
  }
)
SidebarHeader.displayName = "SidebarHeader"

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("pb-12", className)} {...props} />
    )
  }
)
SidebarContent.displayName = "SidebarContent"

interface SidebarTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, ...props }, ref) => {
    const { setShowSidebar } = React.useContext(SidebarContext)

    return (
      <button
        ref={ref}
        onClick={() => setShowSidebar(true)}
        className={cn(
          "hover:bg-foreground/5 inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors lg:hidden",
          className
        )}
        {...props}
      >
        <Menu />
      </button>
    )
  }
)
SidebarTrigger.displayName = "SidebarTrigger"

interface SidebarInsetProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarInset = React.forwardRef<HTMLDivElement, SidebarInsetProps>(
  ({ className, ...props }, ref) => {
    const { showSidebar } = React.useContext(SidebarContext)

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex-1 overflow-hidden transition-[padding-left] duration-300",
          showSidebar ? "lg:pl-72" : "lg:pl-0",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarInset.displayName = "SidebarInset"

interface SidebarOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarOverlay = React.forwardRef<HTMLDivElement, SidebarOverlayProps>(
  ({ className, ...props }, ref) => {
    const { showSidebar, setShowSidebar } = React.useContext(SidebarContext)

    if (!showSidebar) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden",
          className
        )}
        onClick={() => setShowSidebar(false)}
        {...props}
      />
    )
  }
)
SidebarOverlay.displayName = "SidebarOverlay"

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("px-4 py-2", className)} {...props} />
    )
  }
)
SidebarGroup.displayName = "SidebarGroup"

interface SidebarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarSeparator = React.forwardRef<HTMLDivElement, SidebarSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("bg-border -mx-1 my-1 h-px", className)}
        {...props}
      />
    )
  }
)
SidebarSeparator.displayName = "SidebarSeparator"

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-muted-foreground mb-2 px-2 text-xs", className)}
        {...props}
      />
    )
  }
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarMenu = React.forwardRef<HTMLDivElement, SidebarMenuProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-1", className)} {...props} />
    )
  }
)
SidebarMenu.displayName = "SidebarMenu"

interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "hover:bg-muted text-foreground flex w-full items-center rounded-lg px-2 py-2 text-left text-sm",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarOverlay,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
}
