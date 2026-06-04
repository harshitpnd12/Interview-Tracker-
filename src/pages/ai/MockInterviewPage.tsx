import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Sparkles, Mic, Play, History } from "lucide-react"
import { mockInterviewApi } from "../../api/mockInterview.api"
import { demoMockSessions } from "../../lib/demo-data"
import PageHeader from "../../components/shared/PageHeader"
import { cn } from "../../lib/utils"

export const MockInterviewPage: React.FC = () => {
  const navigate = useNavigate()
  
  // Setup parameters
  const [type, setType] = useState<"technical" | "system-design" | "behavioral" | "sql">("technical")
  const [difficulty, setDifficulty] = useState<"entry" | "mid" | "senior">("mid")
  const [targetCompany, setTargetCompany] = useState("")

  // Fetch previous mock sessions
  const { data: previousSessions, isLoading } = useQuery({
    queryKey: ["mock-sessions"],
    queryFn: async () => {
      try {
        return await mockInterviewApi.getMockInterviewSessions()
      } catch {
        return demoMockSessions
      }
    },
    placeholderData: demoMockSessions,
  })

  const handleStartSession = () => {
    // Navigate to live session room (passes config via state)
    navigate("/ai-mock-interview/session", {
      state: { type, difficulty, targetCompany }
    })
  }

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="AI Mock Interview Room"
        description="Practice speaking, write algorithms, and receive immediate behavioral diagnostics"
        icon={<Mic className="w-5 h-5" />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Side: Setup Config (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-card border-2 border-indigo-500/20 dark:border-indigo-500/10 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 border-b pb-3">
              <Sparkles className="w-4 h-4 text-violet-500 shrink-0" />
              <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">
                Configure Live Prep Session
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Type select */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Round Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full mt-1.5 px-3 py-2.5 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-card text-slate-800 dark:text-white font-semibold"
                >
                  <option value="technical">Technical DSA Coding</option>
                  <option value="system-design">System Design Architecture</option>
                  <option value="behavioral">Behavioral (Googliness/STAR)</option>
                  <option value="sql">SQL & Schema design</option>
                </select>
              </div>

              {/* Difficulty select */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Experience Tier
                </label>
                <div className="flex gap-2 mt-1">
                  {["entry", "mid", "senior"].map((tier) => {
                    const isChecked = difficulty === tier
                    return (
                      <button
                        key={tier}
                        onClick={() => setDifficulty(tier as any)}
                        type="button"
                        className={cn(
                          "flex-1 py-2 px-3 border text-xs font-bold rounded-xl transition cursor-pointer capitalize",
                          isChecked
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "border-slate-205 dark:border-slate-800 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                        )}
                      >
                        {tier}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Target Company (Optional)
              </label>
              <input
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                type="text"
                placeholder="Google, Razorpay, Swiggy, etc."
                className="w-full mt-1.5 px-4 py-2.5 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent text-slate-800 dark:text-white"
              />
            </div>

            <button
              onClick={handleStartSession}
              className="w-full py-3 bg-primary hover:bg-primary/95 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              Launch Mock Interview Room
            </button>
          </div>
        </div>

        {/* Right Side: Mock History (1/3 width) */}
        <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="space-y-4 overflow-y-auto flex-grow">
            <div className="flex items-center gap-2 border-b pb-3">
              <History className="w-4 h-4 text-slate-450 shrink-0" />
              <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">
                Previous Session Scores
              </h3>
            </div>

            <div className="space-y-3.5 pr-1">
              {isLoading ? (
                <div className="text-xs text-slate-400">Loading metrics...</div>
              ) : previousSessions && previousSessions.length > 0 ? (
                previousSessions.slice(0, 4).map((session) => (
                  <div
                    key={session.id}
                    onClick={() => navigate(`/ai-mock-interview/results/${session.id}`)}
                    className="p-3 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-100/50 dark:hover:bg-slate-800/20 border border-slate-150 dark:border-slate-850 rounded-xl flex items-center justify-between gap-4 transition cursor-pointer"
                  >
                    <div className="min-w-0 text-left">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize truncate block">
                        {session.type} round
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                        {session.completedAt ? session.completedAt : "Completed"} · {session.difficulty}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 block">
                        {session.score || "N/A"}/100
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400 italic">No history yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default MockInterviewPage
