import React from "react"
import { Users } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"
import Badge from "../../components/shared/Badge"

export const AdminUsersPage: React.FC = () => {
  const users = [
    { name: "Arjun Sharma", email: "arjun.sharma@gmail.com", role: "user", plan: "pro", date: "2025-01-15" },
    { name: "Rahul Patel", email: "rahul@gmail.com", role: "admin", plan: "pro", date: "2025-02-10" },
    { name: "Sneha Reddy", email: "sneha@google.com", role: "user", plan: "enterprise", date: "2025-03-20" }
  ]

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="Admin Users Directory"
        description="Search active accounts and modify privilege settings"
        icon={<Users className="w-5 h-5" />}
      />

      <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-850">
          {users.map((u, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between text-xs font-semibold text-slate-500">
              <div className="text-left">
                <span className="text-slate-850 dark:text-white font-bold block">{u.name}</span>
                <span className="text-slate-400 mt-0.5 block">{u.email}</span>
              </div>
              <Badge variant={u.role === "admin" ? "danger" : "outline"}>{u.role}</Badge>
              <Badge variant={u.plan === "pro" ? "primary" : u.plan === "enterprise" ? "success" : "muted"}>
                {u.plan}
              </Badge>
              <span>Joined: {u.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default AdminUsersPage
