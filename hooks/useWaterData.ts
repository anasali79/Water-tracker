"use client"

import { useState, useEffect, useCallback } from "react"
import type { DayData, WaterEntry } from "@/types/water"
import { convertToMl, getTodayString } from "@/utils/waterUtils"

export const useWaterData = (dailyGoal: number, userId: string) => {
  const [waterData, setWaterData] = useState<DayData[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [lastLoadedUserId, setLastLoadedUserId] = useState<string>("")


  useEffect(() => {
    if (!userId) {
      setWaterData([])
      setCurrentStreak(0)
      setIsLoading(false)
      setLastLoadedUserId("")
      return
    }

    if (lastLoadedUserId !== userId) {
      console.log(`🔄 User changed: ${lastLoadedUserId} → ${userId}`)

     
      setWaterData([])
      setCurrentStreak(0)
      setIsLoading(true)

 
      const storageKey = `waterapp_${userId}`
      console.log(`📂 Loading from: ${storageKey}`)

      try {
        const savedData = localStorage.getItem(storageKey)

        if (savedData && savedData !== "[]") {
          const parsed = JSON.parse(savedData)
          const processedData = parsed.map((day: any) => ({
            ...day,
            entries: day.entries.map((entry: any) => ({
              ...entry,
              timestamp: new Date(entry.timestamp),
            })),
          }))
          console.log(`✅ Loaded ${processedData.length} days for ${userId}`)
          setWaterData(processedData)
        } else {
          console.log(`❌ No data for ${userId}`)
          setWaterData([])
        }
      } catch (error) {
        console.error(`💥 Error loading ${userId}:`, error)
        setWaterData([])
      }

      setLastLoadedUserId(userId)
      setIsLoading(false)
    }
  }, [userId, lastLoadedUserId])

 
  useEffect(() => {
    if (!isLoading && userId && lastLoadedUserId === userId && waterData !== undefined) {
      const storageKey = `waterapp_${userId}`
      console.log(`💾 Saving ${waterData.length} days for ${userId}`)
      localStorage.setItem(storageKey, JSON.stringify(waterData))
    }
  }, [waterData, userId, isLoading, lastLoadedUserId])


  useEffect(() => {
    if (isLoading || !userId || lastLoadedUserId !== userId) {
      setCurrentStreak(0)
      return
    }

    let streak = 0
    const today = new Date()

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateString = checkDate.toISOString().split("T")[0]

      const dayData = waterData.find((day) => day.date === dateString)

      if (dayData && dayData.total >= dayData.goal) {
        streak++
      } else if (i === 0) {
        streak = 0
        break
      } else {
        break
      }
    }

    setCurrentStreak(streak)
  }, [waterData, isLoading, userId, lastLoadedUserId])

 
  const getTodayData = useCallback((): DayData => {
    const today = getTodayString()

    if (!userId || lastLoadedUserId !== userId) {
      return {
        date: today,
        total: 0,
        goal: dailyGoal,
        entries: [],
      }
    }

    const existingDay = waterData.find((day) => day.date === today)

    if (existingDay) {
      return {
        ...existingDay,
        goal: dailyGoal, 
      }
    }

    return {
      date: today,
      total: 0,
      goal: dailyGoal,
      entries: [],
    }
  }, [userId, dailyGoal, waterData, lastLoadedUserId])


  const addWater = useCallback(
    (amount: number, unit: string, message?: string) => {
      
      if (!userId || isLoading || lastLoadedUserId !== userId) {
        console.log(`❌ Cannot add water: userId=${userId}, loading=${isLoading}, lastLoaded=${lastLoadedUserId}`)
        return
      }

      const mlAmount = convertToMl(amount, unit)
      const today = getTodayString()

      const newEntry: WaterEntry = {
        id: `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount,
        unit,
        timestamp: new Date(),
        date: today,
        message,
      }

      console.log(`💧 Adding ${amount}${unit} (${mlAmount}ml) for user ${userId}`)

      setWaterData((prevData) => {
        
        if (lastLoadedUserId !== userId) {
          console.log("❌ User changed during add operation")
          return prevData
        }

        const existingDayIndex = prevData.findIndex((day) => day.date === today)

        if (existingDayIndex >= 0) {
         
          const updatedData = [...prevData]
          const updatedDay = {
            ...updatedData[existingDayIndex],
            total: updatedData[existingDayIndex].total + mlAmount,
            goal: dailyGoal,
            entries: [...updatedData[existingDayIndex].entries, newEntry],
          }
          updatedData[existingDayIndex] = updatedDay
          console.log(`📊 Updated day total: ${updatedDay.total}ml`)
          return updatedData
        } else {
      
          const newDay = {
            date: today,
            total: mlAmount,
            goal: dailyGoal,
            entries: [newEntry],
          }
          console.log(`📊 Created new day with: ${newDay.total}ml`)
          return [...prevData, newDay]
        }
      })
    },
    [userId, isLoading, dailyGoal, lastLoadedUserId],
  )

 
  const getRecentDays = useCallback(() => {
    if (isLoading || !userId || lastLoadedUserId !== userId) return []

    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]
      const dayData = waterData.find((day) => day.date === dateString)

      days.push({
        date: dateString,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        total: dayData?.total || 0,
        goal: dailyGoal,
        percentage: dayData ? Math.min((dayData.total / dailyGoal) * 100, 100) : 0,
      })
    }
    return days
  }, [waterData, isLoading, userId, dailyGoal, lastLoadedUserId])

  return {
    waterData,
    currentStreak,
    getTodayData,
    addWater,
    getRecentDays,
    isLoading,
  }
}
