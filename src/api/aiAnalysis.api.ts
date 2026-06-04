import { axiosInstance } from "./axios.config"

export const aiAnalysisApi = {
  getRejectionAnalysis: async () => {
    const response = await axiosInstance.get("/ai/rejection-analysis")
    return response.data
  },

  runRejectionAnalysis: async (applicationId?: string) => {
    const response = await axiosInstance.post("/ai/rejection-analysis/run", { applicationId })
    return response.data
  },

  getAnalysisByApplicationId: async (id: string) => {
    const response = await axiosInstance.get(`/ai/rejection-analysis/${id}`)
    return response.data
  }
}
