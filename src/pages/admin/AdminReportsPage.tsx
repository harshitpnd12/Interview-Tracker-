import React from "react"
import { FileText } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"
import Badge from "../../components/shared/Badge"

export const AdminReportsPage: React.FC = () => {
  const reports = [
    { id: "rep-1", title: "Amazon SDE-2 Rejection Diagnostics", user: "arjun.sharma@gmail.com", date: "2025-05-28" },
    { id: "rep-2", title: "Swiggy Backend Engineer Audit", user: "arjun.sharma@gmail.com", date: "2025-05-29" },
    { id: "rep-3", title: "Google L4 Interview Prep Strategy", user: "sneha@google.com", date: "2025-06-01" }
  ]

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="Admin generated AI Reports"
        description="Audit all AI rejection feedback logs produced by the platform engine"
        icon={<FileText className="w-5 h-5" />}
      />

      <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-850">
          {reports.map((rep) => (
            <div key={rep.id} className="py-3 flex items-center justify-between text-xs font-semibold text-slate-500">
              <div className="text-left">
                <span className="text-slate-850 dark:text-white font-bold block">{rep.title}</span>
                <span className="text-slate-400 mt-0.5 block">Requested by: {rep.user}</span>
              </div>
              <Badge variant="outline">{rep.date}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default AdminReportsPage
