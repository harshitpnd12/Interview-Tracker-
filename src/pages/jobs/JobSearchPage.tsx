import React, { useState } from "react"
import { Search, MapPin, Sparkles, Heart, ExternalLink } from "lucide-react"
import { demoJobs } from "../../lib/demo-data"
import PageHeader from "../../components/shared/PageHeader"
import Badge from "../../components/shared/Badge"
import { toast } from "sonner"
import { cn } from "../../lib/utils"

export const JobSearchPage: React.FC = () => {
  const [jobs, setJobs] = useState(demoJobs)
  const [search, setSearch] = useState("")

  const filteredJobs = React.useMemo(() => {
    if (!search) return jobs
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    )
  }, [jobs, search])

  const handleToggleSave = (id: string, isSaved: boolean) => {
    setJobs(
      jobs.map((j) => (j.id === id ? { ...j, isSaved: !isSaved } : j))
    )
    toast.success(isSaved ? "Job removed from saved list." : "Job saved successfully!")
  }

  const handleApply = (id: string) => {
    setJobs(
      jobs.map((j) => (j.id === id ? { ...j, isApplied: true } : j))
    )
    toast.success("Redirecting to application portal...")
  }

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="AI Job Match Search"
        description="Explore active roles prioritized by your profile compatibility score"
        icon={<Search className="w-5 h-5" />}
      />

      {/* Toolbar */}
      <div className="relative max-w-md w-full">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search by title, company, or tech keywords (Node, SQL)..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-250 dark:border-slate-800 bg-white dark:bg-card rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>

      <div className="space-y-4 max-w-4xl">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 text-primary flex items-center justify-center font-black rounded-2xl uppercase select-none">
                {job.company.charAt(0)}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
                  {job.title}
                  {job.isNew && <Badge variant="primary">New</Badge>}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-semibold">
                  <span className="text-slate-700 dark:text-slate-300 font-bold">{job.company}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 shrink-0" /> {job.location} ({job.workMode})</span>
                  <span>•</span>
                  <span className="capitalize">{job.jobType}</span>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mt-2.5 pt-1">
                  {job.skills.map((sk) => (
                    <Badge key={sk} variant="outline">{sk}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Score and Apply buttons */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-650 dark:text-indigo-400">
                <Sparkles className="w-4 h-4 text-violet-500 shrink-0 fill-violet-400 animate-pulse" />
                <span>{job.aiMatchScore}% match</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleSave(job.id, job.isSaved)}
                  className={cn(
                    "p-2 border rounded-xl cursor-pointer transition",
                    job.isSaved ? "bg-red-500/10 text-red-500 border-red-500/20" : "border-slate-200 dark:border-slate-800 text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850"
                  )}
                  title={job.isSaved ? "Saved" : "Save Job"}
                >
                  <Heart className={cn("w-4.5 h-4.5", job.isSaved ? "fill-current" : "")} />
                </button>
                
                <button
                  onClick={() => handleApply(job.id)}
                  disabled={job.isApplied}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1",
                    job.isApplied 
                      ? "bg-slate-100 text-slate-450 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 cursor-not-allowed shadow-none"
                      : "bg-primary hover:bg-primary/90 text-white"
                  )}
                >
                  {job.isApplied ? "Applied" : "Apply Now"}
                  {!job.isApplied && <ExternalLink className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default JobSearchPage
