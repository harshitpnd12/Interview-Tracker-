import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, Calendar, Video, User, Star, Plus, 
  Edit2, Trash2, Sparkles, X, Loader2 
} from "lucide-react"
import { useInterviews } from "../../hooks/useInterviews"
import { useApplications } from "../../hooks/useApplications"
import PageHeader from "../../components/shared/PageHeader"
import Badge from "../../components/shared/Badge"
import ConfirmDialog from "../../components/shared/ConfirmDialog"
import type { InterviewRound } from "../../types"
import { toast } from "sonner"
import { cn } from "../../lib/utils"

export const InterviewTimelineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { getApplicationQuery } = useApplications()
  const { getApplicationRoundsQuery, createInterviewRound, updateInterviewRound, deleteInterviewRound } = useInterviews()

  // Queries
  const { data: application } = getApplicationQuery(id || "")
  const { data: rounds, isLoading } = getApplicationRoundsQuery(id || "")

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editRound, setEditRound] = useState<InterviewRound | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteRoundId, setDeleteRoundId] = useState<string | null>(null)

  // Form Field States
  const [roundName, setRoundName] = useState("")
  const [roundType, setRoundType] = useState<InterviewRound["roundType"]>("technical")
  const [roundStatus, setRoundStatus] = useState<InterviewRound["status"]>("scheduled")
  const [roundDate, setRoundDate] = useState("")
  const [roundDuration, setRoundDuration] = useState(60)
  const [roundPlatform, setRoundPlatform] = useState("Google Meet")
  const [roundInterviewer, setRoundInterviewer] = useState("")
  const [roundSelfRating, setRoundSelfRating] = useState(4)
  const [roundFeedback, setRoundFeedback] = useState("")
  const [roundResult, setRoundResult] = useState<InterviewRound["result"]>("cleared")

  const handleOpenAdd = () => {
    setRoundName("")
    setRoundType("technical")
    setRoundStatus("scheduled")
    setRoundDate("")
    setRoundDuration(60)
    setRoundPlatform("Google Meet")
    setRoundInterviewer("")
    setRoundSelfRating(4)
    setRoundFeedback("")
    setRoundResult("cleared")
    setEditRound(null)
    setIsAddOpen(true)
  }

  const handleOpenEdit = (round: InterviewRound) => {
    setEditRound(round)
    setRoundName(round.roundName)
    setRoundType(round.roundType)
    setRoundStatus(round.status)
    setRoundDate(round.date ? round.date.slice(0, 16) : "")
    setRoundDuration(round.duration || 60)
    setRoundPlatform(round.platform || "")
    setRoundInterviewer(round.interviewerName || "")
    setRoundSelfRating(round.selfRating || 4)
    setRoundFeedback(round.feedback || "")
    setRoundResult(round.result || "cleared")
    setIsAddOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roundName.trim()) return

    const roundData = {
      roundName,
      roundType,
      status: roundStatus,
      date: roundDate || undefined,
      duration: roundDuration,
      platform: roundPlatform || undefined,
      interviewerName: roundInterviewer || undefined,
      selfRating: roundStatus === "completed" ? roundSelfRating : undefined,
      feedback: roundStatus === "completed" ? roundFeedback || undefined : undefined,
      result: roundStatus === "completed" ? roundResult || undefined : undefined,
    }

    try {
      if (editRound) {
        await updateInterviewRound({ id: editRound.id, applicationId: id!, data: roundData })
      } else {
        await createInterviewRound({ applicationId: id!, data: roundData })
      }
      setIsAddOpen(false)
    } catch {
      toast.error("Failed to save interview round.")
    }
  }

  const handleDelete = async () => {
    if (deleteRoundId) {
      await deleteInterviewRound({ id: deleteRoundId, applicationId: id! })
      setIsDeleteOpen(false)
      setDeleteRoundId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const sortedRounds = [...(rounds || [])].sort((a, b) => {
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  return (
    <div className="space-y-6 select-none text-left">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/interview-timeline")}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-450 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-slate-400">Back to Timelines</span>
      </div>

      <PageHeader
        title={`${application?.companyName || "Company"} Timeline`}
        description={`Interview progress path for ${application?.jobTitle || "role"}`}
        icon={<Calendar className="w-5 h-5" />}
      >
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Round
        </button>
      </PageHeader>

      {/* VERTICAL TIMELINE CONTAINER */}
      <div className="max-w-3xl mx-auto py-10 relative">
        {sortedRounds.length === 0 ? (
          <div className="text-center py-16 border border-dashed rounded-3xl bg-white dark:bg-card">
            <p className="text-xs text-slate-400 font-bold">No rounds scheduled yet.</p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              Add First Round
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* SVG line overlay drawing down */}
            <div className="absolute left-[33px] md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 pointer-events-none" />

            <div className="space-y-12">
              {sortedRounds.map((round, idx) => {
                const dateVal = round.date ? new Date(round.date) : null
                const isCompleted = round.status === "completed"
                const isUpcoming = round.status === "scheduled"

                return (
                  <motion.div
                    key={round.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className={cn(
                      "flex flex-col md:flex-row items-start md:items-center relative",
                      idx % 2 === 0 ? "md:flex-row-reverse" : ""
                    )}
                  >
                    {/* Left node (metadata dates) */}
                    <div className="hidden md:block w-1/2 px-8 text-right font-bold text-xs text-slate-400">
                      {dateVal ? dateVal.toLocaleString() : "Date Pending"}
                    </div>

                    {/* Timeline Node Circle */}
                    <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full border-4 border-slate-50 dark:border-[#0F0F13] flex items-center justify-center z-10 shrink-0">
                      {isCompleted ? (
                        <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                          ✓
                        </div>
                      ) : isUpcoming ? (
                        <div className="w-5 h-5 bg-indigo-500 rounded-full animate-pulse-ring ring-4 ring-indigo-500/25" />
                      ) : (
                        <div className="w-5 h-5 bg-slate-300 dark:bg-slate-700 rounded-full" />
                      )}
                    </div>

                    {/* Right node (visual card details) */}
                    <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                      <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 relative hover:shadow-md transition">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="text-xs font-black text-slate-850 dark:text-white uppercase tracking-wider">
                            {round.roundName}
                          </h4>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleOpenEdit(round)}
                              className="p-1 hover:text-primary text-slate-400 cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteRoundId(round.id)
                                setIsDeleteOpen(true)
                              }}
                              className="p-1 hover:text-danger text-slate-400 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <Badge variant="outline">{round.roundType}</Badge>
                          <Badge variant={isCompleted ? "success" : "primary"}>
                            {round.status}
                          </Badge>
                        </div>

                        {/* Additional fields */}
                        <div className="text-xs space-y-1 text-slate-500 dark:text-slate-400">
                          {round.platform && (
                            <p className="flex items-center gap-1.5">
                              <Video className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{round.platform} {round.duration ? `(${round.duration} mins)` : ""}</span>
                            </p>
                          )}
                          {round.interviewerName && (
                            <p className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Interviewer: {round.interviewerName}</span>
                            </p>
                          )}
                        </div>

                        {/* Completed rating details */}
                        {isCompleted && (
                          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-400">Self Rating</span>
                            <div className="flex items-center gap-0.5 text-amber-500">
                              {Array.from({ length: 5 }).map((_, rIdx) => (
                                <Star
                                  key={rIdx}
                                  className={cn(
                                    "w-3.5 h-3.5",
                                    rIdx < (round.selfRating || 4) ? "fill-current" : "text-slate-200 dark:text-slate-800"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Upcoming Prep suggestion */}
                        {isUpcoming && (
                          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 flex items-center justify-between gap-3">
                            <button
                              onClick={() => navigate("/ai-mock-interview")}
                              className="w-full py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              Prepare with AI Mock
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden relative z-10 text-left"
            >
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-855 dark:text-white uppercase tracking-wider">
                  {editRound ? "Edit Interview Round" : "Add Interview Round"}
                </h3>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-650 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">
                    Round Name *
                  </label>
                  <input
                    value={roundName}
                    onChange={(e) => setRoundName(e.target.value)}
                    type="text"
                    required
                    placeholder="e.g. Technical Coding Round 1"
                    className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">
                      Round Type *
                    </label>
                    <select
                      value={roundType}
                      onChange={(e) => setRoundType(e.target.value as any)}
                      className="w-full mt-1.5 px-2.5 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-card text-slate-800 dark:text-white"
                    >
                      <option value="online-assessment">Online Assessment</option>
                      <option value="technical">Technical Round</option>
                      <option value="system-design">System Design</option>
                      <option value="behavioral">Behavioral / Googliness</option>
                      <option value="hr">HR Round</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wide">
                      Status *
                    </label>
                    <select
                      value={roundStatus}
                      onChange={(e) => setRoundStatus(e.target.value as any)}
                      className="w-full mt-1.5 px-2.5 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-card text-slate-800 dark:text-white"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">
                      Date & Time
                    </label>
                    <input
                      value={roundDate}
                      onChange={(e) => setRoundDate(e.target.value)}
                      type="datetime-local"
                      className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wide">
                      Duration (mins)
                    </label>
                    <input
                      value={roundDuration}
                      onChange={(e) => setRoundDuration(Number(e.target.value))}
                      type="number"
                      className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">
                      Platform
                    </label>
                    <input
                      value={roundPlatform}
                      onChange={(e) => setRoundPlatform(e.target.value)}
                      type="text"
                      placeholder="Google Meet, Zoom"
                      className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wide">
                      Interviewer Name
                    </label>
                    <input
                      value={roundInterviewer}
                      onChange={(e) => setRoundInterviewer(e.target.value)}
                      type="text"
                      placeholder="Rahul Sharma"
                      className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent"
                    />
                  </div>
                </div>

                {roundStatus === "completed" && (
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Performance details</span>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Self Rating</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={roundSelfRating}
                        onChange={(e) => setRoundSelfRating(Number(e.target.value))}
                        className="w-32 accent-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Outcome</label>
                      <select
                        value={roundResult}
                        onChange={(e) => setRoundResult(e.target.value as any)}
                        className="w-full mt-1 px-2 py-1.5 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-card text-slate-800 dark:text-white"
                      >
                        <option value="cleared">Cleared</option>
                        <option value="rejected">Rejected</option>
                        <option value="waiting">Waiting Decision</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wide">Feedback notes</label>
                      <textarea
                        value={roundFeedback}
                        onChange={(e) => setRoundFeedback(e.target.value)}
                        rows={2}
                        placeholder="What questions were asked? What went well?"
                        className="w-full mt-1 px-3 py-1.5 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 border border-slate-205 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Interview Round?"
        description="Are you sure you want to remove this interview round? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  )
}
export default InterviewTimelineDetailPage
