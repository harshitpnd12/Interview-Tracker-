import { axiosInstance } from "./axios.config"

export const billingApi = {
  getCurrentPlan: async () => {
    const response = await axiosInstance.get("/billing/plan")
    return response.data
  },

  getBillingHistory: async () => {
    const response = await axiosInstance.get("/billing/history")
    return response.data
  },

  getUsageStats: async () => {
    const response = await axiosInstance.get("/billing/usage")
    return response.data
  },

  upgradePlan: async (planId: string, paymentData: any) => {
    const response = await axiosInstance.post("/billing/upgrade", { planId, ...paymentData })
    return response.data
  },

  cancelPlan: async () => {
    const response = await axiosInstance.post("/billing/cancel")
    return response.data
  },

  applyPromoCode: async (code: string) => {
    const response = await axiosInstance.post("/billing/promo", { code })
    return response.data
  }
}
