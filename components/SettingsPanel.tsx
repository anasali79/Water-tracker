"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, Vibrate, Bell, Eye, Clock } from "lucide-react"
import type { DayData } from "@/types/water"

interface SettingsPanelProps {
  dailyGoal: number
  setDailyGoal: (goal: number) => void
  waterData: DayData[]
  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
  reminderInterval: number
  setReminderInterval: (interval: number) => void
  visualAlertsEnabled?: boolean
  setVisualAlertsEnabled?: (enabled: boolean) => void
  vibrationEnabled?: boolean
  setVibrationEnabled?: (enabled: boolean) => void
  deviceIsMobile?: boolean
  deviceSupportsVibration?: boolean
  notificationSupport?: { supported: boolean; reason: string }
  nextReminderTime?: Date | null
  onRequestNotificationPermission: () => Promise<boolean>
  onSendTestNotification: (todayData: DayData) => void
  onUpdateNotificationSettings: (
    enabled: boolean,
    interval?: number,
    visualAlerts?: boolean,
    vibration?: boolean,
  ) => void
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
  visualAlertsEnabled = true,
  setVisualAlertsEnabled,
  vibrationEnabled = true,
  setVibrationEnabled,
  deviceIsMobile = false,
  deviceSupportsVibration = false,
  notificationSupport = { supported: true, reason: "Supported" },
  nextReminderTime,
  onRequestNotificationPermission,
  onSendTestNotification,
  onUpdateNotificationSettings,
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

  const formatNextReminderTime = (time: Date | null) => {
    if (!time) return "Not scheduled"
    const now = new Date()
    const diff = time.getTime() - now.getTime()
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes <= 0) return "Due now"
    if (minutes < 60) return `In ${minutes} minutes`

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `In ${hours}h ${remainingMinutes}m`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
      
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
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h3 className="font-semibold">Notification Reminders</h3>
          </div>

          
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Reminders</Label>
              <p className="text-sm text-gray-600">Get reminded to drink water regularly</p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={async (enabled) => {
                if (enabled && notificationSupport.supported) {
                  const permission = await onRequestNotificationPermission()
                  if (permission) {
                    onUpdateNotificationSettings(true)
                    setNotificationsEnabled(true)
                  } else {
                  
                    onUpdateNotificationSettings(true)
                    setNotificationsEnabled(true)
                  }
                } else {
                  onUpdateNotificationSettings(enabled)
                  setNotificationsEnabled(enabled)
                }
              }}
            />
          </div>

          {notificationsEnabled && (
            <div className="space-y-4 pl-4 border-l-2 border-blue-200">
          
              <div className="space-y-2">
                <Label htmlFor="reminder-interval">Reminder Interval</Label>
                <Select
                  value={reminderInterval.toString()}
                  onValueChange={(value) => {
                    const interval = Number.parseInt(value)
                    setReminderInterval(interval)
                    onUpdateNotificationSettings(notificationsEnabled, interval)
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

                {nextReminderTime && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>Next reminder: {formatNextReminderTime(nextReminderTime)}</span>
                  </div>
                )}
              </div>

              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <div>
                    <Label className="text-sm">Visual Alerts</Label>
                    <p className="text-xs text-gray-600">
                      Show popup reminders {deviceIsMobile ? "(Recommended for mobile)" : ""}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={visualAlertsEnabled}
                  onCheckedChange={(enabled) => {
                    setVisualAlertsEnabled?.(enabled)
                    onUpdateNotificationSettings(notificationsEnabled, reminderInterval, enabled)
                  }}
                />
              </div>

           
              {deviceSupportsVibration && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Vibrate className="h-4 w-4" />
                    <div>
                      <Label className="text-sm">Vibration</Label>
                      <p className="text-xs text-gray-600">Vibrate device for reminders</p>
                    </div>
                  </div>
                  <Switch
                    checked={vibrationEnabled}
                    onCheckedChange={(enabled) => {
                      setVibrationEnabled?.(enabled)
                      onUpdateNotificationSettings(notificationsEnabled, reminderInterval, visualAlertsEnabled, enabled)
                    }}
                  />
                </div>
              )}

             
              <Button variant="outline" size="sm" onClick={() => onSendTestNotification(todayData)} className="w-full">
                🔔 Test All Notifications
              </Button>

           
              {deviceIsMobile && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 mb-1">📱 Mobile Tips:</div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Keep this tab open for best results</li>
                    <li>• Add to home screen for PWA experience</li>
                    <li>• Visual alerts work even if browser notifications don't</li>
                    {deviceSupportsVibration && <li>• Vibration works in most mobile browsers</li>}
                  </ul>
                </div>
              )}
            </div>
          )}
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
