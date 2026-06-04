import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { applicationsApi } from "../api/applications.api"
import { demoApplications } from "../lib/demo-data"
import type { Application } from "../types"
import { toast } from "sonner"

const getLocalApps = (): Application[] => {
  const data = localStorage.getItem("iq_applications")
  if (!data) {
    localStorage.setItem("iq_applications", JSON.stringify(demoApplications))
    return demoApplications
  }
  try {
    return JSON.parse(data)
  } catch {
    return demoApplications
  }
}

const saveLocalApps = (apps: Application[]) => {
  localStorage.setItem("iq_applications", JSON.stringify(apps))
}

export const useApplications = () => {
  const queryClient = useQueryClient()

  // 1. Fetch All Applications
  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      try {
        return await applicationsApi.getAllApplications()
      } catch (err) {
        console.warn("Using local storage applications database.")
        return getLocalApps()
      }
    },
    placeholderData: getLocalApps,
  })

  // 2. Fetch Single Application
  const getApplicationQuery = (id: string) => {
    return useQuery({
      queryKey: ["application", id],
      queryFn: async () => {
        try {
          return await applicationsApi.getApplicationById(id)
        } catch (err) {
          const local = getLocalApps()
          const found = local.find((a) => a.id === id)
          if (!found) throw new Error("Application not found")
          return found
        }
      },
      enabled: !!id,
    })
  }

  // 3. Stats Query
  const statsQuery = useQuery({
    queryKey: ["application-stats"],
    queryFn: async () => {
      try {
        return await applicationsApi.getApplicationStats()
      } catch (err) {
        const apps = getLocalApps()
        const total = apps.length
        const active = apps.filter((a) => !["rejected", "withdrawn", "offer"].includes(a.status)).length
        const offers = apps.filter((a) => a.status === "offer").length
        const rejections = apps.filter((a) => a.status === "rejected").length
        
        return {
          total,
          active,
          offers,
          rejections,
          successRate: total > 0 ? Math.round((offers / total) * 100) : 0,
        }
      }
    },
    placeholderData: () => {
      const apps = getLocalApps()
      const total = apps.length
      const offers = apps.filter((a) => a.status === "offer").length
      return {
        total,
        active: apps.filter((a) => !["rejected", "withdrawn", "offer"].includes(a.status)).length,
        offers,
        rejections: apps.filter((a) => a.status === "rejected").length,
        successRate: total > 0 ? Math.round((offers / total) * 100) : 0,
      }
    }
  })

  // 4. Create Application Mutation
  const createMutation = useMutation({
    mutationFn: async (data: Omit<Application, "id">) => {
      try {
        return await applicationsApi.createApplication(data)
      } catch (err) {
        const local = getLocalApps()
        const newApp: Application = {
          ...data,
          id: `app-${Math.random().toString(36).substr(2, 9)}`,
        }
        local.unshift(newApp)
        saveLocalApps(local)
        return newApp
      }
    },
    onSuccess: (newApp) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] })
      queryClient.invalidateQueries({ queryKey: ["application-stats"] })
      toast.success(`Added application for ${newApp.companyName}!`)
    },
    onError: () => {
      toast.error("Failed to create application.")
    }
  })

  // 5. Update Application Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Application> }) => {
      try {
        return await applicationsApi.updateApplication(id, data)
      } catch (err) {
        const local = getLocalApps()
        const index = local.findIndex((a) => a.id === id)
        if (index !== -1) {
          local[index] = { ...local[index], ...data } as Application
          saveLocalApps(local)
          return local[index]
        }
        throw new Error("Application not found locally")
      }
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] })
      queryClient.invalidateQueries({ queryKey: ["application", updated.id] })
      queryClient.invalidateQueries({ queryKey: ["application-stats"] })
      toast.success(`Updated application for ${updated.companyName}!`)
    },
    onError: () => {
      toast.error("Failed to update application.")
    }
  })

  // 6. Delete Application Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await applicationsApi.deleteApplication(id)
        return id
      } catch (err) {
        const local = getLocalApps()
        const filtered = local.filter((a) => a.id !== id)
        saveLocalApps(filtered)
        return id
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] })
      queryClient.invalidateQueries({ queryKey: ["application-stats"] })
      toast.success("Application deleted.")
    },
    onError: () => {
      toast.error("Failed to delete application.")
    }
  })

  // 7. Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Application["status"] }) => {
      try {
        return await applicationsApi.updateApplicationStatus(id, status)
      } catch (err) {
        const local = getLocalApps()
        const index = local.findIndex((a) => a.id === id)
        if (index !== -1) {
          local[index].status = status
          saveLocalApps(local)
          return local[index]
        }
        throw new Error("Application not found locally")
      }
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] })
      queryClient.invalidateQueries({ queryKey: ["application", updated.id] })
      queryClient.invalidateQueries({ queryKey: ["application-stats"] })
      toast.success(`Moved ${updated.companyName} to ${updated.status}`)
    },
    onError: () => {
      toast.error("Failed to update status.")
    }
  })

  return {
    applications: applicationsQuery.data || [],
    isLoading: applicationsQuery.isLoading,
    isError: applicationsQuery.isError,
    stats: statsQuery.data || { total: 0, active: 0, offers: 0, rejections: 0, successRate: 0 },
    statsLoading: statsQuery.isLoading,
    getApplicationQuery,
    createApplication: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateApplication: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteApplication: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    updateApplicationStatus: updateStatusMutation.mutateAsync,
  }
}
