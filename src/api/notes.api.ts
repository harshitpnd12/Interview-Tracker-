import { axiosInstance } from "./axios.config"
import type { InterviewNote } from "../types"

export const notesApi = {
  getAllNotes: async () => {
    const response = await axiosInstance.get<InterviewNote[]>("/notes")
    return response.data
  },

  getNoteById: async (id: string) => {
    const response = await axiosInstance.get<InterviewNote>(`/notes/${id}`)
    return response.data
  },

  createNote: async (data: Omit<InterviewNote, "id">) => {
    const response = await axiosInstance.post<InterviewNote>("/notes", data)
    return response.data
  },

  updateNote: async (id: string, data: Partial<InterviewNote>) => {
    const response = await axiosInstance.put<InterviewNote>(`/notes/${id}`, data)
    return response.data
  },

  deleteNote: async (id: string) => {
    const response = await axiosInstance.delete(`/notes/${id}`)
    return response.data
  }
}
