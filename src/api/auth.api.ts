import { axiosInstance } from "./axios.config"

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post("/auth/login", { email, password })
    return response.data
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await axiosInstance.post("/auth/register", { name, email, password })
    return response.data
  },

  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post("/auth/forgot-password", { email })
    return response.data
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await axiosInstance.post("/auth/reset-password", { token, newPassword })
    return response.data
  },

  logout: async () => {
    const response = await axiosInstance.post("/auth/logout")
    return response.data
  },

  refreshToken: async () => {
    const response = await axiosInstance.post("/auth/refresh")
    return response.data
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get("/auth/me")
    return response.data
  }
}
