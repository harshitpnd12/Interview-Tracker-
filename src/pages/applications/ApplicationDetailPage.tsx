import React, { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { 
  ArrowLeft, Edit, Trash2, Calendar, FileText, Bot, 
  Clock, Mail, ExternalLink, MapPin, DollarSign, Flag, 
  AlertTriangle, Sparkles, MessageSquare, ChevronRight, Loader2
} from "lucide-react"
import { useApplications } from "../../hooks/useApplications"
import { useInterviews } from "../../hooks/useInterviews"
import Badge from "../../components/shared/Badge"
import ConfirmDialog from "../../components/shared/ConfirmDialog"
import type { Application, InterviewNote } from "../../types"
import { notesApi } from "../../api/notes.api"
import { demoNotes } from "../../lib/demo-data"
import { toast } from "sonner"
import { cn } from "../../lib/utils"

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Hooks
  const { getApplicationQuery, deleteApplication, updateApplication } = useApplications()
  const { getApplicationRoundsQuery } = useInterviews()

  // Query states
  const { data: application, isLoading, isError } = getApplicationQuery(id || "")
  const { data: rounds } = getApplicationRoundsQuery(id || "")

  // Local state for tabs
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "notes" | "ai" | "log">("overview")
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [recruiterName, setRecruiterName] = useState("")
  const [recruiterEmail, setRecruiterEmail] = useState("")

  // Notes state
  const [noteText, setNoteText] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)
  
  // AI analysis state
  const [rejectionAnalysis, setRejectionAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Query notes for this application
  const notesQuery = useQuery({
    queryKey: ["notes", id],
    queryFn: async () => {
      try {
        return await notesApi.getAllNotes()
      } catch (err) {
        return demoNotes.filter((n) => n.applicationId === id)
      }
    },
    placeholderData: () => demoNotes.filter((n) => n.applicationId === id),
  })

  // Sync recruiter detail states
  React.useEffect(() => {
    if (application) {
      setRecruiterName(application.recruiterName || "")
      setRecruiterEmail(application.recruiterEmail || "")
    }
  }, [application])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (isError || !application) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold text-red-500">Application not found</h3>
        <button onClick={() => navigate("/applications")} className="mt-4 text-xs font-bold text-primary">
          Back to Applications
        </button>
      </div>
    )
  }

  // Update recruiter contact details on blur
  const handleUpdateContact = async () => {
    if (recruiterName !== application.recruiterName || recruiterEmail !== application.recruiterEmail) {
      try {
        await updateApplication({
          id: application.id,
          data: { recruiterName, recruiterEmail }
        })
      } catch (err) {
        toast.error("Failed to update contact info.")
      }
    }
  }

  const handleDelete = async () => {
    await deleteApplication(application.id)
    navigate("/applications")
  }

  // Run AI Rejection Analysis
  const handleRunAI = async () => {
    setIsAnalyzing(true)
    try {
      // Mock API call to simulate GPT analysis delays
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setRejectionAnalysis({
        riskScore: 78,
        matchPercent: 62,
        skillGaps: ["System Design Architecture", "Hadoop/Kafka Big Data engines", "Advanced AWS Cloud security"],
        positives: ["Strong local Python & Node.js skills", "Solid algorithmic problem-solving in DSA rounds"],
        reasons: "Resume lacks enterprise-level high-scale distributed system details which Swiggy/Google technical rounds prioritize."
      })
      toast.success("AI Rejection Analysis generated successfully!")
    } catch {
      toast.error("Could not run AI analysis.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteText.trim()) return
    setIsAddingNote(true)

    try {
      const newNote: Omit<InterviewNote, "id"> = {
        applicationId: application.id,
        companyName: application.companyName,
        roundName: application.status,
        date: new Date().toISOString().split("T")[0],
        questions: [],
        selfRating: 4,
        communicationRating: 4,
        technicalRating: 4,
        problemSolvingRating: 4,
        wentWell: noteText,
        learningTopics: ["Review"],
        tags: ["quick-note"]
      }

      // Add to query cached notes
      queryClient.setQueryData(["notes", application.id], (old: any) => {
        const list = Array.isArray(old) ? old : []
        return [...list, { ...newNote, id: `note-${Math.random()}` }]
      })

      setNoteText("")
      toast.success("Quick note logged!")
    } catch {
      toast.error("Failed to log note.")
    } finally {
      setIsAddingNote(false)
    }
  }

  const statusConfig: Record<Application["status"], string> = {
    applied: "bg-slate-100 text-slate-700",
    "under-review": "bg-amber-100 text-amber-700",
    "phone-screen": "bg-blue-100 text-blue-700",
    technical: "bg-violet-100 text-violet-700",
    "hr-round": "bg-indigo-100 text-indigo-700",
    "final-round": "bg-purple-100 text-purple-700",
    offer: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700 line-through",
    withdrawn: "bg-gray-105 text-slate-500",
  }

  return (
    <div className="space-y-6 select-none text-left">
      {/* HEADER SECTION */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/applications")}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-450 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-slate-400">Back to Applications</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-primary flex items-center justify-center font-black text-xl shrink-0 uppercase select-none">
            {application.companyName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
              {application.companyName}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-slate-600 dark:text-slate-350 text-sm font-semibold">{application.jobTitle}</span>
              <span className="text-slate-300 dark:text-slate-700 text-sm">•</span>
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-extrabold", statusConfig[application.status])}>
                {application.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          <button
            onClick={() => navigate(`/applications/${application.id}/edit`)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="px-4 py-2 border border-red-200 dark:border-red-950/20 bg-red-500/10 text-danger hover:bg-danger hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* TWO PANEL CONTENT LAYOUT */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Main content (65% width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tabs header bar */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto select-none">
            {[
              { id: "overview", label: "Overview", icon: FileText },
              { id: "timeline", label: "Rounds Timeline", icon: Calendar },
              { id: "notes", label: "Quick Notes", icon: MessageSquare },
              { id: "ai", label: "AI Analysis", icon: Bot },
              { id: "log", label: "Activity Log", icon: Clock },
            ].map((tab) => {
              const isSelected = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs transition whitespace-nowrap cursor-pointer",
                    isSelected
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* TAB CONTENTS */}
          <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[300px]">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Date Logged
                    </span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{application.appliedDate}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> Office Location
                    </span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{application.location}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" /> Salary Package
                    </span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {application.salary 
                        ? `${application.salary.min.toLocaleString()} - ${application.salary.max.toLocaleString()} ${application.salary.currency}`
                        : "Not specified"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <Flag className="w-3.5 h-3.5" /> Priority Rating
                    </span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 capitalize">{application.priority}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Job Description Link</span>
                  {application.jobDescriptionUrl ? (
                    <a
                      href={application.jobDescriptionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      View External JD <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <p className="text-xs text-slate-450 italic">No job description URL linked.</p>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {application.tags && application.tags.length > 0 ? (
                      application.tags.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))
                    ) : (
                      <span className="text-xs text-slate-450 italic">No tags applied.</span>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Additional Notes</span>
                  <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-150 dark:border-slate-850">
                    {application.notes || "No notes captured yet. Go to edit page to append notes."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                    Interview Progress Rounds
                  </h3>
                  <Link
                    to="/interview-timeline"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
                  >
                    Manage Full Timeline <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {rounds && rounds.length > 0 ? (
                    rounds.map((round) => (
                      <div key={round.id} className="p-3.5 border rounded-xl flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-950 dark:text-white">
                            {round.roundName}
                          </h4>
                          <p className="text-[10px] text-slate-450 mt-1 capitalize font-semibold">
                            {round.roundType} · {round.platform || "Meet"}
                          </p>
                        </div>
                        <Badge variant={round.status === "completed" ? "success" : "warning"}>
                          {round.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-xs text-slate-400 font-semibold border border-dashed rounded-2xl">
                      No interview rounds logged for this application.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="space-y-6">
                <form onSubmit={handleAddNote} className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block">
                    Quick Log Note
                  </span>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={3}
                    placeholder="Enter quick notes about interviewer advice, code puzzles, or next steps..."
                    className="w-full px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isAddingNote || !noteText.trim()}
                      className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isAddingNote ? "Logging..." : "Add Note"}
                    </button>
                  </div>
                </form>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                    Log History
                  </h4>

                  {notesQuery.isLoading ? (
                    <div className="text-xs text-slate-400">Loading notes...</div>
                  ) : !notesQuery.data || notesQuery.data.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 font-semibold italic">
                      No notes logged yet.
                    </div>
                  ) : (
                    notesQuery.data.map((note) => (
                      <div key={note.id} className="p-4 bg-slate-50/50 dark:bg-slate-900/10 border rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                          <span>{note.date}</span>
                          <span className="uppercase font-extrabold text-primary">{note.roundName}</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {note.wentWell}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "ai" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-3 mb-4">
                  <Bot className="w-5 h-5 text-indigo-500 shrink-0" />
                  <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                    AI Rejection & Compatibility audit
                  </h3>
                </div>

                {!rejectionAnalysis ? (
                  <div className="text-center py-12 space-y-4">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wide">
                        No AI audit has been generated
                      </h4>
                      <p className="text-xs text-slate-450 dark:text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                        Assess CV matches against target profiles, run rejection reviews, and discover coding gaps.
                      </p>
                    </div>
                    <button
                      onClick={handleRunAI}
                      disabled={isAnalyzing}
                      className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Running AI Audit...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-violet-300 fill-violet-300" />
                          Run AI Audit
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in-up">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 text-left">
                        <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block">Compatibility Match</span>
                        <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 block mt-2">{rejectionAnalysis.matchPercent}%</span>
                      </div>
                      <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 text-left">
                        <span className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-widest block">Rejection Risk Index</span>
                        <span className="text-2xl font-black text-rose-600 dark:text-rose-400 block mt-2">{rejectionAnalysis.riskScore}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">AI Gap Assessment</h4>
                      <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed bg-slate-50 dark:bg-slate-900/10 p-3 rounded-xl border">
                        {rejectionAnalysis.reasons}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-805 dark:text-white uppercase tracking-wider">Identified Skill Gaps</h4>
                      <ul className="space-y-2">
                        {rejectionAnalysis.skillGaps.map((gap: string, idx: number) => (
                          <li key={idx} className="flex gap-2 text-xs text-slate-650 dark:text-slate-400 items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "log" && (
              <div className="space-y-6">
                <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider border-b pb-2 mb-4">
                  Audit Activity Logs
                </h3>
                <div className="space-y-4 relative pl-6">
                  <div className="absolute left-[11px] top-1 bottom-1 w-0.5 bg-slate-100 dark:bg-slate-800" />
                  
                  <div className="relative">
                    <div className="absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Application created</p>
                    <span className="text-[10px] text-slate-400">{application.appliedDate}</span>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full bg-primary" />
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Status set to: <span className="capitalize font-bold">{application.status}</span>
                    </p>
                    <span className="text-[10px] text-slate-400">{application.appliedDate}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar metadata info (35% width) */}
        <div className="space-y-6">
          {/* Quick stats details */}
          <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider border-b pb-2">
              Timeline metrics
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Rounds Completed</span>
                <span className="font-bold text-slate-850 dark:text-white">
                  {rounds ? rounds.filter((r) => r.status === "completed").length : 0} rounds
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Priority Status</span>
                <span className="capitalize font-bold text-slate-850 dark:text-white">{application.priority}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Application Method</span>
                <span className="capitalize font-bold text-slate-850 dark:text-white">{application.source}</span>
              </div>
            </div>
          </div>

          {/* Recruiter Details Card */}
          <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" /> Recruiter Contact
            </h3>
            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Recruiter Name</label>
                <input
                  value={recruiterName}
                  onChange={(e) => setRecruiterName(e.target.value)}
                  onBlur={handleUpdateContact}
                  type="text"
                  placeholder="e.g. Sneha Reddy"
                  className="w-full mt-1 px-3 py-1.5 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
                <input
                  value={recruiterEmail}
                  onChange={(e) => setRecruiterEmail(e.target.value)}
                  onBlur={handleUpdateContact}
                  type="text"
                  placeholder="e.g. sneha@google.com"
                  className="w-full mt-1 px-3 py-1.5 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent text-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Delete dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete application file?"
        description="This will permanently delete this application history and all associated files. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  )
}
export default ApplicationDetailPage
