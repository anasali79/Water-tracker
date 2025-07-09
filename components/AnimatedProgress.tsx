"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface AnimatedProgressProps {
  value: number
  className?: string
}

export function AnimatedProgress({ value, className }: AnimatedProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 100)

    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className={cn("relative", className)}>
      <Progress value={animatedValue} className="h-3 progress-bar-smooth" />
    </div>
  )
}
