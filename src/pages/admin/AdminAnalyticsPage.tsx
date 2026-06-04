import React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BarChart2 } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"

export const AdminAnalyticsPage: React.FC = () => {
  const data = [
    { name: "Mon", value: 120 },
    { name: "Tue", value: 150 },
    { name: "Wed", value: 200 },
    { name: "Thu", value: 180 },
    { name: "Fri", value: 220 },
    { name: "Sat", value: 140 },
    { name: "Sun", value: 100 },
  ]

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="Admin System Traffic"
        description="Monitor server loads and system usage"
        icon={<BarChart2 className="w-5 h-5" />}
      />

      <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[300px]">
        <h3 className="text-sm font-extrabold text-slate-850 dark:text-white uppercase tracking-wider mb-6">
          Daily active queries
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: -25, right: -5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100 dark:stroke-slate-800" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "#fff" }}
                itemStyle={{ fontSize: 11 }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
export default AdminAnalyticsPage
