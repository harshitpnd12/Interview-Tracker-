import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { interviewsApi } from "../api/interviews.api"
import { demoInterviewRounds } from "../lib/demo-data"
import type { InterviewRound } from "../types"
import { toast } from "sonner"

const getLocalRounds = (): Record<string, InterviewRound[]> => {
  const data = localStorage.getItem("iq_interviews")
  if (!data) {
    localStorage.setItem("iq_interviews", JSON.stringify(demoInterviewRounds))
    return demoInterviewRounds
  }
  try {
    return JSON.parse(data)
  } catch {
    return demoInterviewRounds
  }
}

const saveLocalRounds = (rounds: Record<string, InterviewRound[]>) => {
  localStorage.setItem("iq_interviews", JSON.stringify(rounds))
}

export const useInterviews = () => {
  const queryClient = useQueryClient()

  // 1. Get all rounds across all applications
  const allInterviewsQuery = useQuery({
    queryKey: ["interviews"],
    queryFn: async () => {
      try {
        return await interviewsApi.getAllInterviewTimelines()
      } catch (err) {
        const local = getLocalRounds()
        return Object.values(local).flat()
      }
    },
    placeholderData: () => Object.values(getLocalRounds()).flat(),
  })

  // 2. Get rounds for a specific application
  const getApplicationRoundsQuery = (applicationId: string) => {
    return useQuery({
      queryKey: ["interviews", applicationId],
      queryFn: async () => {
        try {
          // In real API, we can either get by ID or filter.
          return await interviewsApi.getInterviewById(applicationId)
        } catch (err) {
          const local = getLocalRounds()
          return local[applicationId] || []
        }
      },
      enabled: !!applicationId,
    })
  }

  // 3. Upcoming interviews
  const upcomingQuery = useQuery({
    queryKey: ["interviews", "upcoming"],
    queryFn: async () => {
      try {
        return await interviewsApi.getUpcomingInterviews()
      } catch (err) {
        const local = getLocalRounds()
        const allRounds = Object.values(local).flat()
        // Filter scheduled and pending rounds
        return allRounds
          .filter((r) => r.status === "scheduled" || r.status === "pending")
          .sort((a, b) => {
            if (!a.date) return 1
            if (!b.date) return -1
            return new Date(a.date).getTime() - new Date(b.date).getTime()
          })
      }
    },
    placeholderData: () => {
      const local = getLocalRounds()
      return Object.values(local)
        .flat()
        .filter((r) => r.status === "scheduled" || r.status === "pending")
        .sort((a, b) => {
          if (!a.date) return 1
          if (!b.date) return -1
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
    }
  })

  // 4. Create Round
  const createMutation = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string; data: Omit<InterviewRound, "id" | "applicationId"> }) => {
      try {
        return await interviewsApi.createInterviewRound(applicationId, data)
      } catch (err) {
        const local = getLocalRounds()
        const newRound: InterviewRound = {
          ...data,
          applicationId,
          id: `ir-${Math.random().toString(36).substr(2, 9)}`,
        }
        if (!local[applicationId]) local[applicationId] = []
        local[applicationId].push(newRound)
        saveLocalRounds(local)
        return newRound
      }
    },
    onSuccess: (newRound) => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] })
      queryClient.invalidateQueries({ queryKey: ["interviews", newRound.applicationId] })
      queryClient.invalidateQueries({ queryKey: ["interviews", "upcoming"] })
      toast.success("Interview round scheduled!")
    },
    onError: () => {
      toast.error("Failed to schedule round.")
    }
  })

  // 5. Update Round
  const updateMutation = useMutation({
    mutationFn: async ({ id, applicationId, data }: { id: string; applicationId: string; data: Partial<InterviewRound> }) => {
      try {
        return await interviewsApi.updateInterviewRound(id, data)
      } catch (err) {
        const local = getLocalRounds()
        const list = local[applicationId] || []
        const index = list.findIndex((r) => r.id === id)
        if (index !== -1) {
          list[index] = { ...list[index], ...data } as InterviewRound
          local[applicationId] = list
          saveLocalRounds(local)
          return list[index]
        }
        throw new Error("Round not found locally")
      }
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] })
      queryClient.invalidateQueries({ queryKey: ["interviews", updated.applicationId] })
      queryClient.invalidateQueries({ queryKey: ["interviews", "upcoming"] })
      toast.success("Interview round updated.")
    },
    onError: () => {
      toast.error("Failed to update round.")
    }
  })

  // 6. Delete Round
  const deleteMutation = useMutation({
    mutationFn: async ({ id, applicationId }: { id: string; applicationId: string }) => {
      try {
        await interviewsApi.deleteInterviewRound(id)
        return { id, applicationId }
      } catch (err) {
        const local = getLocalRounds()
        if (local[applicationId]) {
          local[applicationId] = local[applicationId].filter((r) => r.id !== id)
          saveLocalRounds(local)
        }
        return { id, applicationId }
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] })
      queryClient.invalidateQueries({ queryKey: ["interviews", res.applicationId] })
      queryClient.invalidateQueries({ queryKey: ["interviews", "upcoming"] })
      toast.success("Interview round deleted.")
    },
    onError: () => {
      toast.error("Failed to delete round.")
    }
  })

  return {
    allInterviews: allInterviewsQuery.data || [],
    isLoading: allInterviewsQuery.isLoading,
    upcomingInterviews: upcomingQuery.data || [],
    upcomingLoading: upcomingQuery.isLoading,
    getApplicationRoundsQuery,
    createInterviewRound: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateInterviewRound: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteInterviewRound: deleteMutation.mutateAsync,
  }
}
