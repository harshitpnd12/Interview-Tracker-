import { axiosInstance } from "./axios.config"

export const resumeApi = {
  getAllResumes: async () => {
    const response = await axiosInstance.get("/resumes")
    return response.data
  },

  uploadResume: async (formData: FormData) => {
    const response = await axiosInstance.post("/resumes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  analyzeResume: async (id: string) => {
    const response = await axiosInstance.post(`/resumes/${id}/analyze`)
    return response.data
  },

  deleteResume: async (id: string) => {
    const response = await axiosInstance.delete(`/resumes/${id}`)
    return response.data
  },

  setActiveResume: async (id: string) => {
    const response = await axiosInstance.patch(`/resumes/${id}/active`)
    return response.data
  },

  compareResumes: async (id1: string, id2: string) => {
    const response = await axiosInstance.get(`/resumes/compare`, {
      params: { v1: id1, v2: id2 },
    })
    return response.data
  }
}
