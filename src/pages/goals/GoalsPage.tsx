import React, { useState } from "react"
import { Target, Plus, CheckCircle, Clock } from "lucide-react"
import { demoGoals } from "../../lib/demo-data"
import PageHeader from "../../components/shared/PageHeader"
import { toast } from "sonner"
import { cn } from "../../lib/utils"

export const GoalsPage: React.FC = () => {
  const [localGoals, setLocalGoals] = useState(demoGoals)

  const handleToggleGoal = (id: string) => {
    setLocalGoals(
      localGoals.map((g) => {
        if (g.id === id) {
          const nextVal = (g.currentValue ?? 0) >= (g.targetValue ?? 1) ? 0 : g.targetValue
          return {
            ...g,
            currentValue: nextVal,
            status: nextVal === g.targetValue ? ("completed" as const) : ("active" as const)
          }
        }
        return g
      })
    )
    toast.success("Goal progress toggled.")
  }

  const categoryColors: Record<string, string> = {
    "job-search": "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20",
    "interview-prep": "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20",
    technical: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    career: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  }

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="Goals Board"
        description="Set weekly and monthly prep targets, monitor streaks, and log achievements"
        icon={<Target className="w-5 h-5" />}
      >
        <button
          onClick={() => toast.info("New goal modal simulator.")}
          className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Set Goal
        </button>
      </PageHeader>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localGoals.map((goal) => {
          const current = goal.currentValue ?? 0
          const target = goal.targetValue ?? 1
          const percent = Math.min(100, Math.round((current / target) * 100))
          const isDone = goal.status === "completed"

          return (
            <div
              key={goal.id}
              onClick={() => handleToggleGoal(goal.id)}
              className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border", categoryColors[goal.category] || "bg-slate-100")}>
                    {goal.category}
                  </span>
                  {goal.streak && (
                    <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                      🔥 {goal.streak}d streak
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-extrabold text-slate-850 dark:text-white mt-4">{goal.title}</h3>
                <p className="text-xs text-slate-450 mt-1">Deadline: {goal.deadline}</p>

                {/* Progress bar */}
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Progress</span>
                    <span>{current}/{target} {goal.unit || "units"}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                <span className={cn("flex items-center gap-1", isDone ? "text-emerald-500" : "text-slate-400")}>
                  {isDone ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  {isDone ? "Completed" : "Active"}
                </span>
                <span className="text-slate-400 hover:text-slate-600 transition">Toggle Progress</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default GoalsPage
