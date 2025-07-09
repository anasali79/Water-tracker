"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, MessageSquare } from "lucide-react"
import { UNITS } from "@/types/water"
import { AnimatedButton } from "./AnimatedButton"

interface CustomAddFormProps {
  onAddWater: (amount: number, unit: string, message?: string) => void
}

export function CustomAddForm({ onAddWater }: CustomAddFormProps) {
  const [customAmount, setCustomAmount] = useState("")
  const [customUnit, setCustomUnit] = useState("ml")
  const [customMessage, setCustomMessage] = useState("")
  const [showMessageInput, setShowMessageInput] = useState(false)

  const handleCustomAdd = () => {
    const amount = Number.parseFloat(customAmount)
    if (amount > 0) {
      onAddWater(amount, customUnit, customMessage.trim() || undefined)
      setCustomAmount("")
      setCustomMessage("")
      setShowMessageInput(false)
    }
  }

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle>Add Custom Amount</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !showMessageInput && handleCustomAdd()}
              className="transition-all-smooth focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Select value={customUnit} onValueChange={setCustomUnit}>
            <SelectTrigger className="w-24 transition-all-smooth">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dropdown-enter">
              {Object.entries(UNITS).map(([key, unit]) => (
                <SelectItem key={key} value={key} className="hover:bg-blue-50 transition-colors">
                  {unit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AnimatedButton
            variant="outline"
            size="icon"
            onClick={() => setShowMessageInput(!showMessageInput)}
            className={`transition-all-smooth ${showMessageInput ? "bg-blue-50 border-blue-200" : ""}`}
          >
            <MessageSquare className="h-4 w-4" />
          </AnimatedButton>
          <AnimatedButton
            onClick={handleCustomAdd}
            disabled={!customAmount || Number.parseFloat(customAmount) <= 0}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </AnimatedButton>
        </div>

        {showMessageInput && (
          <div className="space-y-2 animate-fade-in-up">
            <Label htmlFor="custom-message">Custom Message (Optional)</Label>
            <Textarea
              id="custom-message"
              placeholder="Add a note about this intake... (e.g., 'After workout', 'Morning hydration', 'Feeling thirsty')"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleCustomAdd()
                }
              }}
              className="min-h-[80px] resize-none transition-all-smooth focus:ring-2 focus:ring-blue-500"
              maxLength={100}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Press Enter to add, Shift+Enter for new line</span>
              <span>{customMessage.length}/100</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
