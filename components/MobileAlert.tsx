"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Droplets, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DayData } from "@/types/water"
import { formatAmount } from "@/utils/waterUtils"

interface MobileAlertProps {
  show: boolean
  todayData: DayData
  onDismiss: () => void
  onAddWater?: () => void
}

export function MobileAlert({ show, todayData, onDismiss, onAddWater }: MobileAlertProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setIsExiting(false)
    }
  }, [show])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onDismiss()
    }, 300)
  }

  const handleAddWater = () => {
    onAddWater?.()
    handleDismiss()
  }

  if (!isVisible) return null

  const remaining = todayData.goal - todayData.total
  const isGoalMet = todayData.total >= todayData.goal

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card
        className={cn(
          "w-full max-w-sm mx-auto shadow-2xl border-2 border-blue-200",
          "transition-all duration-300 transform",
          !isExiting && "animate-slide-in-right scale-100",
          isExiting && "animate-slide-out-right scale-95 opacity-0",
        )}
      >
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500 animate-pulse" />
              <span className="font-semibold text-blue-600">Hydration Reminder</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <Droplets className="h-12 w-12 text-blue-500 mx-auto animate-bounce" />

            {isGoalMet ? (
              <div>
                <h3 className="text-lg font-bold text-green-600">Great Job! 🎉</h3>
                <p className="text-sm text-gray-600">
                  You've reached your daily goal of {formatAmount(todayData.goal)}!
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-blue-600">Time to Hydrate! 💧</h3>
                <p className="text-sm text-gray-600">
                  You still need <span className="font-semibold text-blue-500">{formatAmount(remaining)}</span> to reach
                  your daily goal.
                </p>
              </div>
            )}

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Today's Progress</div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{formatAmount(todayData.total)}</span>
                <span className="text-xs text-gray-400">of</span>
                <span className="text-sm font-medium">{formatAmount(todayData.goal)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((todayData.total / todayData.goal) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {!isGoalMet && onAddWater && (
              <Button onClick={handleAddWater} className="flex-1 bg-blue-500 hover:bg-blue-600">
                <Droplets className="h-4 w-4 mr-2" />
                Add Water
              </Button>
            )}
            <Button variant="outline" onClick={handleDismiss} className="flex-1 bg-transparent">
              {isGoalMet ? "Awesome!" : "Later"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
