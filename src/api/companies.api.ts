import { axiosInstance } from "./axios.config"
import type { Company } from "../types"

export const companiesApi = {
  getAllCompanies: async (filters?: any) => {
    const response = await axiosInstance.get<Company[]>("/companies", { params: filters })
    return response.data
  },

  getCompanyById: async (id: string) => {
    const response = await axiosInstance.get<Company>(`/companies/${id}`)
    return response.data
  },

  getCompanyQuestions: async (id: string) => {
    const response = await axiosInstance.get<string[]>(`/companies/${id}/questions`)
    return response.data
  },

  searchCompanies: async (query: string) => {
    const response = await axiosInstance.get<Company[]>("/companies/search", { params: { q: query } })
    return response.data
  }
}
