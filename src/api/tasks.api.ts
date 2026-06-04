import { axiosInstance } from "./axios.config"
import type { Task } from "../types"

export const tasksApi = {
  getAllTasks: async (filter?: string) => {
    const response = await axiosInstance.get<Task[]>("/tasks", { params: { filter } })
    return response.data
  },

  createTask: async (data: Omit<Task, "id">) => {
    const response = await axiosInstance.post<Task>("/tasks", data)
    return response.data
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    const response = await axiosInstance.put<Task>(`/tasks/${id}`, data)
    return response.data
  },

  deleteTask: async (id: string) => {
    const response = await axiosInstance.delete(`/tasks/${id}`)
    return response.data
  },

  toggleTaskComplete: async (id: string) => {
    const response = await axiosInstance.patch<Task>(`/tasks/${id}/toggle`)
    return response.data
  },

  getAISuggestedTasks: async () => {
    const response = await axiosInstance.get<Task[]>("/tasks/ai-suggestions")
    return response.data
  }
}
