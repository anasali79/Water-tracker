export interface WaterEntry {
  id: string
  amount: number
  unit: string
  timestamp: Date
  date: string
  message?: string 
}

export interface DayData {
  date: string
  total: number
  goal: number
  entries: WaterEntry[]
}

export interface User {
  id: string
  name: string
  dailyGoal: number
  createdAt: Date
}

export const UNITS = {
  ml: { name: "ml", factor: 1 },
  l: { name: "L", factor: 1000 },
  cups: { name: "cups", factor: 240 },
  oz: { name: "fl oz", factor: 29.5735 },
}

export const QUICK_ADD_AMOUNTS = [
  { amount: 250, unit: "ml", label: "Glass" },
  { amount: 500, unit: "ml", label: "Bottle" },
  { amount: 1, unit: "l", label: "Large Bottle" },
  { amount: 1, unit: "cups", label: "Cup" },
]
