import { axiosInstance } from "./axios.config"
import type { User } from "../types"

export const profileApi = {
  getProfile: async () => {
    const response = await axiosInstance.get<User>("/profile")
    return response.data
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await axiosInstance.put<User>("/profile", data)
    return response.data
  },

  uploadAvatar: async (formData: FormData) => {
    const response = await axiosInstance.post<{ avatarUrl: string }>("/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  updatePassword: async (data: any) => {
    const response = await axiosInstance.put("/profile/password", data)
    return response.data
  },

  deleteAccount: async () => {
    const response = await axiosInstance.delete("/profile")
    return response.data
  },

  getLinkedAccounts: async () => {
    const response = await axiosInstance.get("/profile/linked-accounts")
    return response.data
  },

  downloadData: async () => {
    const response = await axiosInstance.get("/profile/export", {
      responseType: "blob",
    })
    return response.data
  }
}
