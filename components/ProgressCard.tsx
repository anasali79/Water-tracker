import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target } from "lucide-react"
import type { DayData } from "@/types/water"
import { formatAmount } from "@/utils/waterUtils"
import { AnimatedProgress } from "./AnimatedProgress"

interface ProgressCardProps {
  todayData: DayData
  currentStreak: number
  isLoading?: boolean
  userName?: string
}

export function ProgressCard({ todayData, currentStreak, isLoading = false, userName }: ProgressCardProps) {
  // Ensure we're using the correct data for progress calculation
  const progressPercentage = todayData.goal > 0 ? Math.min((todayData.total / todayData.goal) * 100, 100) : 0
  const isGoalMet = todayData.total >= todayData.goal && todayData.goal > 0 && todayData.total > 0

  console.log(`📊 Progress: ${todayData.total}ml / ${todayData.goal}ml = ${progressPercentage}%`)

  if (isLoading) {
    return (
      <Card className="animate-fade-in-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Today's Progress {userName && `- ${userName}`}
              </CardTitle>
              <CardDescription>Loading user data...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-3 bg-gray-200 rounded animate-pulse" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Loading...</span>
            <span>Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Today's Progress {userName && `- ${userName}`}
            </CardTitle>
            <CardDescription>
              {formatAmount(todayData.total)} of {formatAmount(todayData.goal)} goal
            </CardDescription>
          </div>
          {isGoalMet && (
            <Badge variant="default" className="bg-green-500 animate-pulse-gentle">
              Goal Met! 🎉
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatedProgress value={progressPercentage} />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{Math.round(progressPercentage)}% complete</span>
          <span>
            {todayData.goal > todayData.total
              ? `${formatAmount(todayData.goal - todayData.total)} remaining`
              : todayData.total > 0
                ? "Goal achieved!"
                : "No intake yet"}
          </span>
        </div>
        {currentStreak > 0 && (
          <div className="flex items-center gap-2 text-sm animate-fade-in-up">
            <span className="text-orange-500 animate-pulse-gentle">🔥</span>
            <span>{currentStreak} day streak!</span>
          </div>
        )}
        {todayData.total === 0 && (
          <div className="text-center text-sm text-gray-500 py-2">Start tracking your water intake today! 💧</div>
        )}
      </CardContent>
    </Card>
  )
}
