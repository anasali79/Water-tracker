"use client"

import { useState } from "react"
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
import { Users, Plus, Trash2 } from "lucide-react"
import type { User } from "@/types/water"

interface UserSelectorProps {
  users: User[]
  currentUserId: string
  onSwitchUser: (userId: string) => void
  onAddUser: (name: string, dailyGoal: number) => string
  onDeleteUser: (userId: string) => void
}

export function UserSelector({ users, currentUserId, onSwitchUser, onAddUser, onDeleteUser }: UserSelectorProps) {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUserName, setNewUserName] = useState("")
  const [newUserGoal, setNewUserGoal] = useState("2000")

  const currentUser = users.find((user) => user.id === currentUserId)

  const handleAddUser = () => {
    if (newUserName.trim()) {
      const userId = onAddUser(newUserName.trim(), Number.parseInt(newUserGoal) || 2000)
      onSwitchUser(userId)
      setNewUserName("")
      setNewUserGoal("2000")
      setIsAddUserOpen(false)
    }
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
      <Users className="h-5 w-5 text-blue-500" />

      <div className="flex-1">
        <Label className="text-sm text-gray-600">Current User</Label>
        <Select value={currentUserId} onValueChange={onSwitchUser}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name} ({user.dailyGoal}ml goal)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user profile for tracking water intake.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="user-name">Name</Label>
              <Input
                id="user-name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter user name"
              />
            </div>
            <div>
              <Label htmlFor="user-goal">Daily Goal (ml)</Label>
              <Input
                id="user-goal"
                type="number"
                value={newUserGoal}
                onChange={(e) => setNewUserGoal(e.target.value)}
                placeholder="2000"
                min="500"
                max="5000"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddUser} className="flex-1">
                Add User
              </Button>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {users.length > 1 && currentUser && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (
              confirm(`Are you sure you want to delete user "${currentUser.name}"? This will delete all their data.`)
            ) {
              onDeleteUser(currentUserId)
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
