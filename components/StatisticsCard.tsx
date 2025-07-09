import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import type { DayData } from "@/types/water"
import { formatAmount } from "@/utils/waterUtils"

interface StatisticsCardProps {
  waterData: DayData[]
  currentStreak: number
}

export function StatisticsCard({ waterData, currentStreak }: StatisticsCardProps) {
  const goalsMetCount = waterData.filter((day) => day.total >= day.goal).length
  const dailyAverage =
    waterData.length > 0 ? Math.round(waterData.reduce((sum, day) => sum + day.total, 0) / waterData.length) : 0
  const totalLogged = waterData.reduce((sum, day) => sum + day.total, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{currentStreak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{goalsMetCount}</div>
            <div className="text-sm text-gray-600">Goals Met</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">{dailyAverage}ml</div>
            <div className="text-sm text-gray-600">Daily Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{formatAmount(totalLogged)}</div>
            <div className="text-sm text-gray-600">Total Logged</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
