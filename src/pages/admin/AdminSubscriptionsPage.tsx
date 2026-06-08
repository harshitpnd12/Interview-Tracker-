import React from "react"
import { CreditCard } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"
import Badge from "../../components/shared/Badge"

export const AdminSubscriptionsPage: React.FC = () => {
  const subs = [
    { name: "Arjun Sharma", email: "arjun.sharma@gmail.com", type: "pro", active: true },
    { name: "Rahul Patel", email: "rahul@gmail.com", type: "pro", active: true },
    { name: "Sneha Reddy", email: "sneha@google.com", type: "enterprise", active: true }
  ]

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="Admin Subscriptions Log"
        description="Monitor invoices statuses and plan types"
        icon={<CreditCard className="w-5 h-5" />}
      />

      <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-850">
          {subs.map((sub, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between text-xs font-semibold text-slate-500">
              <div className="text-left">
                <span className="text-slate-850 dark:text-white font-bold block">{sub.name}</span>
                <span className="text-slate-400 mt-0.5 block">{sub.email}</span>
              </div>
              <Badge variant={sub.type === "enterprise" || sub.type === "custom" ? "success" : sub.type === "prime" ? "warning" : "primary"}>
                {sub.type} Plan
              </Badge>
              <Badge variant="success">Active</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default AdminSubscriptionsPage
