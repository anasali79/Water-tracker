"use client"

import { useState, useEffect } from "react"
import type { DayData } from "@/types/water"
import { formatAmount } from "@/utils/waterUtils"

export const useNotifications = (userId: string) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [reminderInterval, setReminderInterval] = useState(60) 
  const [lastNotification, setLastNotification] = useState<Date | null>(null)

 
  useEffect(() => {
    if (!userId) return

    const savedNotifications = localStorage.getItem(`waterTrackerNotifications_${userId}`)
    const savedInterval = localStorage.getItem(`waterTrackerReminderInterval_${userId}`)
    const savedLastNotification = localStorage.getItem(`waterTrackerLastNotification_${userId}`)

    if (savedNotifications === "true") {
      setNotificationsEnabled(true)
    }

    if (savedInterval) {
      setReminderInterval(Number.parseInt(savedInterval))
    }

    if (savedLastNotification) {
      setLastNotification(new Date(savedLastNotification))
    }
  }, [userId])

  
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }
    return false
  }

 
  const sendNotification = (todayData: DayData) => {
    if (!notificationsEnabled || !("Notification" in window) || Notification.permission !== "granted") {
      return
    }

    const remaining = todayData.goal - todayData.total

    if (remaining > 0) {
      new Notification("💧 Hydration Reminder", {
        body: `Time to drink some water! You still need ${formatAmount(remaining)} to reach your daily goal.`,
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' fontSize='90'>💧</text></svg>",
        tag: "water-reminder",
        requireInteraction: false,
      })
      setLastNotification(new Date())
      localStorage.setItem(`waterTrackerLastNotification_${userId}`, new Date().toISOString())
    }
  }

 
  const sendTestNotification = (todayData: DayData) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const remaining = todayData.goal - todayData.total

      new Notification("💧 Test Notification", {
        body:
          remaining > 0
            ? `This is a test! You need ${formatAmount(remaining)} more water today.`
            : "Great job! You've reached your daily goal! 🎉",
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' fontSize='90'>💧</text></svg>",
        tag: "water-test",
      })
      alert("Test notification sent! Check your browser notifications.")
    } else {
      alert("Notifications not enabled or permission not granted.")
    }
  }

  
  const updateNotificationSettings = (enabled: boolean, interval?: number) => {
    setNotificationsEnabled(enabled)
    localStorage.setItem(`waterTrackerNotifications_${userId}`, enabled.toString())

    if (interval !== undefined) {
      setReminderInterval(interval)
      localStorage.setItem(`waterTrackerReminderInterval_${userId}`, interval.toString())
    }
  }

  return {
    notificationsEnabled,
    setNotificationsEnabled,
    reminderInterval,
    setReminderInterval,
    lastNotification,
    requestNotificationPermission,
    sendNotification,
    sendTestNotification,
    updateNotificationSettings,
  }
}
