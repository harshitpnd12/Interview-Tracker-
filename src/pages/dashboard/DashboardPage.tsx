import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { 
  Plus, Sparkles, Briefcase, Calendar, CheckSquare, FileUp, 
  UserCheck, XCircle, ChevronRight, Target, Bot
} from "lucide-react"
import { 
  ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts"

import { useApplications } from "../../hooks/useApplications"
import { useInterviews } from "../../hooks/useInterviews"
import { useAuth } from "../../hooks/useAuth"
import StatsCard from "../../components/shared/StatsCard"
import Badge from "../../components/shared/Badge"
import { demoUser, demoGoals } from "../../lib/demo-data"
import { cn } from "../../lib/utils"

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { stats, statsLoading } = useApplications()
  const { upcomingInterviews, upcomingLoading } = useInterviews()

  // Get current greeting based on local hour
  const greeting = React.useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }, [])

  const plan = user?.plan || "pro"
  const tokensUsed = user?.tokensUsed ?? (plan === "free" ? 2 : plan === "pro" ? 42 : plan === "prime" ? 185 : plan === "custom" ? 240 : 42)
  const tokensTotal = user?.tokensTotal ?? (plan === "free" ? 5 : plan === "pro" ? 100 : plan === "prime" ? 99999 : plan === "custom" ? 1000 : 100)
  const isUnlimited = plan === "prime"
  const tokensPercentLeft = isUnlimited ? 100 : (tokensTotal > 0 ? ((tokensTotal - tokensUsed) / tokensTotal) * 100 : 0)
  const isLowCredits = !isUnlimited && tokensPercentLeft < 20

  // Active range filter: 'weeks' or 'month'
  const [activityRange, setActivityRange] = useState<"weeks" | "month">("weeks")

  // Composed Chart Data (8 Weeks Activity)
  const activityData = [
    { name: "W1", applied: 2, interviews: 1, rejections: 0 },
    { name: "W2", applied: 4, interviews: 2, rejections: 1 },
    { name: "W3", applied: 3, interviews: 1, rejections: 2 },
    { name: "W4", applied: 6, interviews: 3, rejections: 1 },
    { name: "W5", applied: 5, interviews: 2, rejections: 3 },
    { name: "W6", applied: 7, interviews: 4, rejections: 2 },
    { name: "W7", applied: 4, interviews: 3, rejections: 1 },
    { name: "W8", applied: 3, interviews: 2, rejections: 1 },
  ]

  // Monthly Activity Data
  const monthlyActivityData = [
    { name: "Jan", applied: 10, interviews: 4, rejections: 2 },
    { name: "Feb", applied: 14, interviews: 6, rejections: 5 },
    { name: "Mar", applied: 18, interviews: 8, rejections: 4 },
    { name: "Apr", applied: 12, interviews: 5, rejections: 3 },
    { name: "May", applied: 22, interviews: 11, rejections: 8 },
    { name: "Jun", applied: 25, interviews: 14, rejections: 9 },
  ]

  const currentGraphData = activityRange === "weeks" ? activityData : monthlyActivityData

  // Pie Chart Data (Donut status breakdown)
  const pieData = [
    { name: "Applied", value: 12, color: "#94a3b8" }, // slate-400
    { name: "Under Review", value: 8, color: "#f59e0b" }, // amber-500
    { name: "Interview", value: 6, color: "#7c3aed" }, // violet-600
    { name: "Offer", value: 2, color: "#10b981" }, // emerald-500
    { name: "Rejected", value: 11, color: "#f43f5e" }, // rose-500
    { name: "Withdrawn", value: 3, color: "#64748b" }, // slate-500
  ]

  // AI insights
  const aiInsights = [
    {
      type: "warning",
      border: "border-amber-500/20 bg-amber-50/5 dark:bg-amber-950/5",
      text: "Your technical mock interview score dropped 15% this week in SQL questions.",
      actionLabel: "Practice SQL Mock →",
      action: () => navigate("/ai-mock-interview")
    },
    {
      type: "win",
      border: "border-emerald-500/20 bg-emerald-50/5 dark:bg-emerald-950/5",
      text: "Resume intelligence score increased to 84/100 after adding Docker and Microservices tags.",
      actionLabel: "Optimize Resume →",
      action: () => navigate("/resume-intelligence")
    }
  ]

  // Activity Feed Mockup
  const activityFeed = [
    { text: "Applied to swiggy SDE-2 role", time: "1 hour ago", icon: Briefcase, color: "text-indigo-500 bg-indigo-500/10" },
    { text: "Scheduled Google Technical Round 1", time: "3 hours ago", icon: Calendar, color: "text-violet-500 bg-violet-500/10" },
    { text: "Uploaded updated Backend CV", time: "Yesterday", icon: FileUp, color: "text-emerald-500 bg-emerald-500/10" },
    { text: "Completed Goal: 'Weekly applications'", time: "2 days ago", icon: Target, color: "text-cyan-500 bg-cyan-500/10" },
    { text: "Ran AI Rejection Analysis for Amazon SDE-2", time: "3 days ago", icon: Sparkles, color: "text-purple-500 bg-purple-500/10" },
    { text: "Logged PM note for Microsoft panel", time: "4 days ago", icon: CheckSquare, color: "text-amber-500 bg-amber-500/10" },
  ]

  const quickActions = [
    { label: "Add Application", icon: Plus, action: () => navigate("/applications/new") },
    { label: "Schedule Interview", icon: Calendar, action: () => navigate("/interview-timeline") },
    { label: "AI Mock Prep", icon: Sparkles, action: () => navigate("/ai-mock-interview") },
    { label: "Upload CV", icon: FileUp, action: () => navigate("/resume-intelligence") },
    { label: "Update Goals", icon: Target, action: () => navigate("/goals") },
    { label: "View Tasks", icon: CheckSquare, action: () => navigate("/tasks") }
  ]

  return (
    <div className="space-y-8 select-none">
      {/* SECTION 1: Greeting + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
            <span>{greeting}, {user?.name.split(" ")[0] || demoUser.name.split(" ")[0]} 👋</span>
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5 shrink-0 transition-all shadow-sm select-none",
              isUnlimited 
                ? "bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400"
                : isLowCredits 
                  ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-450 animate-pulse" 
                  : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
            )}>
              <Sparkles className="w-3 h-3 text-violet-500 shrink-0" />
              <span>AI Prep: {isUnlimited ? "Unlimited" : `${tokensUsed}/${tokensTotal}`}</span>
              {isLowCredits && (
                <span className="ml-1 text-[8px] font-black uppercase text-red-500 tracking-wider">
                  (Low Credits)
                </span>
              )}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-1">
            Today is {format(new Date(), "eeee, MMMM d, yyyy")} · Let's secure your next role.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
          <button
            onClick={() => navigate("/applications/new")}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
          <button
            onClick={() => navigate("/ai-mock-interview")}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-violet-500" />
            Start Mock Interview
          </button>
        </div>
      </div>

      {/* SECTION 2: 6 KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Total Job Application"
          value={34}
          icon={Briefcase}
          iconBg="text-indigo-500 bg-indigo-500/10"
          trend="+5 this week"
          trendDirection="up"
          loading={statsLoading}
        />
        <StatsCard
          title="Active Interviews"
          value={upcomingInterviews.length + 3}
          icon={Calendar}
          iconBg="text-violet-500 bg-violet-500/10"
          subText="2 scheduled today"
          loading={statsLoading}
        />
        <StatsCard
          title="Offers Recd"
          value={stats.offers || 2}
          icon={UserCheck}
          iconBg="text-emerald-500 bg-emerald-500/10"
          trend="+1 this month"
          trendDirection="up"
          loading={statsLoading}
        />
        <StatsCard
          title="Rejections"
          value={stats.rejections || 11}
          icon={XCircle}
          iconBg="text-rose-500 bg-rose-500/10"
          subText="Last: 3 days ago"
          loading={statsLoading}
        />
        <StatsCard
          title="Mock Avg"
          value="78%"
          icon={Sparkles}
          iconBg="text-cyan-500 bg-cyan-500/10"
          subText="Last: Yesterday"
          loading={statsLoading}
        />
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest absolute top-4 left-6">
            Success Rate
          </span>
          <div className="relative w-16 h-16 flex items-center justify-center mt-3">
            <svg className="w-full h-full transform -rotate-95" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-500"
                strokeDasharray="68, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-sm font-black text-slate-900 dark:text-white">68%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Charts Row */}
      <div className="grid lg:grid-cols-10 gap-6">
        {/* LEFT Composed Chart (60% width) */}
        <div className="lg:col-span-6 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[360px]">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Application Activity
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {activityRange === "weeks" ? "Overview of last 8 weeks activity" : "Overview of monthly activity"}
              </p>
            </div>
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setActivityRange("weeks")}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer",
                  activityRange === "weeks" 
                    ? "bg-indigo-600 text-white shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/40 dark:hover:bg-slate-800"
                )}
              >
                8 Weeks
              </button>
              <button 
                onClick={() => setActivityRange("month")}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer",
                  activityRange === "month" 
                    ? "bg-indigo-600 text-white shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/40 dark:hover:bg-slate-800"
                )}
              >
                Month
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentGraphData} margin={{ top: 10, right: -5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="appliedColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="rejectionColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-150 dark:stroke-slate-800" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "#fff" }}
                  labelStyle={{ fontWeight: "bold", fontSize: 11, color: "#cbd5e1" }}
                  itemStyle={{ fontSize: 11 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 10, color: "#64748b" }} />
                <Area type="monotone" name="Rejections" dataKey="rejections" fill="url(#rejectionColor)" stroke="#f43f5e" strokeWidth={1} />
                <Bar name="Apps Submitted" dataKey="applied" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={16} />
                <Line type="monotone" name="Interviews Recd" dataKey="interviews" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT Pie Chart (40% width) */}
        <div className="lg:col-span-4 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Status Breakdown
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Current distribution of 34 applications</p>
          </div>

          <div className="relative h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center absolute text */}
            <div className="absolute text-center pointer-events-none">
              <span className="text-lg font-black text-slate-900 dark:text-white block">34</span>
              <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-455 truncate">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4 & 5: Upcoming Rounds & AI Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Interviews */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Upcoming Rounds
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Prepare with custom AI pipelines</p>
            </div>
            <button
              onClick={() => navigate("/interview-timeline")}
              className="text-xs font-bold text-primary hover:text-indigo-650 flex items-center gap-0.5 cursor-pointer"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3.5 flex-grow">
            {upcomingLoading ? (
              <div className="text-xs text-slate-450">Loading schedule...</div>
            ) : upcomingInterviews.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 font-semibold">
                No scheduled rounds. Start applying!
              </div>
            ) : (
              upcomingInterviews.slice(0, 3).map((item) => {
                const dateVal = item.date ? new Date(item.date) : null
                const isTomorrow = dateVal ? dateVal.getDate() === new Date().getDate() + 1 : false
                const isToday = dateVal ? dateVal.getDate() === new Date().getDate() : false
                
                return (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/interview-timeline/${item.id}`)}
                    className="p-3 bg-slate-50/50 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/20 border border-slate-150 dark:border-slate-850 rounded-xl flex items-center justify-between gap-4 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0 uppercase">
                        {item.roundName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {item.roundName}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] text-slate-450 dark:text-slate-400 font-semibold shrink-0">
                            {item.platform || "Meet"}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700 text-[10px] shrink-0">•</span>
                          <span className="text-[10px] text-slate-450 dark:text-slate-400 font-semibold truncate">
                            {item.interviewerName || "Staff Panel"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <Badge variant={isToday ? "danger" : isTomorrow ? "warning" : "outline"}>
                        {isToday ? "Today" : isTomorrow ? "Tomorrow" : "Scheduled"}
                      </Badge>
                      <span className="text-[9px] font-bold text-slate-400">
                        {dateVal ? format(dateVal, "MMM d, h:mm a") : "Pending"}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="bg-white dark:bg-card border-2 border-indigo-500/20 dark:border-indigo-500/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-primary/10 rounded-xl text-primary shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                AI Insights Today <Sparkles className="w-3.5 h-3.5 text-violet-400 fill-violet-400 shrink-0" />
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Recommendations from your intelligence coach</p>
            </div>
          </div>

          <div className="space-y-3.5 flex-grow">
            {aiInsights.map((insight, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-3 rounded-xl border flex flex-col justify-between gap-3 text-left animate-fade-in-up",
                  insight.border
                )}
              >
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {insight.text}
                </p>
                <button
                  onClick={insight.action}
                  className="text-[10px] font-extrabold text-primary hover:text-indigo-650 text-left cursor-pointer shrink-0"
                >
                  {insight.actionLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 6, 7 & 8: Activity, Actions, Goals */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Quick Shortcuts
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Frequent actions on the platform</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.action}
                className="p-3 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-primary hover:text-white dark:hover:bg-primary rounded-xl flex flex-col items-center justify-center gap-2 text-center transition group cursor-pointer text-slate-700 dark:text-slate-350"
              >
                <action.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition" />
                <span className="text-[10px] font-bold tracking-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Goals Progress */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Active Goals
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Stay accountable to your streak</p>
            </div>
            <button
              onClick={() => navigate("/goals")}
              className="text-xs font-bold text-primary hover:text-indigo-650 cursor-pointer"
            >
              Set New
            </button>
          </div>

          <div className="space-y-5 flex-grow">
            {demoGoals.slice(0, 3).map((goal) => {
              const current = goal.currentValue ?? 0
              const target = goal.targetValue ?? 1
              const percentage = Math.min(100, Math.round((current / target) * 100))

              return (
                <div key={goal.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200 truncate pr-2">{goal.title}</span>
                    <span className="text-slate-450 shrink-0">
                      {current}/{target} {goal.unit}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 font-semibold">
                    {percentage === 100 ? "Goal completed! 🎉" : `${100 - percentage}% left to hit target`}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Recent Activity
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Your timeline history</p>
          </div>

          <div className="relative mt-6 pl-6 space-y-4 max-h-56 overflow-y-auto">
            {/* Connector Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />

            {activityFeed.map((item, idx) => (
              <div key={idx} className="relative flex flex-col text-left">
                {/* Bullet node */}
                <div className={cn("absolute -left-[20px] top-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-card shrink-0 flex items-center justify-center bg-indigo-500")} />
                
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                  {item.text}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold mt-0.5">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default DashboardPage
