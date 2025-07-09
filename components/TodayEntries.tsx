import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import { type WaterEntry, UNITS } from "@/types/water"

interface TodayEntriesProps {
  entries: WaterEntry[]
  userName?: string
}

export function TodayEntries({ entries, userName }: TodayEntriesProps) {
  if (entries.length === 0) {
    return (
      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle>Today's Entries {userName && `- ${userName}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">💧</div>
            <p>No water intake recorded today</p>
            <p className="text-sm">Start by adding your first drink!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle>Today's Entries {userName && `- ${userName}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries
            .slice()
            .reverse()
            .map((entry) => (
              <div key={entry.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {entry.amount}
                    {UNITS[entry.unit as keyof typeof UNITS].name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {entry.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {entry.message && (
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 italic">"{entry.message}"</span>
                  </div>
                )}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
