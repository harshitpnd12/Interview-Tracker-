import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Mic, Video, Send, Loader2, LogOut, CheckCircle, Clock } from "lucide-react"
import { toast } from "sonner"
import { cn } from "../../lib/utils"

export const MockInterviewSessionPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const config = location.state || { type: "technical", difficulty: "mid", targetCompany: "Google" }

  // Session timer
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [inputText, setInputText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const questionsList = React.useMemo(() => {
    if (config.type === "sql") {
      return [
        "Given a schema with Users and Transactions, write an SQL query to retrieve users who spent more than $500 total in the last 30 days.",
        "How would you optimize this query for index scanning if the transactions table has 50 million rows?"
      ]
    }
    if (config.type === "system-design") {
      return [
        "Design a high-scale URL shortening service like Bit.ly. Focus on consistent hashing and CDN layer specifications.",
        "How would you handle analytics count synchronization when shortened links are clicked concurrently?"
      ]
    }
    if (config.type === "behavioral") {
      return [
        "Tell me about a time you had to handle a critical backend bug in a production environment under pressure.",
        "How did you align the team and communicate with stakeholders during the outage?"
      ]
    }
    return [
      "Let's write a function to detect a cycle in a directed graph. First, discuss your algorithm and its time complexity.",
      "Now, implement the solution and discuss handling recursive depth calls."
    ]
  }, [config.type])

  const [dialogue, setDialogue] = useState<Array<{ role: "interviewer" | "candidate"; text: string }>>([
    {
      role: "interviewer",
      text: `Hello Arjun. Welcome to your ${config.difficulty} ${config.type} round targeting ${config.targetCompany || "General Tech"}. Here is your first question: ${questionsList[0]}`
    }
  ])

  // Timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleFinishSession()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const candidateMsg = { role: "candidate" as const, text: inputText }
    setDialogue((prev) => [...prev, candidateMsg])
    setInputText("")

    // Simulated interviewer response
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      if (currentQuestionIndex + 1 < questionsList.length) {
        const nextIdx = currentQuestionIndex + 1
        setCurrentQuestionIndex(nextIdx)
        setDialogue((prev) => [
          ...prev,
          {
            role: "interviewer",
            text: `Got it. That makes sense. Let's move to the next question: ${questionsList[nextIdx]}`
          }
        ])
      } else {
        setDialogue((prev) => [
          ...prev,
          {
            role: "interviewer",
            text: "Excellent. I have logged your responses. We are complete with our questions. Click 'Submit & End Session' below to fetch your AI feedback."
          }
        ])
      }
    }, 1200)
  }

  const handleFinishSession = () => {
    toast.success("Submitting mock responses for evaluation...")
    // Navigate to results page with mock ID
    navigate("/ai-mock-interview/results/mis-001")
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between select-none">
      {/* Session Header */}
      <header className="h-16 px-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Live AI Session: {config.type} ({config.difficulty})
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 font-mono text-sm bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-primary" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => navigate("/ai-mock-interview")}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
            title="Force Quit Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Room Arena */}
      <div className="flex-1 grid lg:grid-cols-10 overflow-hidden min-h-[400px]">
        {/* Left Side: Dialogue feed (60% width) */}
        <div className="lg:col-span-6 flex flex-col justify-between border-r border-slate-800/80 bg-slate-950/20">
          <div className="flex-grow p-6 overflow-y-auto space-y-4 max-h-[calc(100vh-220px)]">
            {dialogue.map((msg, idx) => {
              const isInterviewer = msg.role === "interviewer"
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    isInterviewer ? "mr-auto text-left" : "ml-auto flex-row-reverse text-left"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0",
                      isInterviewer ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-primary text-white"
                    )}
                  >
                    {isInterviewer ? "AI" : "ME"}
                  </div>
                  <div
                    className={cn(
                      "p-3.5 rounded-2xl text-xs leading-relaxed",
                      isInterviewer ? "bg-slate-900 border border-slate-800 text-slate-200" : "bg-primary text-white"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              )
            })}

            {isSubmitting && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold p-2 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Interviewer is typing...
              </div>
            )}
          </div>

          {/* Typing input */}
          <form onSubmit={handleSendResponse} className="p-4 border-t border-slate-800/80 bg-slate-950 flex items-center gap-3 shrink-0">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              type="text"
              placeholder="Type your coding approach or voice transcript response..."
              className="w-full px-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-500"
            />
            <button
              type="submit"
              className="p-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg transition cursor-pointer"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>

        {/* Right Side: Media feed & Audio waves (40% width) */}
        <div className="lg:col-span-4 p-6 bg-slate-900/60 flex flex-col justify-between gap-6 overflow-hidden">
          
          {/* Mock Camera Feed container */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden aspect-video flex flex-col justify-center items-center relative shadow-inner group">
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-slate-900/85 px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-bold">
              <Video className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
              <span>Camera active</span>
            </div>
            <div className="text-center space-y-2 select-none pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 mx-auto text-slate-500 font-bold text-sm">
                AS
              </div>
              <p className="text-[10px] text-slate-500 font-bold">Candidate Feed Video Out</p>
            </div>
          </div>

          {/* Simulated Speech sound wave container */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4 relative shadow-inner">
            <div className="flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-indigo-400 animate-pulse shrink-0" />
              <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest">
                Microphone Audio Waves
              </span>
            </div>
            
            {/* Audio Waves bars */}
            <div className="flex items-end justify-center gap-1.5 h-16 pt-2">
              {[2, 5, 8, 4, 10, 6, 2, 7, 3, 9, 5, 8, 4, 2, 6, 3].map((val, idx) => (
                <motion.div
                  key={idx}
                  animate={{ height: [val * 4, val * 6, val * 3, val * 4] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: idx * 0.08 }}
                  className="w-1 bg-indigo-500 rounded-full"
                />
              ))}
            </div>
          </div>

          {/* End session control */}
          <button
            onClick={handleFinishSession}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-705 text-white font-black text-xs rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4 fill-white" />
            Submit & End Session
          </button>
        </div>
      </div>
    </div>
  )
}
export default MockInterviewSessionPage
