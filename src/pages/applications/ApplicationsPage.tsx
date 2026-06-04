import React, { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Plus, Search, SlidersHorizontal, Table, Kanban, 
  Briefcase, Edit, Eye, Trash2 
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useApplications } from "../../hooks/useApplications"
import PageHeader from "../../components/shared/PageHeader"
import Badge from "../../components/shared/Badge"
import ConfirmDialog from "../../components/shared/ConfirmDialog"
import type { Application } from "../../types"
import { cn } from "../../lib/utils"

export const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate()
  const { applications, deleteApplication, updateApplicationStatus, stats } = useApplications()

  // State
  const [viewMode, setViewMode] = useState<"table" | "kanban">(() => {
    return (localStorage.getItem("iq_apps_view") as "table" | "kanban") || "kanban"
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [priorityFilter, setPriorityFilter] = useState<string[]>([])
  const [deleteAppId, setDeleteAppId] = useState<string | null>(null)
  
  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleToggleView = (mode: "table" | "kanban") => {
    setViewMode(mode)
    localStorage.setItem("iq_apps_view", mode)
  }

  // Filter application data
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchSearch = 
        app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.location.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchStatus = statusFilter.length === 0 || statusFilter.includes(app.status)
      const matchPriority = priorityFilter.length === 0 || priorityFilter.includes(app.priority)

      return matchSearch && matchStatus && matchPriority
    })
  }, [applications, searchQuery, statusFilter, priorityFilter])

  // Delete handlers
  const handleConfirmDelete = async () => {
    if (deleteAppId) {
      await deleteApplication(deleteAppId)
      setSelectedIds((prev) => prev.filter((id) => id !== deleteAppId))
      setDeleteAppId(null)
    }
  }

  // Bulk actions
  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} applications?`)) {
      selectedIds.forEach((id) => deleteApplication(id))
      setSelectedIds([])
    }
  }

  const handleBulkStatusChange = (status: Application["status"]) => {
    selectedIds.forEach((id) => updateApplicationStatus({ id, status }))
    setSelectedIds([])
  }

  // Status badging styles mapping
  const statusConfig: Record<Application["status"], { bg: string; text: string }> = {
    applied: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300" },
    "under-review": { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
    "phone-screen": { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
    technical: { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400" },
    "hr-round": { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-400" },
    "final-round": { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" },
    offer: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" },
    rejected: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-400 line-through" },
    withdrawn: { bg: "bg-gray-105 dark:bg-slate-800", text: "text-slate-500" },
  }

  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-blue-500"
  }

  // Kanban Column Categories
  const kanbanColumns = [
    { key: "applied", label: "Applied", color: "border-t-slate-400" },
    { key: "under-review", label: "Under Review", color: "border-t-amber-500" },
    { key: "interview-stage", label: "Interviews", color: "border-t-violet-500", statuses: ["phone-screen", "technical", "hr-round", "final-round"] },
    { key: "offer", label: "Offers", color: "border-t-emerald-500" },
    { key: "rejected", label: "Archive", color: "border-t-rose-400", statuses: ["rejected", "withdrawn"] },
  ]

  return (
    <div className="space-y-6 select-none">
      <PageHeader
        title="Job Applications"
        description="Organize, track, and optimize your application stages"
        icon={<Briefcase className="w-5 h-5" />}
      >
        <button
          onClick={() => navigate("/applications/new")}
          className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </button>
      </PageHeader>

      {/* Stats row overview */}
      <div className="flex flex-wrap items-center gap-3 py-3 border-y border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/10 px-4 rounded-2xl select-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Overview:</span>
        <Badge variant="primary">Total: {stats.total}</Badge>
        <Badge variant="success">Offers: {stats.offers}</Badge>
        <Badge variant="danger">Rejections: {stats.rejections}</Badge>
        <Badge variant="outline">Success Rate: {stats.successRate}%</Badge>
      </div>

      {/* Toolbar Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search company, job title, or location..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-250 dark:border-slate-800 bg-white dark:bg-card rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3.5 shrink-0 self-start sm:self-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer",
              showFilters ? "border-primary text-primary" : "text-slate-600 dark:text-slate-405"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {(statusFilter.length > 0 || priorityFilter.length > 0) && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>

          <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => handleToggleView("table")}
              className={cn(
                "p-2 rounded-lg cursor-pointer transition",
                viewMode === "table" ? "bg-white dark:bg-slate-850 text-primary shadow-sm" : "text-slate-450 hover:text-slate-600"
              )}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleToggleView("kanban")}
              className={cn(
                "p-2 rounded-lg cursor-pointer transition",
                viewMode === "kanban" ? "bg-white dark:bg-slate-850 text-primary shadow-sm" : "text-slate-450 hover:text-slate-600"
              )}
              title="Kanban Board"
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide down Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-inner space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block mb-2">
                  Status Filters
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(statusConfig).map((st) => {
                    const isChecked = statusFilter.includes(st)
                    return (
                      <button
                        key={st}
                        onClick={() => {
                          setStatusFilter((prev) =>
                            isChecked ? prev.filter((item) => item !== st) : [...prev, st]
                          )
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer",
                          isChecked
                            ? "bg-primary text-white border-primary"
                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                        )}
                      >
                        {st}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-widest block mb-2">
                  Priority Filters
                </span>
                <div className="flex gap-2">
                  {["high", "medium", "low"].map((pr) => {
                    const isChecked = priorityFilter.includes(pr)
                    return (
                      <button
                        key={pr}
                        onClick={() => {
                          setPriorityFilter((prev) =>
                            isChecked ? prev.filter((item) => item !== pr) : [...prev, pr]
                          )
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 capitalize",
                          isChecked
                            ? "bg-primary text-white border-primary"
                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                        )}
                      >
                        <span className={cn("w-1.5 h-1.5 rounded-full", priorityColors[pr as "high" | "medium" | "low"])} />
                        {pr}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setStatusFilter([])
                  setPriorityFilter([])
                }}
                className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 cursor-pointer"
              >
                Apply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-950 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-45"
          >
            <span className="text-xs font-bold">
              {selectedIds.length} item{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-3">
              <select
                onChange={(e) => handleBulkStatusChange(e.target.value as Application["status"])}
                className="bg-slate-900 border border-slate-800 text-xs px-2.5 py-1 rounded-lg text-white focus:outline-none"
              >
                <option value="">Move Status</option>
                <option value="applied">Applied</option>
                <option value="under-review">Under Review</option>
                <option value="technical">Technical</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={handleBulkDelete}
                className="p-1 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                title="Delete Selected"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-500 hover:text-slate-350 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Views Container */}
      {viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-card rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-850">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={filteredApps.length > 0 && filteredApps.every((a) => selectedIds.includes(a.id))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(filteredApps.map((a) => a.id))
                      } else {
                        setSelectedIds([])
                      }
                    }}
                    className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                </th>
                <th className="p-4 text-sm font-semibold">Company</th>
                <th className="p-4 text-sm font-semibold">Role</th>
                <th className="p-4 text-sm font-semibold">Status</th>
                <th className="p-4 text-sm font-semibold">Applied</th>
                <th className="p-4 text-sm font-semibold">Priority</th>
                <th className="p-4 text-sm font-semibold">Source</th>
                <th className="p-4 text-sm font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-slate-400 font-semibold">
                    No applications match the filters.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const isChecked = selectedIds.includes(app.id)
                  const stStyle = statusConfig[app.status] || { bg: "bg-slate-100", text: "text-slate-700" }
                  
                  return (
                    <tr
                      key={app.id}
                      onClick={() => navigate(`/applications/${app.id}`)}
                      className={cn(
                        "hover:bg-slate-50/50 dark:hover:bg-slate-800/10 cursor-pointer transition-colors",
                        isChecked ? "bg-primary/5 dark:bg-primary/10" : ""
                      )}
                    >
                      <td
                        className="p-4 text-center"
                        onClick={(e) => e.stopPropagation()} // Prevent nav click trigger
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds((prev) => [...prev, app.id])
                            } else {
                              setSelectedIds((prev) => prev.filter((id) => id !== app.id))
                            }
                          }}
                          className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        />
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-850 dark:text-white">
                        {app.companyName}
                      </td>
                      <td className="p-4 text-sm text-slate-600 dark:text-slate-350">{app.jobTitle}</td>
                      <td className="p-4 text-xs font-bold">
                        <span className={cn("px-2.5 py-0.5 rounded-full border border-black/5 dark:border-white/5", stStyle.bg, stStyle.text)}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-450 font-bold">{app.appliedDate}</td>
                      <td className="p-4 text-xs capitalize font-semibold">
                        <span className="flex items-center gap-1.5">
                          <span className={cn("w-2 h-2 rounded-full", priorityColors[app.priority])} />
                          {app.priority}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-500 font-semibold capitalize">{app.source}</td>
                      <td
                        className="p-4 text-center"
                        onClick={(e) => e.stopPropagation()} // Prevent row link nav
                      >
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/applications/${app.id}`)}
                            className="p-1 text-slate-400 hover:text-primary transition cursor-pointer"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/applications/${app.id}/edit`)}
                            className="p-1 text-slate-400 hover:text-indigo-500 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteAppId(app.id)}
                            className="p-1 text-slate-400 hover:text-danger transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* KANBAN BOARD VIEW */
        <div className="grid md:grid-cols-5 gap-4 overflow-x-auto min-w-[900px] md:min-w-0 pb-4">
          {kanbanColumns.map((col) => {
            const colApps = filteredApps.filter((app) => {
              if (col.statuses) return col.statuses.includes(app.status)
              return app.status === col.key
            })

            return (
              <div
                key={col.key}
                className="bg-slate-100/60 dark:bg-[#1a1a24]/30 rounded-2xl p-4 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className={cn("pb-3 border-t-4 rounded-t-sm flex items-center justify-between mb-4", col.color)}>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {col.label}
                  </h4>
                  <Badge variant="muted">{colApps.length}</Badge>
                </div>

                {/* Column Cards list */}
                <div className="space-y-3 overflow-y-auto flex-grow max-h-[600px] pr-1">
                  {colApps.length === 0 ? (
                    <div className="py-12 text-center text-[10px] text-slate-400 font-semibold border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      Empty column
                    </div>
                  ) : (
                    colApps.map((app) => (
                      <motion.div
                        key={app.id}
                        layoutId={app.id}
                        onClick={() => navigate(`/applications/${app.id}`)}
                        className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer relative group"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 select-none">
                            {app.companyName.charAt(0)}
                          </div>
                          <span className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", priorityColors[app.priority])} />
                        </div>
                        
                        <h5 className="text-xs font-extrabold text-slate-800 dark:text-white mt-3 truncate">
                          {app.companyName}
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                          {app.jobTitle}
                        </p>
                        
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-[9px] text-slate-400 font-bold">{app.appliedDate}</span>
                          <span className="text-[9px] bg-slate-50 dark:bg-slate-900 border px-1.5 py-0.5 rounded text-slate-500 font-bold capitalize">
                            {app.source}
                          </span>
                        </div>

                        {/* Hover Actions overlay */}
                        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-card rounded-lg border px-1 py-0.5 shadow-sm flex items-center gap-1 z-10">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/applications/${app.id}/edit`); }}
                            className="p-1 hover:text-indigo-500 text-slate-400 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteAppId(app.id); }}
                            className="p-1 hover:text-danger text-slate-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteAppId !== null}
        title="Delete Application"
        description="Are you sure you want to remove this application? This action will delete all linked rounds, timelines and notes. This cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteAppId(null)}
      />
    </div>
  )
}
export default ApplicationsPage
