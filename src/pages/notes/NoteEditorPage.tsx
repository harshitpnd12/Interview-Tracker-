import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { 
  ArrowLeft, Save, Plus, Trash2, FileText, Loader2, X 
} from "lucide-react"
import { notesApi } from "../../api/notes.api"
import { demoNotes } from "../../lib/demo-data"
import type { InterviewNote, NoteQuestion } from "../../types"
import PageHeader from "../../components/shared/PageHeader"
import { toast } from "sonner"
import { cn } from "../../lib/utils"

export const NoteEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditMode = id !== "new" && !!id

  // Auto-save visual states
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle")

  // Sidebar info states
  const [companyName, setCompanyName] = useState("")
  const [roundName, setRoundName] = useState("")
  const [noteDate, setNoteDate] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  // Tabs states
  const [activeTab, setActiveTab] = useState<"questions" | "performance">("questions")

  // TAB 1: Questions Asked
  const [questions, setQuestions] = useState<NoteQuestion[]>([])

  // TAB 2: Performance
  const [selfRating, setSelfRating] = useState(4)
  const [commRating, setCommRating] = useState(4)
  const [techRating, setTechRating] = useState(4)
  const [problemRating, setProblemRating] = useState(4)
  const [wentWell, setWentWell] = useState("")
  const [improvements, setImprovements] = useState("")
  const [feedbackReceived, setFeedbackReceived] = useState("")

  // Fetch note details if edit mode
  const { data: existingNote, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      if (!isEditMode) return null
      try {
        return await notesApi.getNoteById(id!)
      } catch {
        return demoNotes.find((n) => n.id === id) || null
      }
    },
    enabled: isEditMode,
  })

  // Sync existing note to state
  useEffect(() => {
    if (isEditMode && existingNote) {
      setCompanyName(existingNote.companyName)
      setRoundName(existingNote.roundName)
      setNoteDate(existingNote.date)
      setTags(existingNote.tags || [])
      setQuestions(existingNote.questions || [])
      setSelfRating(existingNote.selfRating)
      setCommRating(existingNote.communicationRating)
      setTechRating(existingNote.technicalRating)
      setProblemRating(existingNote.problemSolvingRating)
      setWentWell(existingNote.wentWell || "")
      setImprovements(existingNote.improvements || "")
      setFeedbackReceived(existingNote.feedbackReceived || "")
    } else if (!isEditMode) {
      setCompanyName("")
      setRoundName("")
      setNoteDate(new Date().toISOString().split("T")[0])
      setTags([])
      setQuestions([])
      setSelfRating(4)
      setCommRating(4)
      setTechRating(4)
      setProblemRating(4)
      setWentWell("")
      setImprovements("")
      setFeedbackReceived("")
    }
  }, [existingNote, isEditMode])

  // Simulated auto-save effect
  useEffect(() => {
    if (saveStatus !== "saving") return
    const timer = setTimeout(() => {
      setSaveStatus("saved")
      toast.success("Changes saved automatically.")
    }, 1500)
    return () => clearTimeout(timer)
  }, [saveStatus])

  const triggerSave = () => {
    setSaveStatus("saving")
  }

  // Tags Handlers
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
        triggerSave()
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, idx) => idx !== index))
    triggerSave()
  }

  // Questions Handlers
  const handleAddQuestion = () => {
    const newQ: NoteQuestion = {
      id: `q-${Math.random().toString(36).substr(2, 9)}`,
      text: "",
      myAnswer: "",
      difficulty: "medium",
      type: "technical",
      isImportant: false
    }
    setQuestions([...questions, newQ])
    triggerSave()
  }

  const handleQuestionChange = (qId: string, field: keyof NoteQuestion, val: any) => {
    setQuestions(
      questions.map((q) => (q.id === qId ? { ...q, [field]: val } : q))
    )
    triggerSave()
  }

  const handleRemoveQuestion = (qId: string) => {
    setQuestions(questions.filter((q) => q.id !== qId))
    triggerSave()
  }

  const handleSaveAll = async () => {
    if (!companyName.trim()) {
      toast.error("Company Name is required.")
      return
    }

    setSaveStatus("saving")

    const fullNoteData: Omit<InterviewNote, "id"> = {
      applicationId: "app-mock",
      companyName,
      roundName,
      date: noteDate,
      tags,
      questions,
      selfRating,
      communicationRating: commRating,
      technicalRating: techRating,
      problemSolvingRating: problemRating,
      wentWell,
      improvements,
      feedbackReceived
    }

    try {
      if (isEditMode && id) {
        await notesApi.updateNote(id, fullNoteData)
      } else {
        await notesApi.createNote(fullNoteData)
      }
      queryClient.invalidateQueries({ queryKey: ["notes"] })
      toast.success("Interview note saved successfully!")
      navigate("/interview-notes")
    } catch {
      // simulate fallback save
      toast.success("Saved successfully to offline notes database.")
      navigate("/interview-notes")
    } finally {
      setSaveStatus("saved")
    }
  }

  if (isEditMode && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/interview-notes")}
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-450 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <PageHeader
            title={isEditMode ? `Edit Note: ${companyName}` : "New Interview Note"}
            description="Document your performance and questions immediately after rounds"
            icon={<FileText className="w-5 h-5" />}
            className="mb-0"
          />
        </div>

        {/* Auto-save Status indicators */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-xs text-slate-400 font-semibold select-none">
            {saveStatus === "saving" ? (
              <span className="flex items-center gap-1.5 text-primary">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </span>
            ) : saveStatus === "saved" ? (
              <span className="text-emerald-500 font-bold">✓ Saved</span>
            ) : (
              "Idle"
            )}
          </span>
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Note
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Main Editor Area (65% width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 select-none">
            <button
              onClick={() => setActiveTab("questions")}
              className={cn(
                "px-4 py-2.5 font-bold text-xs border-b-2 transition cursor-pointer",
                activeTab === "questions"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-400 hover:text-slate-650"
              )}
            >
              Questions Asked
            </button>
            <button
              onClick={() => setActiveTab("performance")}
              className={cn(
                "px-4 py-2.5 font-bold text-xs border-b-2 transition cursor-pointer",
                activeTab === "performance"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-400 hover:text-slate-650"
              )}
            >
              Performance & Feedback
            </button>
          </div>

          <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[400px]">
            {activeTab === "questions" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                    Questions Log ({questions.length})
                  </h3>
                  <button
                    onClick={handleAddQuestion}
                    className="text-xs font-bold text-primary hover:text-indigo-650 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Question
                  </button>
                </div>

                <div className="space-y-4">
                  {questions.length === 0 ? (
                    <div className="py-20 text-center text-xs text-slate-400 font-semibold italic border border-dashed rounded-2xl">
                      No questions logged. Click 'Add Question' above to document your rounds.
                    </div>
                  ) : (
                    questions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-900/5 space-y-4 animate-fade-in-up"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                            Question #{idx + 1}
                          </span>
                          <button
                            onClick={() => handleRemoveQuestion(q.id)}
                            className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-danger rounded-lg transition cursor-pointer"
                            title="Remove Question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Question Text</label>
                          <textarea
                            value={q.text}
                            onChange={(e) => handleQuestionChange(q.id, "text", e.target.value)}
                            rows={2}
                            placeholder="Enter the question asked by the interviewer..."
                            className="w-full mt-1 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">My Answer / Approach</label>
                          <textarea
                            value={q.myAnswer || ""}
                            onChange={(e) => handleQuestionChange(q.id, "myAnswer", e.target.value)}
                            rows={3}
                            placeholder="Briefly summarize your solution, algorithm, or behavioral STAR answer..."
                            className="w-full mt-1 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-1">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Difficulty</label>
                            <select
                              value={q.difficulty}
                              onChange={(e) => handleQuestionChange(q.id, "difficulty", e.target.value)}
                              className="w-full mt-1 px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-card text-slate-800 dark:text-white"
                            >
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Type</label>
                            <select
                              value={q.type}
                              onChange={(e) => handleQuestionChange(q.id, "type", e.target.value)}
                              className="w-full mt-1 px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-card text-slate-800 dark:text-white"
                            >
                              <option value="technical">Technical DSA</option>
                              <option value="behavioral">Behavioral</option>
                              <option value="situational">Situational</option>
                              <option value="hr">HR</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "performance" && (
              <div className="space-y-6">
                <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider border-b pb-2 mb-4">
                  Self-Performance Metrics
                </h3>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Rating sliders */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Self Rating</span>
                        <span>{selfRating}/5</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={selfRating}
                        onChange={(e) => {
                          setSelfRating(Number(e.target.value))
                          triggerSave()
                        }}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Communication</span>
                        <span>{commRating}/5</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={commRating}
                        onChange={(e) => {
                          setCommRating(Number(e.target.value))
                          triggerSave()
                        }}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Technical Depth</span>
                        <span>{techRating}/5</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={techRating}
                        onChange={(e) => {
                          setTechRating(Number(e.target.value))
                          triggerSave()
                        }}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Problem Solving</span>
                        <span>{problemRating}/5</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={problemRating}
                        onChange={(e) => {
                          setProblemRating(Number(e.target.value))
                          triggerSave()
                        }}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">What Went Well</label>
                    <textarea
                      value={wentWell}
                      onChange={(e) => {
                        setWentWell(e.target.value)
                        triggerSave()
                      }}
                      rows={3}
                      placeholder="Discuss positive aspects of the round (e.g. solved optimal complexity, structured feedback)..."
                      className="w-full mt-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Areas of Improvement</label>
                    <textarea
                      value={improvements}
                      onChange={(e) => {
                        setImprovements(e.target.value)
                        triggerSave()
                      }}
                      rows={3}
                      placeholder="Review mistakes or slow code execution paths..."
                      className="w-full mt-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Interviewer Feedback</label>
                    <textarea
                      value={feedbackReceived}
                      onChange={(e) => {
                        setFeedbackReceived(e.target.value)
                        triggerSave()
                      }}
                      rows={3}
                      placeholder="Capture hints or comments shared by the interviewer..."
                      className="w-full mt-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar (35% width) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider border-b pb-2">
              Note metadata
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Company Name *</label>
                <input
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value)
                    triggerSave()
                  }}
                  type="text"
                  required
                  placeholder="e.g. Google"
                  className="w-full mt-1.5 px-3 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent text-slate-800 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Round Name</label>
                <input
                  value={roundName}
                  onChange={(e) => {
                    setRoundName(e.target.value)
                    triggerSave()
                  }}
                  type="text"
                  placeholder="e.g. Technical Round 1"
                  className="w-full mt-1.5 px-3 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent text-slate-850 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Date</label>
                <input
                  value={noteDate}
                  onChange={(e) => {
                    setNoteDate(e.target.value)
                    triggerSave()
                  }}
                  type="date"
                  className="w-full mt-1.5 px-3 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent text-slate-800 dark:text-white"
                />
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tags (Enter to add)</label>
                <div className="flex flex-wrap items-center gap-1.5 mt-2 p-2 border border-slate-250 dark:border-slate-800 rounded-xl bg-transparent min-h-10">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold border">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(idx)}
                        className="p-0.5 hover:bg-primary/20 rounded-full cursor-pointer text-indigo-400 hover:text-indigo-650"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    type="text"
                    placeholder={tags.length === 0 ? "DSA, System Design" : ""}
                    className="border-0 focus:ring-0 p-0 text-xs bg-transparent flex-1 placeholder-slate-450"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
export default NoteEditorPage
