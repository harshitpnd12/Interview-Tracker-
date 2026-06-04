import React, { useState } from "react"
import { Sparkles, Bot, AlertTriangle, Info, RefreshCw, Briefcase } from "lucide-react"
import { useApplications } from "../../hooks/useApplications"
import PageHeader from "../../components/shared/PageHeader"
import { toast } from "sonner"
import { cn } from "../../lib/utils"

export const RejectionAnalysisPage: React.FC = () => {
  const { applications } = useApplications()
  
  // Filter rejected applications
  const rejectedApps = React.useMemo(() => {
    return applications.filter((app) => app.status === "rejected" || app.status === "withdrawn")
  }, [applications])

  const [selectedAppId, setSelectedAppId] = useState(rejectedApps[0]?.id || "")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(() => {
    if (rejectedApps[0]?.companyName === "Swiggy") {
      return {
        company: "Swiggy",
        matchPercent: 54,
        rejectionRisk: 88,
        coreGap: "System Design & Distributed Scaling",
        reasons: "Lack of demonstrable microservices concurrency patterns and cache invalidation strategies in the technical design panel.",
        skillGaps: ["Cache Invalidation (Redis/Memcached)", "Saga Pattern for Microservices", "Rate Limiting Algorithms (Token Bucket)"],
        positives: ["Excellent Java syntax proficiency", "Strong performance in linear DSA rounds"],
        recs: "Read 'Designing Data-Intensive Applications' Chapter 5-6, and practice designing a distributed rate limiter."
      }
    }
    return null
  })

  const handleSelectApp = (appId: string) => {
    setSelectedAppId(appId)
    const app = rejectedApps.find((a) => a.id === appId)
    if (app) {
      if (app.companyName === "Swiggy") {
        setAnalysis({
          company: "Swiggy",
          matchPercent: 54,
          rejectionRisk: 88,
          coreGap: "System Design & Distributed Scaling",
          reasons: "Lack of demonstrable microservices concurrency patterns and cache invalidation strategies in the technical design panel.",
          skillGaps: ["Cache Invalidation (Redis/Memcached)", "Saga Pattern for Microservices", "Rate Limiting Algorithms (Token Bucket)"],
          positives: ["Excellent Java syntax proficiency", "Strong performance in linear DSA rounds"],
          recs: "Read 'Designing Data-Intensive Applications' Chapter 5-6, and practice designing a distributed rate limiter."
        })
      } else {
        setAnalysis({
          company: app.companyName,
          matchPercent: 64,
          rejectionRisk: 72,
          coreGap: "Role-specific requirements fit",
          reasons: "Resume lacks deep experience in company core stack tags.",
          skillGaps: ["Infrastructure integration", "Scale optimization"],
          positives: ["Broad backend familiarity", "Good presentation"],
          recs: "Optimize resume for the company specific stack."
        })
      }
    }
  }

  const handleRunAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      toast.success("AI Rejection Analysis updated!")
    }, 1500)
  }

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="AI Rejection Intelligence"
        description="Extract technical gaps and feedback from unsuccessful interviews"
        icon={<Sparkles className="w-5 h-5" />}
      />

      {rejectedApps.length === 0 ? (
        <div className="py-20 text-center border border-dashed rounded-3xl bg-white dark:bg-card p-8">
          <AlertTriangle className="w-10 h-10 text-slate-450 mx-auto mb-4" />
          <h3 className="text-base font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">
            No Rejected applications found
          </h3>
          <p className="text-xs text-slate-450 mt-2 max-w-sm mx-auto leading-relaxed">
            AI Rejection intelligence audits your pipeline status to discover and suggest skill corrections.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left panel: Selector */}
          <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider border-b pb-2">
              Select Application
            </h3>
            
            <div className="space-y-2">
              {rejectedApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleSelectApp(app.id)}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition cursor-pointer flex items-center gap-3",
                    selectedAppId === app.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-350"
                  )}
                >
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{app.companyName}</div>
                    <div className="text-[10px] text-slate-450 truncate mt-0.5">{app.jobTitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right panel: Analysis Report */}
          <div className="lg:col-span-2 space-y-6">
            {analysis ? (
              <div className="bg-white dark:bg-card border-2 border-indigo-500/20 dark:border-indigo-500/10 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-500 shrink-0" />
                    <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">
                      Audit Report: {analysis.company}
                    </h3>
                  </div>
                  <button
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer transition shrink-0"
                    title="Re-run analysis"
                  >
                    <RefreshCw className={cn("w-4 h-4", isAnalyzing ? "animate-spin" : "")} />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Compatibility Match</span>
                    <span className="text-2xl font-black text-rose-600 dark:text-rose-400 block mt-2">{analysis.matchPercent}%</span>
                  </div>
                  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 text-left">
                    <span className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-widest block">Core Skill Gap</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block mt-2.5 truncate">{analysis.coreGap}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider flex items-center gap-1">
                    <Info className="w-4 h-4 text-indigo-500 shrink-0" /> AI Diagnostic Summary
                  </h4>
                  <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed bg-slate-50 dark:bg-slate-900/10 p-4 rounded-xl border border-slate-150 dark:border-slate-850">
                    {analysis.reasons}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-805 dark:text-white uppercase tracking-wider">Identified gaps</h4>
                    <ul className="space-y-2">
                      {analysis.skillGaps.map((gap: string, idx: number) => (
                        <li key={idx} className="flex gap-2 text-xs text-slate-655 dark:text-slate-400 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-805 dark:text-white uppercase tracking-wider">Actionable Recommendations</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                      {analysis.recs}
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center justify-center min-h-[300px]">
                <p className="text-xs text-slate-400 font-semibold italic">Select an application from the sidebar to view the report.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
export default RejectionAnalysisPage
