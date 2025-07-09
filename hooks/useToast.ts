"use client"

import { useState } from "react"

interface ToastData {
  id: string
  message: string
  type: "success" | "error" | "info"
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = (message: string, type: "success" | "error" | "info" = "success", duration = 3000) => {
    const id = Date.now().toString()
    const newToast: ToastData = { id, message, type, duration }

    setToasts((prev) => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return {
    toasts,
    showToast,
    removeToast,
  }
}
