"use client"

import { useState, useEffect, useRef } from "react"
import type { DayData } from "@/types/water"
import { formatAmount } from "@/utils/waterUtils"


const isMobile = () => {
  if (typeof window === "undefined") return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}


const supportsVibration = () => {
  return typeof navigator !== "undefined" && "vibrate" in navigator
}


const getNotificationSupport = () => {
  if (typeof window === "undefined") return { supported: false, reason: "Server side" }

  if (!("Notification" in window)) {
    return { supported: false, reason: "Browser doesn't support notifications" }
  }

  if (isMobile()) {
   
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)

    if (isIOS && isSafari) {
      return { supported: false, reason: "iOS Safari has limited notification support" }
    }
  }

  return { supported: true, reason: "Supported" }
}

export const useNotifications = (userId: string) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [reminderInterval, setReminderInterval] = useState(60) // minutes
  const [lastNotification, setLastNotification] = useState<Date | null>(null)
  const [visualAlertsEnabled, setVisualAlertsEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)
  const [showMobileAlert, setShowMobileAlert] = useState(false)
  const reminderIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [nextReminderTime, setNextReminderTime] = useState<Date | null>(null)

  const notificationSupport = getNotificationSupport()
  const deviceIsMobile = isMobile()
  const deviceSupportsVibration = supportsVibration()

 
  useEffect(() => {
    if (!userId) return

    const savedNotifications = localStorage.getItem(`waterTrackerNotifications_${userId}`)
    const savedInterval = localStorage.getItem(`waterTrackerReminderInterval_${userId}`)
    const savedVisualAlerts = localStorage.getItem(`waterTrackerVisualAlerts_${userId}`)
    const savedVibration = localStorage.getItem(`waterTrackerVibration_${userId}`)
    const savedLastNotification = localStorage.getItem(`waterTrackerLastNotification_${userId}`)

    if (savedNotifications === "true") {
      setNotificationsEnabled(true)
    }

    if (savedInterval) {
      setReminderInterval(Number.parseInt(savedInterval))
    }

    if (savedVisualAlerts !== null) {
      setVisualAlertsEnabled(savedVisualAlerts === "true")
    }

    if (savedVibration !== null) {
      setVibrationEnabled(savedVibration === "true")
    }

    if (savedLastNotification) {
      setLastNotification(new Date(savedLastNotification))
    }
  }, [userId])

  useEffect(() => {
    if (reminderIntervalRef.current) {
      clearInterval(reminderIntervalRef.current)
    }

    if (notificationsEnabled && reminderInterval > 0) {
      const intervalMs = reminderInterval * 60 * 1000

      
      const nextTime = new Date(Date.now() + intervalMs)
      setNextReminderTime(nextTime)

      reminderIntervalRef.current = setInterval(() => {
        
        setShowMobileAlert(true)

        
        const nextTime = new Date(Date.now() + intervalMs)
        setNextReminderTime(nextTime)
      }, intervalMs)
    } else {
      setNextReminderTime(null)
    }

    return () => {
      if (reminderIntervalRef.current) {
        clearInterval(reminderIntervalRef.current)
      }
    }
  }, [notificationsEnabled, reminderInterval])

  const requestNotificationPermission = async () => {
    if (!notificationSupport.supported) {
      return false
    }

    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }
    return false
  }


  const vibrateDevice = (pattern: number[] = [200, 100, 200]) => {
    if (deviceSupportsVibration && vibrationEnabled) {
      navigator.vibrate(pattern)
      return true
    }
    return false
  }


  const sendBrowserNotification = (todayData: DayData) => {
    if (!notificationSupport.supported || !("Notification" in window) || Notification.permission !== "granted") {
      return false
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
      return true
    }
    return false
  }

 
  const sendNotification = (todayData: DayData) => {
    let notificationSent = false

    if (sendBrowserNotification(todayData)) {
      notificationSent = true
    }

  
    if (vibrateDevice()) {
      notificationSent = true
    }

    
    if (deviceIsMobile || visualAlertsEnabled) {
      setShowMobileAlert(true)
      notificationSent = true
    }

    return notificationSent
  }


  const sendTestNotification = (todayData: DayData) => {
    const remaining = todayData.goal - todayData.total

    
    if (notificationSupport.supported && "Notification" in window && Notification.permission === "granted") {
      new Notification("💧 Test Notification", {
        body:
          remaining > 0
            ? `This is a test! You need ${formatAmount(remaining)} more water today.`
            : "Great job! You've reached your daily goal! 🎉",
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' fontSize='90'>💧</text></svg>",
        tag: "water-test",
      })
    }

 
    vibrateDevice([100, 50, 100, 50, 100])

    setShowMobileAlert(true)

   
    if (deviceIsMobile) {
      alert("Test notification sent! Check for vibration and visual alert.")
    } else {
      alert("Test notification sent! Check your browser notifications, vibration, and visual alert.")
    }
  }

 
  const updateNotificationSettings = (
    enabled: boolean,
    interval?: number,
    visualAlerts?: boolean,
    vibration?: boolean,
  ) => {
    setNotificationsEnabled(enabled)
    localStorage.setItem(`waterTrackerNotifications_${userId}`, enabled.toString())

    if (interval !== undefined) {
      setReminderInterval(interval)
      localStorage.setItem(`waterTrackerReminderInterval_${userId}`, interval.toString())
    }

    if (visualAlerts !== undefined) {
      setVisualAlertsEnabled(visualAlerts)
      localStorage.setItem(`waterTrackerVisualAlerts_${userId}`, visualAlerts.toString())
    }

    if (vibration !== undefined) {
      setVibrationEnabled(vibration)
      localStorage.setItem(`waterTrackerVibration_${userId}`, vibration.toString())
    }
  }

 
  const dismissMobileAlert = () => {
    setShowMobileAlert(false)
  }

  return {
    notificationsEnabled,
    setNotificationsEnabled,
    reminderInterval,
    setReminderInterval,
    visualAlertsEnabled,
    setVisualAlertsEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    lastNotification,
    nextReminderTime,
    showMobileAlert,
    deviceIsMobile,
    deviceSupportsVibration,
    notificationSupport,
    requestNotificationPermission,
    sendNotification,
    sendTestNotification,
    updateNotificationSettings,
    dismissMobileAlert,
    vibrateDevice,
  }
}
