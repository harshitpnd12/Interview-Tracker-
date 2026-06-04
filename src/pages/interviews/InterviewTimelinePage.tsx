import React from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, ChevronRight, Clock } from "lucide-react"
import { useApplications } from "../../hooks/useApplications"
import { useInterviews } from "../../hooks/useInterviews"
import PageHeader from "../../components/shared/PageHeader"
import Badge from "../../components/shared/Badge"

export const InterviewTimelinePage: React.FC = () => {
  const navigate = useNavigate()
  const { applications } = useApplications()
  const { allInterviews } = useInterviews()

  // Find applications with interview rounds
  const appsWithInterviews = React.useMemo(() => {
    return applications
      .filter((app) => ["technical", "under-review", "phone-screen", "hr-round", "final-round", "offer"].includes(app.status))
      .map((app) => {
        const appRounds = allInterviews.filter((r) => r.applicationId === app.id)
        const completedRounds = appRounds.filter((r) => r.status === "completed").length
        const totalRounds = appRounds.length
        const percent = totalRounds > 0 ? Math.round((completedRounds / totalRounds) * 100) : 0
        
        // Find next round
        const nextRound = appRounds
          .filter((r) => r.status === "scheduled" || r.status === "pending")
          .sort((a, b) => {
            if (!a.date) return 1
            if (!b.date) return -1
            return new Date(a.date).getTime() - new Date(b.date).getTime()
          })[0]

        return {
          ...app,
          totalRounds,
          completedRounds,
          percent,
          nextRound
        }
      })
      .filter((app) => app.totalRounds > 0)
  }, [applications, allInterviews])

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="Interview Timelines"
        description="Monitor interview stage pipelines and round completions"
        icon={<Calendar className="w-5 h-5" />}
      />

      {appsWithInterviews.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-card p-8">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-base font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">
            No Active timelines
          </h3>
          <p className="text-xs text-slate-450 mt-2 max-w-sm mx-auto leading-relaxed">
            Timelines appear here when you add interview rounds to applications.
          </p>
          <button
            onClick={() => navigate("/applications")}
            className="mt-6 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            Go to Applications
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {appsWithInterviews.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/10 text-primary flex items-center justify-center font-black rounded-xl uppercase">
                      {app.companyName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-850 dark:text-white">{app.companyName}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{app.jobTitle}</p>
                    </div>
                  </div>
                  <Badge variant="primary">{app.status}</Badge>
                </div>

                {/* Progress bar */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Round Progress</span>
                    <span>{app.percent}% ({app.completedRounds}/{app.totalRounds} rounds)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${app.percent}%` }}
                    />
                  </div>
                </div>

                {/* Next round trigger */}
                <div className="mt-6 p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-850 rounded-xl flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-500 shrink-0" />
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Next round</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {app.nextRound 
                        ? `${app.nextRound.roundName} - ${app.nextRound.date ? new Date(app.nextRound.date).toLocaleDateString() : "Scheduled"}` 
                        : "No rounds pending"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/interview-timeline/${app.id}`)}
                className="mt-6 w-full py-2 border border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1 cursor-pointer transition"
              >
                View Timeline Details
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default InterviewTimelinePage
