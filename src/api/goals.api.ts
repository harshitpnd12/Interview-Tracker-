import { axiosInstance } from "./axios.config"
import type { Goal } from "../types"

export const goalsApi = {
  getAllGoals: async () => {
    const response = await axiosInstance.get<Goal[]>("/goals")
    return response.data
  },

  createGoal: async (data: Omit<Goal, "id">) => {
    const response = await axiosInstance.post<Goal>("/goals", data)
    return response.data
  },

  updateGoal: async (id: string, data: Partial<Goal>) => {
    const response = await axiosInstance.put<Goal>(`/goals/${id}`, data)
    return response.data
  },

  deleteGoal: async (id: string) => {
    const response = await axiosInstance.delete(`/goals/${id}`)
    return response.data
  },

  updateGoalProgress: async (id: string, currentValue: number) => {
    const response = await axiosInstance.patch<Goal>(`/goals/${id}/progress`, { currentValue })
    return response.data
  },

  getAchievements: async () => {
    const response = await axiosInstance.get("/goals/achievements")
    return response.data
  }
}
