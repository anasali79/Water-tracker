"use client"

import { useEffect, useState } from "react"
import { Droplets } from "lucide-react"

interface WaterDropAnimationProps {
  trigger: boolean
  onComplete?: () => void
}

export function WaterDropAnimation({ trigger, onComplete }: WaterDropAnimationProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (trigger) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        onComplete?.()
      }, 600)

      return () => clearTimeout(timer)
    }
  }, [trigger, onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <Droplets className="h-12 w-12 text-blue-500 animate-water-drop" />
    </div>
  )
}
