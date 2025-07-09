"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageSquare } from "lucide-react"
import { QUICK_ADD_AMOUNTS, UNITS } from "@/types/water"
import { AnimatedButton } from "./AnimatedButton"

interface QuickAddButtonsProps {
  onAddWater: (amount: number, unit: string, message?: string) => void
}

export function QuickAddButtons({ onAddWater }: QuickAddButtonsProps) {
  const [selectedQuickAdd, setSelectedQuickAdd] = useState<{ amount: number; unit: string; label: string } | null>(null)
  const [quickMessage, setQuickMessage] = useState("")

  const handleQuickAdd = (amount: number, unit: string, message?: string) => {
    onAddWater(amount, unit, message)
    setSelectedQuickAdd(null)
    setQuickMessage("")
  }

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle>Quick Add</CardTitle>
        <CardDescription>Tap to quickly log common amounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ADD_AMOUNTS.map((item, index) => (
            <div key={index} className="space-y-2">
              <AnimatedButton
                variant="outline"
                className="h-16 w-full flex flex-col gap-1 bg-transparent hover:bg-blue-50 hover:border-blue-200 transition-all-smooth"
                onClick={() => handleQuickAdd(item.amount, item.unit)}
              >
                <span className="font-semibold">
                  {item.amount}
                  {UNITS[item.unit as keyof typeof UNITS].name}
                </span>
                <span className="text-xs text-gray-500">{item.label}</span>
              </AnimatedButton>

              <Dialog
                open={selectedQuickAdd?.amount === item.amount && selectedQuickAdd?.unit === item.unit}
                onOpenChange={(open) => {
                  if (open) {
                    setSelectedQuickAdd(item)
                  } else {
                    setSelectedQuickAdd(null)
                    setQuickMessage("")
                  }
                }}
              >
                <DialogTrigger asChild>
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    className="w-full h-6 text-xs hover:bg-blue-50 transition-all-smooth"
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Add Note
                  </AnimatedButton>
                </DialogTrigger>
                <DialogContent className="dropdown-enter">
                  <DialogHeader>
                    <DialogTitle>
                      Add {item.amount}
                      {UNITS[item.unit as keyof typeof UNITS].name} with Note
                    </DialogTitle>
                    <DialogDescription>Add a custom message with your water intake</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="quick-message">Message (Optional)</Label>
                      <Input
                        id="quick-message"
                        placeholder="e.g., 'After workout', 'Morning hydration'"
                        value={quickMessage}
                        onChange={(e) => setQuickMessage(e.target.value)}
                        maxLength={100}
                        className="transition-all-smooth focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleQuickAdd(item.amount, item.unit, quickMessage.trim() || undefined)
                          }
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <AnimatedButton
                        onClick={() => handleQuickAdd(item.amount, item.unit, quickMessage.trim() || undefined)}
                        className="flex-1"
                      >
                        Add Water
                      </AnimatedButton>
                      <AnimatedButton
                        variant="outline"
                        onClick={() => {
                          setSelectedQuickAdd(null)
                          setQuickMessage("")
                        }}
                      >
                        Cancel
                      </AnimatedButton>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
