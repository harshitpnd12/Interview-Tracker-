import { axiosInstance } from "./axios.config"
import type { Notification } from "../types"

export const notificationsApi = {
  getAllNotifications: async () => {
    const response = await axiosInstance.get<Notification[]>("/notifications")
    return response.data
  },

  markAsRead: async (id: string) => {
    const response = await axiosInstance.patch<Notification>(`/notifications/${id}/read`)
    return response.data
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.patch(`/notifications/read-all`)
    return response.data
  },

  deleteNotification: async (id: string) => {
    const response = await axiosInstance.delete(`/notifications/${id}`)
    return response.data
  },

  getUnreadCount: async () => {
    const response = await axiosInstance.get<{ count: number }>("/notifications/unread-count")
    return response.data
  },

  updateNotificationSettings: async (data: any) => {
    const response = await axiosInstance.put("/notifications/settings", data)
    return response.data
  }
}
