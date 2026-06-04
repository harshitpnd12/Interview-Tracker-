import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notificationsApi } from "../api/notifications.api"
import { demoNotifications } from "../lib/demo-data"
import type { Notification } from "../types"
import { toast } from "sonner"

const getLocalNotifs = (): Notification[] => {
  const data = localStorage.getItem("iq_notifications")
  if (!data) {
    localStorage.setItem("iq_notifications", JSON.stringify(demoNotifications))
    return demoNotifications
  }
  try {
    return JSON.parse(data)
  } catch {
    return demoNotifications
  }
}

const saveLocalNotifs = (notifs: Notification[]) => {
  localStorage.setItem("iq_notifications", JSON.stringify(notifs))
}

export const useNotifications = () => {
  const queryClient = useQueryClient()

  // 1. Fetch all notifications
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        return await notificationsApi.getAllNotifications()
      } catch (err) {
        return getLocalNotifs()
      }
    },
    placeholderData: getLocalNotifs,
  })

  // 2. Fetch unread count
  const unreadCountQuery = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      try {
        const res = await notificationsApi.getUnreadCount()
        return res.count
      } catch (err) {
        const notifs = getLocalNotifs()
        return notifs.filter((n) => !n.isRead).length
      }
    },
    refetchInterval: 60000, // Refetch every 60s
    placeholderData: () => getLocalNotifs().filter((n) => !n.isRead).length,
  })

  // 3. Mark as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        return await notificationsApi.markAsRead(id)
      } catch (err) {
        const notifs = getLocalNotifs()
        const index = notifs.findIndex((n) => n.id === id)
        if (index !== -1) {
          notifs[index].isRead = true
          saveLocalNotifs(notifs)
          return notifs[index]
        }
        throw new Error("Notification not found locally")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] })
    },
  })

  // 4. Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      try {
        await notificationsApi.markAllAsRead()
      } catch (err) {
        const notifs = getLocalNotifs()
        notifs.forEach((n) => (n.isRead = true))
        saveLocalNotifs(notifs)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] })
      toast.success("All notifications marked as read.")
    },
  })

  // 5. Delete notification
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await notificationsApi.deleteNotification(id)
        return id
      } catch (err) {
        const notifs = getLocalNotifs()
        const filtered = notifs.filter((n) => n.id !== id)
        saveLocalNotifs(filtered)
        return id
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] })
    },
  })

  return {
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    unreadCount: unreadCountQuery.data ?? 0,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteMutation.mutate,
  }
}
