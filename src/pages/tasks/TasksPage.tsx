import React, { useState } from "react"
import { CheckSquare, Trash2, CheckCircle2, Circle } from "lucide-react"
import { demoTasks } from "../../lib/demo-data"
import PageHeader from "../../components/shared/PageHeader"
import Badge from "../../components/shared/Badge"
import { toast } from "sonner"
import { cn } from "../../lib/utils"

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState(demoTasks)
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
    toast.success("Task updated.")
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const newTask = {
      id: `task-${Math.random()}`,
      title: newTaskTitle,
      category: "study" as const,
      priority: "medium" as const,
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
      isAISuggested: false
    }

    setTasks([newTask, ...tasks])
    setNewTaskTitle("")
    toast.success("New task created!")
  }

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
    toast.success("Task deleted.")
  }

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="Tasks Checklist"
        description="Review study logs, send recruiter emails, and complete daily challenges"
        icon={<CheckSquare className="w-5 h-5" />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Input & list (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            
            {/* Input Form */}
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                type="text"
                required
                placeholder="Log a new task (e.g. reviewconsistent hashing)..."
                className="w-full px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
              >
                Add Task
              </button>
            </form>

            <div className="space-y-3 pt-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-slate-50/50 dark:bg-slate-900/10 border rounded-xl flex items-center justify-between gap-4 transition"
                >
                  <div
                    onClick={() => handleToggleTask(task.id)}
                    className="flex items-start gap-2.5 min-w-0 cursor-pointer"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <span
                        className={cn(
                          "text-xs font-semibold leading-normal block truncate pr-2",
                          task.completed ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-300"
                        )}
                      >
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-slate-400 font-bold">{task.dueDate}</span>
                        {task.isAISuggested && (
                          <Badge variant="primary" className="text-[8px] py-0 px-1.5 uppercase font-black tracking-wider">
                            AI Suggested
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-1 hover:text-danger text-slate-400 cursor-pointer transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side suggestions */}
        <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider border-b pb-2">
            AI task Recommendations
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 dark:bg-slate-900/10 p-4 rounded-xl border">
            We noticed a drop in your graph traversal mock interview scores. We recommend scheduling a DFS/BFS review task.
          </p>
        </div>
      </div>
    </div>
  )
}
export default TasksPage
