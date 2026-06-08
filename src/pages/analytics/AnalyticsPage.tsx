import React from "react"

import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { BarChart2, TrendingUp, Compass, Award } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"
import StatsCard from "../../components/shared/StatsCard"

export const AnalyticsPage: React.FC = () => {
  const overviewData = [
    { name: "Total Apps", value: 34 },
    { name: "Screener", value: 14 },
    { name: "Technical", value: 8 },
    { name: "Final", value: 4 },
    { name: "Offer", value: 2 },
  ]

  const trendData = [
    { month: "Jan", applications: 2, interviews: 1 },
    { month: "Feb", applications: 5, interviews: 2 },
    { month: "Mar", applications: 8, interviews: 4 },
    { month: "Apr", applications: 12, interviews: 6 },
    { month: "May", applications: 15, interviews: 9 },
    { month: "Jun", applications: 20, interviews: 12 },
  ]

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="Analytics Dashboard"
        description="Review conversion ratios, application funnels, and prep trend analyses"
        icon={<BarChart2 className="w-5 h-5" />}
      />

      <div className="grid sm:grid-cols-3 gap-6">
        <StatsCard
          title="Conversion rate"
          value="14.2%"
          icon={TrendingUp}
          iconBg="text-emerald-500 bg-emerald-500/10"
          subText="Apps logged to offer"
        />
        <StatsCard
          title="Interview Rate"
          value="41.1%"
          icon={Compass}
          iconBg="text-indigo-500 bg-indigo-500/10"
          subText="Applied to screen conversion"
        />
        <StatsCard
          title="Average Mock Score"
          value="78%"
          icon={Award}
          iconBg="text-cyan-500 bg-cyan-500/10"
          subText="SQL and technical rounds"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Funnel chart */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[300px]">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider mb-6">
            Application Pipeline Funnel
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overviewData} layout="vertical" margin={{ left: 24, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-slate-100 dark:stroke-slate-800" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "#fff" }}
                  itemStyle={{ fontSize: 11 }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Trend Chart */}
        <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[300px]">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider mb-6">
            Monthly Application Trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ left: -25, right: -5 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100 dark:stroke-slate-800" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "#fff" }}
                  itemStyle={{ fontSize: 11 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" name="Apps" dataKey="applications" fill="url(#colorApps)" stroke="#6366f1" strokeWidth={2} />
                <Area type="monotone" name="Interviews" dataKey="interviews" fill="none" stroke="#8b5cf6" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AnalyticsPage
