import { axiosInstance } from "./axios.config"
import type { Application } from "../types"

export const applicationsApi = {
  getAllApplications: async (filters?: any) => {
    const response = await axiosInstance.get<Application[]>("/applications", { params: filters })
    return response.data
  },

  getApplicationById: async (id: string) => {
    const response = await axiosInstance.get<Application>(`/applications/${id}`)
    return response.data
  },

  createApplication: async (data: Omit<Application, "id">) => {
    const response = await axiosInstance.post<Application>("/applications", data)
    return response.data
  },

  updateApplication: async (id: string, data: Partial<Application>) => {
    const response = await axiosInstance.put<Application>(`/applications/${id}`, data)
    return response.data
  },

  deleteApplication: async (id: string) => {
    const response = await axiosInstance.delete(`/applications/${id}`)
    return response.data
  },

  updateApplicationStatus: async (id: string, status: Application["status"]) => {
    const response = await axiosInstance.patch<Application>(`/applications/${id}/status`, { status })
    return response.data
  },

  getApplicationStats: async () => {
    const response = await axiosInstance.get("/applications/stats")
    return response.data
  }
}
