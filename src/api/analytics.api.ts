import { axiosInstance } from "./axios.config"

export const analyticsApi = {
  getAnalyticsOverview: async (period?: string) => {
    const response = await axiosInstance.get("/analytics/overview", { params: { period } })
    return response.data
  },

  getFunnelData: async (period?: string) => {
    const response = await axiosInstance.get("/analytics/funnel", { params: { period } })
    return response.data
  },

  getActivityTrend: async (period?: string) => {
    const response = await axiosInstance.get("/analytics/activity-trend", { params: { period } })
    return response.data
  },

  getSourceEffectiveness: async () => {
    const response = await axiosInstance.get("/analytics/sources")
    return response.data
  },

  getMockInterviewTrend: async () => {
    const response = await axiosInstance.get("/analytics/mock-trend")
    return response.data
  }
}
