import React from "react"
import { Shield, Users, CreditCard, FileText, TrendingUp } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"
import StatsCard from "../../components/shared/StatsCard"
import Badge from "../../components/shared/Badge"

export const AdminDashboardPage: React.FC = () => {
  const recentUsers = [
    { name: "Rahul Patel", email: "rahul@gmail.com", plan: "pro", joined: "Today" },
    { name: "Sneha Sen", email: "sneha@gmail.com", plan: "free", joined: "Today" },
    { name: "Vikram Kumar", email: "vikram@gmail.com", plan: "enterprise", joined: "Yesterday" }
  ]

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="Admin Control Center"
        description="Monitor system metrics, subscriptions, generated reports, and active accounts"
        icon={<Shield className="w-5 h-5" />}
      />

      <div className="grid sm:grid-cols-4 gap-6">
        <StatsCard
          title="Active Users"
          value="1,291"
          icon={Users}
          iconBg="text-indigo-500 bg-indigo-500/10"
          trend="+12% this week"
          trendDirection="up"
        />
        <StatsCard
          title="Total MRR"
          value="$12,890"
          icon={CreditCard}
          iconBg="text-emerald-500 bg-emerald-500/10"
          trend="+8% this month"
          trendDirection="up"
        />
        <StatsCard
          title="Subscribers"
          value="456"
          icon={TrendingUp}
          iconBg="text-cyan-500 bg-cyan-500/10"
          subText="Pro, Prime & Custom"
        />
        <StatsCard
          title="Reports Generated"
          value="4,821"
          icon={FileText}
          iconBg="text-violet-500 bg-violet-500/10"
          subText="AI Rejection audits"
        />
      </div>

      <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-850 dark:text-white uppercase tracking-wider border-b pb-2 mb-4">
          Recent Signups
        </h3>
        <div className="divide-y divide-slate-105 dark:divide-slate-850">
          {recentUsers.map((u, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs font-semibold text-slate-500">
              <div className="text-left">
                <span className="text-slate-850 dark:text-white font-bold block">{u.name}</span>
                <span className="text-slate-400 mt-0.5 block">{u.email}</span>
              </div>
              <Badge variant={u.plan === "pro" ? "primary" : u.plan === "prime" ? "success" : u.plan === "enterprise" || u.plan === "custom" ? "warning" : "muted"}>
                {u.plan}
              </Badge>
              <span>{u.joined}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default AdminDashboardPage
