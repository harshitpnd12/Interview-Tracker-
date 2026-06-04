import { axiosInstance } from "./axios.config"

export const careerCoachApi = {
  getCareerCoachData: async () => {
    const response = await axiosInstance.get("/ai/career-coach")
    return response.data
  },

  updateCareerGoals: async (data: any) => {
    const response = await axiosInstance.put("/ai/career-coach/goals", data)
    return response.data
  },

  getStudyPlan: async () => {
    const response = await axiosInstance.get("/ai/career-coach/study-plan")
    return response.data
  },

  refreshCoachingPlan: async () => {
    const response = await axiosInstance.post("/ai/career-coach/refresh")
    return response.data
  }
}
