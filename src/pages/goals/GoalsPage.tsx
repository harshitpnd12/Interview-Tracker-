import React, { useState, useEffect } from "react"
import { Target, Plus, CheckCircle, Clock, X } from "lucide-react"
import { demoGoals } from "../../lib/demo-data"
import PageHeader from "../../components/shared/PageHeader"
import { toast } from "sonner"
import { cn } from "../../lib/utils"
import type { Goal } from "../../types"

export const GoalsPage: React.FC = () => {
  // Load initial goals from localStorage if available, else fall back to demoGoals
  const [localGoals, setLocalGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem("iq_goals")
    return saved ? JSON.parse(saved) : demoGoals
  })

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem("iq_goals", JSON.stringify(localGoals))
  }, [localGoals])

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<Goal["category"]>("job-search")
  const [targetValue, setTargetValue] = useState<number>(5)
  const [unit, setUnit] = useState("")
  const [deadline, setDeadline] = useState("")
  const [streak, setStreak] = useState<number>(0)

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

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Please enter a goal title.")
      return
    }

    if (!deadline) {
      toast.error("Please select a target deadline.")
      return
    }

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      category,
      type: "numeric",
      targetValue: targetValue || 1,
      currentValue: 0,
      unit: unit.trim() || "units",
      frequency: "weekly",
      deadline,
      status: "active",
      streak: streak > 0 ? streak : undefined
    }

    setLocalGoals([newGoal, ...localGoals])
    toast.success("New goal created successfully!")
    setIsModalOpen(false)

    // Reset fields
    setTitle("")
    setCategory("job-search")
    setTargetValue(5)
    setUnit("")
    setDeadline("")
    setStreak(0)
  }

  const categoryColors: Record<string, string> = {
    "job-search": "bg-indigo-500/10 text-indigo-650 dark:text-indigo-300 border-indigo-500/20",
    "interview-prep": "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20",
    technical: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    career: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  }

  return (
    <div className="space-y-6 select-none text-left relative">
      <PageHeader
        title="Goals Board"
        description="Set weekly and monthly prep targets, monitor streaks, and log achievements"
        icon={<Target className="w-5 h-5" />}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Set Goal
        </button>
      </PageHeader>

      {/* Goals Display Grid */}
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
              className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
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
                <span className="text-slate-450 hover:text-slate-600 transition">Toggle Progress</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Set Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-primary" /> Set New Goal
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-450 dark:text-slate-400 block mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., LeetCode Dynamic Programming"
                  className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-450 dark:text-slate-400 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Goal["category"])}
                  className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none text-slate-800 dark:text-slate-100 cursor-pointer"
                >
                  <option value="job-search">Job Search</option>
                  <option value="interview-prep">Interview Prep</option>
                  <option value="technical">Technical</option>
                  <option value="career">Career Plan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Target Value */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-450 dark:text-slate-400 block mb-1">
                    Target Count
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={targetValue}
                    onChange={(e) => setTargetValue(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-450 dark:text-slate-400 block mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g., problems, apps"
                    className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Deadline */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-450 dark:text-slate-400 block mb-1">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none text-slate-800 dark:text-slate-100 cursor-pointer"
                  />
                </div>

                {/* Initial Streak */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-450 dark:text-slate-400 block mb-1">
                    Initial Streak (Days)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={streak}
                    onChange={(e) => setStreak(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 mt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-850 text-slate-655 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
export default GoalsPage
