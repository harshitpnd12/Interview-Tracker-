import React, { useEffect, useState, useRef, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Search, FileText, Plus, BarChart2, Briefcase, Calendar, Award, CheckSquare, Sparkles, User, Bell, CreditCard, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useApplications } from "../../hooks/useApplications"
import { cn } from "../../lib/utils"

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  shortcut?: string
  action: () => void
  category: "Navigation" | "Quick Actions" | "Applications"
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const { applications } = useApplications()
  
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Listen for CMD+K / CTRL+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Auto-focus input when open
  useEffect(() => {
    if (isOpen) {
      setSearch("")
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Build commands list
  const commands: CommandItem[] = useMemo(() => {
    const navItems = [
      { title: "Dashboard", url: "/dashboard", icon: BarChart2 },
      { title: "Applications Tracker", url: "/applications", icon: Briefcase },
      { title: "Interview Timeline", url: "/interview-timeline", icon: Calendar },
      { title: "Interview Notes", url: "/interview-notes", icon: FileText },
      { title: "AI Rejection Analysis", url: "/ai-rejection-analysis", icon: Sparkles },
      { title: "AI Career Coach", url: "/ai-career-coach", icon: Sparkles },
      { title: "AI Mock Interview", url: "/ai-mock-interview", icon: Sparkles },
      { title: "Resume Intelligence", url: "/resume-intelligence", icon: FileText },
      { title: "Analytics Hub", url: "/analytics", icon: BarChart2 },
      { title: "Goals Board", url: "/goals", icon: Award },
      { title: "Tasks Checklist", url: "/tasks", icon: CheckSquare },
      { title: "Profile Page", url: "/profile", icon: User },
      { title: "Settings Page", url: "/settings", icon: User },
      { title: "Notifications Center", url: "/notifications", icon: Bell },
      { title: "Billing & Plans", url: "/billing", icon: CreditCard }
    ].map((item) => ({
      id: `nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`,
      title: item.title,
      subtitle: `Go to ${item.title}`,
      icon: item.icon,
      category: "Navigation" as const,
      action: () => {
        navigate(item.url)
        setIsOpen(false)
      }
    }))

    const quickActions = [
      { title: "Add Job Application", icon: Plus, url: "/applications/new", shortcut: "A" },
      { title: "Schedule New Interview", icon: Calendar, url: "/interview-timeline", shortcut: "I" },
      { title: "Start Mock Interview Session", icon: Sparkles, url: "/ai-mock-interview", shortcut: "M" },
      { title: "Create Study Goal", icon: Award, url: "/goals", shortcut: "G" }
    ].map((item) => ({
      id: `action-${item.title.toLowerCase().replace(/\s+/g, "-")}`,
      title: item.title,
      subtitle: "Quick action shortcut",
      icon: item.icon,
      shortcut: item.shortcut,
      category: "Quick Actions" as const,
      action: () => {
        navigate(item.url)
        setIsOpen(false)
      }
    }))

    const appItems = applications.slice(0, 5).map((app) => ({
      id: `app-${app.id}`,
      title: `${app.companyName} — ${app.jobTitle}`,
      subtitle: `Status: ${app.status} | Location: ${app.location}`,
      icon: Briefcase,
      category: "Applications" as const,
      action: () => {
        navigate(`/applications/${app.id}`)
        setIsOpen(false)
      }
    }))

    return [...navItems, ...quickActions, ...appItems]
  }, [applications, navigate])

  // Filter commands by search query
  const filteredCommands = useMemo(() => {
    if (!search) return commands
    const query = search.toLowerCase()
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.subtitle?.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
    )
  }, [commands, search])

  // Reset index when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  // Handle arrow keys and enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredCommands.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      filteredCommands[selectedIndex].action()
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return
    const activeEl = listRef.current.querySelector('[data-active="true"]') as HTMLElement
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" })
    }
  }, [selectedIndex])

  return (
    <>
      {/* Global toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl transition cursor-pointer shrink-0"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search...</span>
        <kbd className="inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 shadow-sm ml-1 shrink-0">
          <span>⌘</span>K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ scale: 0.97, y: -10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, y: -10, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl flex flex-col overflow-hidden relative z-10"
            >
              {/* Input container */}
              <div className="flex items-center gap-3 px-4 border-b border-slate-150 dark:border-slate-850 h-14">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  type="text"
                  placeholder="Type a command or search..."
                  className="w-full h-full bg-transparent border-0 text-sm placeholder-slate-400 text-slate-800 dark:text-white focus:ring-0 focus:outline-none"
                />
              </div>

              {/* Items List */}
              <div
                ref={listRef}
                className="max-h-[350px] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-900"
              >
                {filteredCommands.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-400 font-semibold">
                    No results found for "{search}"
                  </div>
                ) : (
                  // Group items by category
                  ["Quick Actions", "Navigation", "Applications"].map((category) => {
                    const catItems = filteredCommands.filter((c) => c.category === category)
                    if (catItems.length === 0) return null

                    return (
                      <div key={category} className="py-2 first:pt-0 last:pb-0">
                        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          {category}
                        </div>
                        <div className="space-y-0.5 mt-1">
                          {catItems.map((item) => {
                            // Find absolute index of item in global filtered list
                            const globalIndex = filteredCommands.findIndex((c) => c.id === item.id)
                            const isSelected = globalIndex === selectedIndex

                            return (
                              <div
                                key={item.id}
                                onClick={item.action}
                                data-active={isSelected}
                                className={cn(
                                  "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition",
                                  isSelected
                                    ? "bg-primary text-white"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                                )}
                              >
                                <div className="flex items-center gap-3 truncate">
                                  <item.icon className={cn("w-4 h-4 shrink-0", isSelected ? "text-white" : "text-slate-400")} />
                                  <div className="truncate">
                                    <div className="text-sm font-semibold">{item.title}</div>
                                    {item.subtitle && (
                                      <div
                                        className={cn(
                                          "text-xs truncate mt-0.5",
                                          isSelected ? "text-primary-foreground/80" : "text-slate-400"
                                        )}
                                      >
                                        {item.subtitle}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {item.shortcut && (
                                  <kbd
                                    className={cn(
                                      "text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono select-none shrink-0",
                                      isSelected
                                        ? "bg-primary-foreground/20 text-white border-primary-foreground/30"
                                        : "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700"
                                    )}
                                  >
                                    {item.shortcut}
                                  </kbd>
                                )}
                                {isSelected && (
                                  <ArrowRight className="w-3.5 h-3.5 text-white shrink-0 ml-2" />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer hint */}
              <div className="h-10 px-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-150 dark:border-slate-850 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold select-none">
                <div className="flex items-center gap-3">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>ESC Close</span>
                </div>
                <div>CMD + K toggle</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
export default CommandPalette
