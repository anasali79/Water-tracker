"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode
  bounceOnClick?: boolean
}

export function AnimatedButton({ children, bounceOnClick = true, className, onClick, ...props }: AnimatedButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (bounceOnClick) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 200)
    }
    onClick?.(e)
  }

  return (
    <Button
      className={cn(
        "transition-all-smooth hover:scale-105 active:scale-95",
        isAnimating && "animate-bounce-gentle",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  )
}
