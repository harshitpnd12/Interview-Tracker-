import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Globe, MapPin, Users, Star } from "lucide-react"
import { demoCompanies } from "../../lib/demo-data"

export const CompanyProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const company = React.useMemo(() => {
    return demoCompanies.find((c) => c.id === id) || demoCompanies[0]
  }, [id])

  return (
    <div className="space-y-6 select-none text-left">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/company-insights")}
          className="p-2 -ml-2 rounded-xl text-slate-505 hover:text-slate-700 dark:text-slate-450 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-slate-400">Back to Companies</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-primary flex items-center justify-center font-black text-xl shrink-0 uppercase select-none">
            {company.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
              {company.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-slate-600 dark:text-slate-350 text-sm font-semibold">{company.industry}</span>
            </div>
          </div>
        </div>

        {company.website && (
          <a
            href={`https://${company.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-750 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 self-start md:self-center"
          >
            <Globe className="w-4 h-4 text-slate-405" />
            Visit Website
          </a>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left main: timeline (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-card border border-slate-202 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider border-b pb-2">
              Interview Process Rounds
            </h3>

            <div className="space-y-4 relative pl-6">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />
              
              {company.interviewProcess ? (
                company.interviewProcess.map((proc, idx) => (
                  <div key={idx} className="relative text-left">
                    <div className="absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase">{proc.round}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{proc.details}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">No detailed breakdown logged yet.</div>
              )}
            </div>
          </div>

          {/* Top Questions */}
          <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider border-b pb-2">
              Common Interview Questions
            </h3>
            
            <div className="space-y-3">
              {company.questions ? (
                company.questions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-slate-50/50 dark:bg-slate-900/10 border rounded-xl flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-extrabold text-primary select-none mt-0.5">Q:</span>
                    <p className="leading-relaxed text-left">{q}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">No questions cached.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar details */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-card border border-slate-202 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider border-b pb-2">
              Company Metrics
            </h3>

            <div className="space-y-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 shrink-0" /> HQ Location</span>
                <span className="text-slate-800 dark:text-white font-bold">{company.hqLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 shrink-0" /> Company Size</span>
                <span className="text-slate-800 dark:text-white font-bold">{company.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 shrink-0" /> Difficulty</span>
                <span className="text-slate-800 dark:text-white font-bold">{company.interviewDifficulty}/5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CompanyProfilePage
