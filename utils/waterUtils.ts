import { UNITS } from "@/types/water"

export const convertToMl = (amount: number, unit: string): number => {
  return Math.round(amount * UNITS[unit as keyof typeof UNITS].factor)
}

export const formatAmount = (ml: number): string => {
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(1)}L`
  }
  return `${ml}ml`
}

export const getTodayString = () => new Date().toISOString().split("T")[0]
