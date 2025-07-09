import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "lucide-react"
import { formatAmount } from "@/utils/waterUtils"

interface HistoryViewProps {
  recentDays: Array<{
    date: string
    dayName: string
    total: number
    goal: number
    percentage: number
  }>
}

export function HistoryView({ recentDays }: HistoryViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Last 7 Days
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentDays.map((day) => (
            <div key={day.date} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="font-medium w-12">{day.dayName}</span>
                <div className="flex-1 min-w-0">
                  <Progress value={day.percentage} className="h-2" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{formatAmount(day.total)}</span>
                {day.total >= day.goal && <span className="text-green-500">✓</span>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
