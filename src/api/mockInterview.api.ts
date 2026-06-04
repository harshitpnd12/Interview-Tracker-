import { axiosInstance } from "./axios.config"
import type { MockInterviewSession } from "../types"

export const mockInterviewApi = {
  getMockInterviewSessions: async () => {
    const response = await axiosInstance.get<MockInterviewSession[]>("/ai/mock-interviews")
    return response.data
  },

  getSessionById: async (id: string) => {
    const response = await axiosInstance.get<MockInterviewSession>(`/ai/mock-interviews/${id}`)
    return response.data
  },

  startNewSession: async (config: { type: string; difficulty: string; targetCompany?: string | null }) => {
    const response = await axiosInstance.post<MockInterviewSession>("/ai/mock-interviews/start", config)
    return response.data
  },

  submitAnswer: async (sessionId: string, data: { answer: string; questionId?: string }) => {
    const response = await axiosInstance.post(`/ai/mock-interviews/${sessionId}/answer`, data)
    return response.data
  },

  endSession: async (sessionId: string) => {
    const response = await axiosInstance.post<MockInterviewSession>(`/ai/mock-interviews/${sessionId}/end`)
    return response.data
  },

  getSessionResults: async (sessionId: string) => {
    const response = await axiosInstance.get(`/ai/mock-interviews/${sessionId}/results`)
    return response.data
  }
}
