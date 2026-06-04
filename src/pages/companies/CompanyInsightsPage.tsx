import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building2, Search, ArrowRight, Star } from "lucide-react"
import { demoCompanies } from "../../lib/demo-data"
import PageHeader from "../../components/shared/PageHeader"

export const CompanyInsightsPage: React.FC = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const filteredCompanies = React.useMemo(() => {
    if (!search) return demoCompanies
    return demoCompanies.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="Company Insights"
        description="Browse interview styles, round structures, and target templates from top tech companies"
        icon={<Building2 className="w-5 h-5" />}
      />

      <div className="relative max-w-md w-full">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search by company name or industry..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-250 dark:border-slate-800 bg-white dark:bg-card rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((co) => (
          <div
            key={co.id}
            onClick={() => navigate(`/company-insights/${co.id}`)}
            className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/10 text-primary flex items-center justify-center font-black rounded-xl uppercase">
                  {co.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-850 dark:text-white">{co.name}</h3>
                  <p className="text-xs text-slate-450 mt-0.5">{co.industry}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Difficulty</span>
                  <div className="flex items-center gap-1 mt-1 text-xs font-bold text-slate-800 dark:text-white">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                    <span>{co.interviewDifficulty}/5.0</span>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Rounds Count</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white mt-1 block">
                    {co.avgRounds} rounds
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-855 flex items-center justify-between text-xs font-bold text-primary hover:text-indigo-650">
              <span>View Interview Process</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default CompanyInsightsPage
