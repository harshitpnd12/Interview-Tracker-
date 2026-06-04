import React, { useState } from "react"
import { Sparkles, FileText, Upload, Trash2, Loader2 } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"
import Badge from "../../components/shared/Badge"
import { toast } from "sonner"
import { cn } from "../../lib/utils"

export const ResumeIntelligencePage: React.FC = () => {
  
  // Resumes list state
  const [resumes, setResumes] = useState([
    { id: "res-1", name: "Arjun_SDE2_Backend_2025.pdf", score: 84, active: true, date: "2025-05-20" },
    { id: "res-2", name: "Arjun_PM_Resume_2025.pdf", score: 72, active: false, date: "2025-05-22" }
  ])
  const [isUploading, setIsUploading] = useState(false)
  const [activeAnalysis, setActiveAnalysis] = useState<any>({
    score: 84,
    skillsFound: ["Python", "Node.js", "Redis", "MySQL", "Docker", "System Design"],
    recommendations: ["Detail high-concurrency Node.js cluster designs", "Append AWS EC2 or cloud orchestration tags", "Elaborate consistent hashing models"],
    gaps: ["No explicit CI/CD orchestration mentioned", "Lacks SQL normalization performance detail"]
  })

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      const newRes = {
        id: `res-${Math.random()}`,
        name: file.name,
        score: Math.floor(Math.random() * 20) + 70, // random 70-90
        active: false,
        date: new Date().toISOString().split("T")[0]
      }
      setResumes([...resumes, newRes])
      toast.success("Resume uploaded successfully! Click Analyze to review.")
    }, 1500)
  }

  const handleSetActive = (id: string) => {
    setResumes(
      resumes.map((r) => ({ ...r, active: r.id === id }))
    )
    const selected = resumes.find((r) => r.id === id)
    if (selected) {
      setActiveAnalysis({
        score: selected.score,
        skillsFound: selected.id === "res-1" 
          ? ["Python", "Node.js", "Redis", "MySQL", "Docker", "System Design"]
          : ["Product Roadmap", "User Stories", "Market Research", "SQL"],
        recommendations: selected.id === "res-1"
          ? ["Detail high-concurrency Node.js designs", "Elaborate consistent hashing"]
          : ["Add A/B testing details", "Describe SQL analytical queries"],
        gaps: selected.id === "res-1"
          ? ["No explicit CI/CD", "Lacks SQL normalization metrics"]
          : ["Metrics missing on user growth"]
      })
    }
    toast.success("Active CV updated!")
  }

  const handleDelete = (id: string) => {
    if (confirm("Delete this resume file?")) {
      setResumes(resumes.filter((r) => r.id !== id))
      toast.success("Resume deleted.")
    }
  }

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="AI Resume Intelligence"
        description="Audit CV formats against target roles and get structural keywords matching"
        icon={<FileText className="w-5 h-5" />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Side: Resumes List (1/3 width) */}
        <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 mb-2">
            <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">
              My Uploaded Resumes
            </h3>
            <label className="p-1 text-primary hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg cursor-pointer transition shrink-0">
              <Upload className="w-4 h-4" />
              <input type="file" onChange={handleUpload} accept=".pdf,.docx" className="hidden" />
            </label>
          </div>

          <div className="space-y-3">
            {isUploading && (
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl flex items-center justify-center gap-2 text-xs text-slate-500 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading PDF file...
              </div>
            )}
            
            {resumes.map((res) => (
              <div
                key={res.id}
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-between gap-3 transition",
                  res.active 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350"
                )}
              >
                <div className="min-w-0 text-left">
                  <span className="text-xs font-bold truncate block">{res.name}</span>
                  <span className="text-[9px] text-slate-450 font-semibold block mt-0.5">
                    Uploaded: {res.date} · Score: {res.score}/100
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!res.active && (
                    <button
                      onClick={() => handleSetActive(res.id)}
                      className="text-[9px] font-extrabold px-1.5 py-0.5 border rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-505 cursor-pointer"
                    >
                      Use
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="p-1 hover:text-danger text-slate-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Resume Audit details (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {activeAnalysis ? (
            <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2 border-b pb-3">
                <Sparkles className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                <h3 className="text-xs font-extrabold text-slate-855 dark:text-white uppercase tracking-wider">
                  Resume audit diagnostics
                </h3>
              </div>

              <div className="flex items-center gap-6">
                {/* Score circle */}
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100 dark:text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-500"
                      strokeDasharray={`${activeAnalysis.score}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-xl font-black text-slate-900 dark:text-white">{activeAnalysis.score}</span>
                    <span className="text-[8px] text-slate-400 font-bold block">Score</span>
                  </div>
                </div>

                <div className="text-left space-y-1">
                  <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Excellent CV formatting</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                    Keyword density matches SDE-2 Backend profiles. We identified minor gaps in infrastructure orchestration descriptions.
                  </p>
                </div>
              </div>

              {/* Skills and suggestions */}
              <div className="grid sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-805 dark:text-white uppercase tracking-wider">Identified Keywords</h4>
                  <div className="flex flex-wrap gap-1">
                    {activeAnalysis.skillsFound.map((sk: string) => (
                      <Badge key={sk} variant="outline">{sk}</Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-805 dark:text-white uppercase tracking-wider">Actionable suggestions</h4>
                  <ul className="space-y-2">
                    {activeAnalysis.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center justify-center min-h-[300px]">
              <p className="text-xs text-slate-400 font-semibold italic">Upload a resume to begin diagnostic analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default ResumeIntelligencePage
