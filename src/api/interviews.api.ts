import { axiosInstance } from "./axios.config"
import type { InterviewRound } from "../types"

export const interviewsApi = {
  getAllInterviewTimelines: async () => {
    const response = await axiosInstance.get<InterviewRound[]>("/interviews")
    return response.data
  },

  getInterviewById: async (id: string) => {
    const response = await axiosInstance.get<InterviewRound[]>(`/interviews/${id}`)
    return response.data
  },

  createInterviewRound: async (applicationId: string, data: Omit<InterviewRound, "id" | "applicationId">) => {
    const response = await axiosInstance.post<InterviewRound>("/interviews", { ...data, applicationId })
    return response.data
  },

  updateInterviewRound: async (id: string, data: Partial<InterviewRound>) => {
    const response = await axiosInstance.put<InterviewRound>(`/interviews/${id}`, data)
    return response.data
  },

  deleteInterviewRound: async (id: string) => {
    const response = await axiosInstance.delete(`/interviews/${id}`)
    return response.data
  },

  getUpcomingInterviews: async () => {
    const response = await axiosInstance.get<InterviewRound[]>("/interviews/upcoming")
    return response.data
  }
}
