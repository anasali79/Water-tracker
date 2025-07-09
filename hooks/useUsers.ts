"use client"

import { useState, useEffect } from "react"
import type { User } from "@/types/water"

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [isUserLoading, setIsUserLoading] = useState(true)


  useEffect(() => {
    setIsUserLoading(true)

   
    const allKeys = Object.keys(localStorage)
    const oldKeys = allKeys.filter(
      (key) =>
        key.startsWith("waterTrackerData") ||
        key.startsWith("waterData_") ||
        key.startsWith("water_user_") ||
        key.startsWith("water_") ||
        key.includes("waterTracker"),
    )

    console.log("🗑️ Clearing old keys:", oldKeys)
    oldKeys.forEach((key) => localStorage.removeItem(key))


    const savedUsers = localStorage.getItem("waterapp_users")
    const savedCurrentUser = localStorage.getItem("waterapp_current")

    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers).map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
        }))
        setUsers(parsedUsers)

        if (savedCurrentUser && parsedUsers.find((u: User) => u.id === savedCurrentUser)) {
          setCurrentUserId(savedCurrentUser)
        } else if (parsedUsers.length > 0) {
          setCurrentUserId(parsedUsers[0].id)
        }
      } catch (error) {
        console.error("Error loading users:", error)
        createDefaultUser()
      }
    } else {
      createDefaultUser()
    }

    setIsUserLoading(false)
  }, [])


  useEffect(() => {
    if (users.length > 0 && !isUserLoading) {
      localStorage.setItem("waterapp_users", JSON.stringify(users))
    }
  }, [users, isUserLoading])


  useEffect(() => {
    if (currentUserId && !isUserLoading) {
      localStorage.setItem("waterapp_current", currentUserId)
    }
  }, [currentUserId, isUserLoading])

  const createDefaultUser = () => {
    const defaultUser: User = {
      id: `user_${Date.now()}_default`,
      name: "Me",
      dailyGoal: 2000,
      createdAt: new Date(),
    }
    setUsers([defaultUser])
    setCurrentUserId(defaultUser.id)

    
    localStorage.setItem(`waterapp_${defaultUser.id}`, JSON.stringify([]))
    console.log(`👤 Created default user: ${defaultUser.id}`)
  }

  const addUser = (name: string, dailyGoal = 2000) => {
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      dailyGoal,
      createdAt: new Date(),
    }
    setUsers((prev) => [...prev, newUser])

   
    localStorage.setItem(`waterapp_${newUser.id}`, JSON.stringify([]))
    console.log(`👤 Created user: ${name} (${newUser.id})`)

    return newUser.id
  }

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, ...updates } : user)))
  }

  const deleteUser = (userId: string) => {
    if (users.length <= 1) return

    const remainingUsers = users.filter((user) => user.id !== userId)
    setUsers(remainingUsers)

  
    localStorage.removeItem(`waterapp_${userId}`)
    console.log(`🗑️ Deleted user: ${userId}`)

   
    if (currentUserId === userId) {
      const newCurrentUser = remainingUsers[0]
      if (newCurrentUser) {
        console.log(`🔄 Auto-switching to: ${newCurrentUser.id}`)
        setCurrentUserId(newCurrentUser.id)
      }
    }
  }

  const getCurrentUser = (): User | undefined => {
    return users.find((user) => user.id === currentUserId)
  }

  const switchUser = (userId: string) => {
    if (userId !== currentUserId) {
      console.log(`🔄 Manual switch: ${currentUserId} → ${userId}`)
      setCurrentUserId(userId)
    }
  }

  return {
    users,
    currentUserId,
    getCurrentUser,
    addUser,
    updateUser,
    deleteUser,
    switchUser,
    isUserLoading,
  }
}
