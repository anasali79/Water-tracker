"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings } from "lucide-react"
import type { DayData } from "@/types/water"

interface SettingsPanelProps {
  dailyGoal: number
  setDailyGoal: (goal: number) => void
  waterData: DayData[]
  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
  reminderInterval: number
  setReminderInterval: (interval: number) => void
  onRequestNotificationPermission: () => Promise<boolean>
  onSendTestNotification: (todayData: DayData) => void
  todayData: DayData
}

export function SettingsPanel({
  dailyGoal,
  setDailyGoal,
  waterData,
  notificationsEnabled,
  setNotificationsEnabled,
  reminderInterval,
  setReminderInterval,
  onRequestNotificationPermission,
  onSendTestNotification,
  todayData,
}: SettingsPanelProps) {
  const [goalInput, setGoalInput] = useState(dailyGoal.toString())

  const handleGoalChange = (value: string) => {
    setGoalInput(value)

    
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue >= 500 && numValue <= 5000) {
      setDailyGoal(numValue)
    }
  }

  const handleGoalBlur = () => {
    const numValue = Number.parseInt(goalInput)
    if (isNaN(numValue) || numValue < 500 || numValue > 5000) {
      
      setGoalInput(dailyGoal.toString())
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="daily-goal">Daily Goal (ml)</Label>
          <Input
            id="daily-goal"
            type="number"
            value={goalInput}
            onChange={(e) => handleGoalChange(e.target.value)}
            onBlur={handleGoalBlur}
            min="500"
            max="5000"
            step="100"
            className="w-full"
            placeholder="Enter daily goal in ml"
          />
          <p className="text-sm text-gray-600">Recommended: 2000ml (2L) per day</p>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold">Notification Reminders</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Reminders</Label>
                <p className="text-sm text-gray-600">Get notified to drink water regularly</p>
              </div>
              <Button
                variant={notificationsEnabled ? "default" : "outline"}
                size="sm"
                onClick={async () => {
                  if (!notificationsEnabled) {
                    if ("Notification" in window) {
                      const permission = await Notification.requestPermission()
                      if (permission === "granted") {
                        setNotificationsEnabled(true)
                        alert("Notifications enabled! You'll get reminders based on your selected interval.")
                      } else {
                        alert("Please allow notifications in your browser settings to enable reminders.")
                      }
                    } else {
                      alert("Your browser doesn't support notifications.")
                    }
                  } else {
                    setNotificationsEnabled(false)
                    localStorage.setItem("waterTrackerNotifications", "false")
                  }
                }}
              >
                {notificationsEnabled ? "Enabled ✓" : "Enable"}
              </Button>
            </div>

            {notificationsEnabled && (
              <div className="space-y-2">
                <Label htmlFor="reminder-interval">Reminder Interval</Label>
                <Select
                  value={reminderInterval.toString()}
                  onValueChange={(value) => {
                    const interval = Number.parseInt(value)
                    setReminderInterval(interval)
                    localStorage.setItem("waterTrackerReminderInterval", interval.toString())
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSendTestNotification(todayData)}
                  className="w-full mt-2 bg-transparent"
                >
                  🔔 Test Notification
                </Button>

                <div className="text-xs text-gray-500 mt-2">Next reminder: Every {reminderInterval} minutes</div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent">
                Export Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Your Data</DialogTitle>
                <DialogDescription>Copy the data below to save your water intake history:</DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <textarea
                  className="w-full h-40 p-2 border rounded text-xs"
                  readOnly
                  value={JSON.stringify(waterData, null, 2)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
