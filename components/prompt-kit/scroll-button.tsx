"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

interface ScrollButtonProps extends React.ComponentProps<typeof Button> {
  threshold?: number
}

function ScrollButton({ className, threshold = 100, ...props }: ScrollButtonProps) {
  const [show, setShow] = useState(false)
  const lastScrollTop = useRef(0)

  const handleScroll = useCallback(() => {
    const st = window.scrollY
    if (st > threshold) {
      setShow(true)
    } else {
      setShow(false)
    }
    lastScrollTop.current = st
  }, [threshold])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!show) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("h-9 w-9 rounded-full", className)}
      onClick={scrollToTop}
      {...props}
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  )
}

export { ScrollButton }
