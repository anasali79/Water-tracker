"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Droplets } from "lucide-react"
import { useWaterData } from "@/hooks/useWaterData"
import { useNotifications } from "@/hooks/useNotifications"
import { useUsers } from "@/hooks/useUsers"
import { useToast } from "@/hooks/useToast"
import { UserSelector } from "@/components/UserSelector"
import { ProgressCard } from "@/components/ProgressCard"
import { QuickAddButtons } from "@/components/QuickAddButtons"
import { CustomAddForm } from "@/components/CustomAddForm"
import { TodayEntries } from "@/components/TodayEntries"
import { HistoryView } from "@/components/HistoryView"
import { StatisticsCard } from "@/components/StatisticsCard"
import { SettingsPanel } from "@/components/SettingsPanel"
import { WaterDropAnimation } from "@/components/WaterDropAnimation"
import { Toast } from "@/components/Toast"

export default function WaterTracker() {
  const [showWaterDrop, setShowWaterDrop] = useState(false)

  const { users, currentUserId, getCurrentUser, addUser, updateUser, deleteUser, switchUser, isUserLoading } =
    useUsers()
  const { toasts, showToast, removeToast } = useToast()

  const currentUser = getCurrentUser()
  const dailyGoal = currentUser?.dailyGoal || 2000

  const {
    waterData,
    currentStreak,
    getTodayData,
    addWater: originalAddWater,
    getRecentDays,
    isLoading: isDataLoading,
  } = useWaterData(dailyGoal, currentUserId)

  const {
    notificationsEnabled,
    setNotificationsEnabled,
    reminderInterval,
    setReminderInterval,
    lastNotification,
    requestNotificationPermission,
    sendNotification,
    sendTestNotification,
    updateNotificationSettings,
  } = useNotifications(currentUserId)

  const todayData = getTodayData()
  const recentDays = getRecentDays()

  const addWater = (amount: number, unit: string, message?: string) => {
    console.log(`🎯 UI: Adding water ${amount}${unit} for ${currentUser?.name}`)
    originalAddWater(amount, unit, message)
    setShowWaterDrop(true)

    const unitName = unit === "ml" ? "ml" : unit === "l" ? "L" : unit === "cups" ? "cups" : "fl oz"
    const toastMessage = message ? `Added ${amount}${unitName} - "${message}" 💧` : `Added ${amount}${unitName} 💧`

    showToast(toastMessage, "success", 2000)
  }

  
  const setDailyGoal = (goal: number) => {
    if (currentUser) {
      updateUser(currentUser.id, { dailyGoal: goal })
      showToast(`Daily goal updated to ${goal}ml! 🎯`, "info")
    }
  }

  
  if (!currentUser || isUserLoading || isDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <Droplets className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse-gentle" />
          <p className="text-gray-600">
            {isUserLoading ? "Loading users..." : `Loading ${currentUser?.name || "user"} data...`}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
      
        <div className="text-center space-y-2 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2">
            <Droplets className="h-8 w-8 text-blue-500 animate-pulse-gentle" />
            <h1 className="text-3xl font-bold text-gray-900">Water Intake Tracker</h1>
          </div>
          <p className="text-gray-600">Stay hydrated, stay healthy!</p>
          {currentUser && <p className="text-sm text-blue-600 font-medium">Welcome back, {currentUser.name}! 👋</p>}
        </div>

       
        <div className="animate-fade-in-up">
          <UserSelector
            users={users}
            currentUserId={currentUserId}
            onSwitchUser={(userId) => {
              const user = users.find((u) => u.id === userId)
              switchUser(userId)
              showToast(`Switched to ${user?.name}! 👤`, "info")
            }}
            onAddUser={(name, goal) => {
              const userId = addUser(name, goal)
              showToast(`Added new user: ${name}! 🎉`, "success")
              return userId
            }}
            onDeleteUser={(userId) => {
              const userName = users.find((u) => u.id === userId)?.name
              deleteUser(userId)
              showToast(`Deleted user: ${userName} 🗑️`, "info")
            }}
          />
        </div>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3 transition-all-smooth">
            <TabsTrigger value="today" className="transition-all-smooth hover:bg-blue-50">
              Today
            </TabsTrigger>
            <TabsTrigger value="history" className="transition-all-smooth hover:bg-blue-50">
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="transition-all-smooth hover:bg-blue-50">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <ProgressCard
              todayData={todayData}
              currentStreak={currentStreak}
              isLoading={isDataLoading}
              userName={currentUser.name}
            />
            <QuickAddButtons onAddWater={addWater} />
            <CustomAddForm onAddWater={addWater} />
            <TodayEntries entries={todayData.entries} userName={currentUser.name} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <HistoryView recentDays={recentDays} />
            <StatisticsCard waterData={waterData} currentStreak={currentStreak} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsPanel
              dailyGoal={dailyGoal}
              setDailyGoal={setDailyGoal}
              waterData={waterData}
              notificationsEnabled={notificationsEnabled}
              setNotificationsEnabled={(enabled) => {
                updateNotificationSettings(enabled)
                showToast(enabled ? "Notifications enabled! 🔔" : "Notifications disabled 🔕", "info")
              }}
              reminderInterval={reminderInterval}
              setReminderInterval={(interval) => {
                updateNotificationSettings(notificationsEnabled, interval)
                showToast(`Reminder interval set to ${interval} minutes ⏰`, "info")
              }}
              onRequestNotificationPermission={requestNotificationPermission}
              onSendTestNotification={sendTestNotification}
              todayData={todayData}
            />
          </TabsContent>
        </Tabs>

       
        <WaterDropAnimation trigger={showWaterDrop} onComplete={() => setShowWaterDrop(false)} />

        
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  )
}
