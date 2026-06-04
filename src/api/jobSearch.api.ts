import { axiosInstance } from "./axios.config"
import type { Job } from "../types"

export const jobSearchApi = {
  searchJobs: async (params?: any) => {
    const response = await axiosInstance.get<Job[]>("/jobs/search", { params })
    return response.data
  },

  getSavedJobs: async () => {
    const response = await axiosInstance.get<Job[]>("/jobs/saved")
    return response.data
  },

  saveJob: async (jobId: string) => {
    const response = await axiosInstance.post(`/jobs/save`, { jobId })
    return response.data
  },

  unsaveJob: async (jobId: string) => {
    const response = await axiosInstance.delete(`/jobs/save/${jobId}`)
    return response.data
  },

  getJobById: async (id: string) => {
    const response = await axiosInstance.get<Job>(`/jobs/${id}`)
    return response.data
  },

  applyToJob: async (jobId: string) => {
    const response = await axiosInstance.post(`/jobs/${jobId}/apply`)
    return response.data
  },

  getAIRecommendedJobs: async () => {
    const response = await axiosInstance.get<Job[]>("/jobs/recommended")
    return response.data
  }
}
