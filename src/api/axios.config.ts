import axios from "axios"
import { toast } from "sonner"

export const axiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8080/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request Interceptor: Attach JWT Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Global Error Handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?session=expired"
        }
      } else if (status === 500) {
        toast.error("Internal Server Error", {
          description: "Something went wrong on our servers. Please try again later.",
        })
      }
    } else if (error.request) {
      toast.error("Connection failed", {
        description: "Could not reach the server. Please check your internet connection.",
      })
    } else {
      toast.error("An unexpected error occurred.")
    }
    return Promise.reject(error)
  }
)
