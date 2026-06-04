import React, { useState } from "react"
import { Bot, Send, User, Target, BookOpen, CheckCircle2 } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"
import { demoUser } from "../../lib/demo-data"
import { toast } from "sonner"
import { cn } from "../../lib/utils"

export const CareerCoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: "coach" | "user"; text: string; time: string }>>([
    {
      role: "coach",
      text: "Hello Arjun! I've loaded your profile details. You're targeting SDE-2 Backend roles at Google, Microsoft, and Razorpay. I've designed a custom 4-week study plan focusing on System Design (CDNs, DB replication) and DSA trees/graphs. What topic should we study first?",
      time: "10:30 AM"
    }
  ])
  const [inputText, setInputText] = useState("")

  const [studyPlan, setStudyPlan] = useState([
    { id: "sp-1", title: "Review Graph Traversals (DFS/BFS)", completed: true, week: "Week 1" },
    { id: "sp-2", title: "Implement LRU Cache & Rate Limiters", completed: false, week: "Week 1" },
    { id: "sp-3", title: "Study Database Sharding & Indexing", completed: false, week: "Week 2" },
    { id: "sp-4", title: "Practice 15 Tree/DP LeetCode problems", completed: false, week: "Week 3" },
    { id: "sp-5", title: "Design Twitter / System Architecture", completed: false, week: "Week 4" }
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const userMsg = {
      role: "user" as const,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, userMsg])
    setInputText("")

    // Simulated coach typing
    setTimeout(() => {
      let replyText = "That's a vital topic for Google L4 rounds. I recommend starting with the basic rate limiting algorithms (Token Bucket & Leaking Bucket). Would you like me to outline a sample code template in Node.js?"
      if (inputText.toLowerCase().includes("system design") || inputText.toLowerCase().includes("sharding")) {
        replyText = "For high-scale systems, sharding distributes DB write loads. Microsoft and Google ask deep questions about Consistent Hashing. We should review that first!"
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: "coach",
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    }, 1000)
  }

  const handleToggleStudyItem = (id: string) => {
    setStudyPlan((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    )
    toast.success("Study plan progress updated!")
  }

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="AI Career Coach"
        description="Interact with your personal AI tutor to schedule study plans and practice systems questions"
        icon={<Bot className="w-5 h-5" />}
      />

      <div className="grid lg:grid-cols-10 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Left Panel: Study Plan (40% width) */}
        <div className="lg:col-span-4 bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="space-y-5 overflow-y-auto flex-grow pr-1">
            <div className="flex items-center gap-2 border-b pb-3">
              <BookOpen className="w-4 h-4 text-primary shrink-0" />
              <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">
                My Personalized Study Roadmap
              </h3>
            </div>

            <div className="space-y-4">
              {studyPlan.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleStudyItem(item.id)}
                  className="p-3 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-100/50 dark:hover:bg-slate-800/20 border border-slate-150 dark:border-slate-850 rounded-xl flex items-center justify-between gap-4 transition cursor-pointer"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      readOnly
                      className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer mt-0.5"
                    />
                    <div className="min-w-0">
                      <span
                        className={cn(
                          "text-xs font-semibold leading-normal block truncate pr-2",
                          item.completed ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-350"
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{item.week}</span>
                    </div>
                  </div>
                  {item.completed && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Goals Target details */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> Target Profile
            </span>
            <div className="mt-2 text-xs space-y-1 text-slate-650 dark:text-slate-400">
              <p>
                Role: <span className="font-bold text-slate-800 dark:text-white">{demoUser.targetRole}</span>
              </p>
              <p>
                Companies:{" "}
                <span className="font-bold text-slate-800 dark:text-white">
                  {demoUser.targetCompanies?.join(", ")}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Chat interface (60% width) */}
        <div className="lg:col-span-6 bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col justify-between overflow-hidden">
          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[calc(100vh-320px)] min-h-[250px]">
            {messages.map((msg, idx) => {
              const isCoach = msg.role === "coach"
              return (
                <div
                  key={idx}
                  className={cn("flex gap-3 max-w-[85%]", isCoach ? "mr-auto text-left" : "ml-auto flex-row-reverse text-right")}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs select-none",
                      isCoach ? "bg-indigo-500/10 text-primary border" : "bg-primary text-white"
                    )}
                  >
                    {isCoach ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div
                      className={cn(
                        "p-3 rounded-2xl text-xs leading-relaxed",
                        isCoach
                          ? "bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-slate-800 dark:text-slate-200"
                          : "bg-primary text-white text-left"
                      )}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold block">{msg.time}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Form Message input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-150 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-900/10 flex items-center gap-3">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              type="text"
              placeholder="Ask anything about coding rounds, system design patterns, or negotiation..."
              className="w-full px-4 py-3 bg-white dark:bg-card border border-slate-250 dark:border-slate-800 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <button
              type="submit"
              className="p-3 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default CareerCoachPage
