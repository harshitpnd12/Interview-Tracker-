import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Bot, Award } from "lucide-react"
import { mockInterviewApi } from "../../api/mockInterview.api"
import { demoMockSessions } from "../../lib/demo-data"
import PageHeader from "../../components/shared/PageHeader"
import Badge from "../../components/shared/Badge"
import { cn } from "../../lib/utils"

export const MockInterviewResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Fetch results
  const { data: session, isLoading } = useQuery({
    queryKey: ["mock-results", id],
    queryFn: async () => {
      try {
        return await mockInterviewApi.getSessionById(id!)
      } catch {
        return demoMockSessions.find((s) => s.id === id) || demoMockSessions[0]
      }
    },
    placeholderData: demoMockSessions.find((s) => s.id === id) || demoMockSessions[0],
  })

  if (isLoading || !session) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  // Fallback default feedback cards if not defined
  const feedbackList = session.feedback || [
    { category: "Problem Solving", rating: 4.0, text: "Demonstrated strong knowledge of graph structures, but was slightly slow to write recursion bases." },
    { category: "Communication", rating: 4.8, text: "Spoke clearly. Outlined approach, algorithms, and complexity classes before coding." },
    { category: "Code Quality", rating: 3.5, text: "Code was functional, but variable naming and structure could be cleaned up." },
    { category: "Time Management", rating: 4.0, text: "Finished the coding part in 30 minutes, leaving ample time to analyze." }
  ]

  const transcript = session.transcript || [
    { role: "interviewer", text: "Welcome. Design a rate limiting API utility.", timestamp: "00:05" },
    { role: "candidate", text: "I will use a Token Bucket algorithm backed by Redis to handle concurrent requests.", timestamp: "01:20" }
  ]

  return (
    <div className="space-y-6 select-none text-left">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/ai-mock-interview")}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-450 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-slate-400">Back to Prep Lobby</span>
      </div>

      <PageHeader
        title="Mock Interview Evaluation"
        description="Detailed review of your mock preparation performance and transcripts"
        icon={<Award className="w-5 h-5" />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Side: Score circles (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">
                Overall score breakdown
              </h3>
              <Badge variant="primary" className="capitalize">{session.difficulty} · {session.type}</Badge>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-around gap-6">
              {/* Giant Overall Score Ring */}
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary"
                    strokeDasharray={`${session.score || 78}, 100`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{session.score || 78}</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Overall</span>
                </div>
              </div>

              {/* Categorized ratings list */}
              <div className="flex-grow space-y-3.5 max-w-sm w-full">
                {feedbackList.map((item, idx) => {
                  const percent = Math.round((item.rating / 5) * 100)
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>{item.category}</span>
                        <span>{item.rating}/5</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Dialogue Transcript */}
          <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider border-b pb-2">
              Conversational transcript log
            </h3>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {transcript.map((msg, idx) => {
                const isInterviewer = msg.role === "interviewer"
                return (
                  <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-left">
                    <span className="text-[9px] font-black text-slate-400 mt-1 shrink-0">[{msg.timestamp}]</span>
                    <span className={cn("font-extrabold shrink-0", isInterviewer ? "text-indigo-500" : "text-primary")}>
                      {isInterviewer ? "Interviewer:" : "Candidate:"}
                    </span>
                    <p className="text-slate-650 dark:text-slate-350">{msg.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Side: AI recommendations comments (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <div className="flex items-center gap-2 border-b pb-3">
              <Bot className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
              <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">
                AI Diagnostic Comments
              </h3>
            </div>

            <div className="space-y-4">
              {feedbackList.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">{item.category}</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal bg-slate-50 dark:bg-slate-900/10 p-3 rounded-xl border border-slate-150 dark:border-slate-850">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default MockInterviewResultsPage
