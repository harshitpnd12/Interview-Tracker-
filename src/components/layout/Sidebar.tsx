import React, { useContext } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Zap, ChevronLeft, ChevronRight, BarChart2, Briefcase, Calendar, FileText, 
  Sparkles, Bot, Mic, TrendingUp, Target, CheckSquare, 
  User, Bell, CreditCard, LogOut, Gift, HelpCircle
} from "lucide-react"
import { SidebarContext } from "../../context/SidebarContext"
import { useAuth } from "../../hooks/useAuth"
import { useNotifications } from "../../hooks/useNotifications"
import { useApplications } from "../../hooks/useApplications"
import { cn } from "../../lib/utils"

interface SidebarItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number | string
}

interface SidebarGroup {
  label: string
  items: SidebarItem[]
}

export const Sidebar: React.FC = () => {
  const sidebarContext = useContext(SidebarContext)
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const { applications } = useApplications()
  const location = useLocation()

  if (!sidebarContext) {
    throw new Error("Sidebar must be used within a SidebarProvider")
  }

  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar } = sidebarContext

  const activeApplicationsCount = applications.filter(
    (a) => !["rejected", "withdrawn", "offer"].includes(a.status)
  ).length

  // Get active tokens or fallbacks depending on plan
  const plan = user?.plan || "pro"
  const tokensUsed = user?.tokensUsed ?? (plan === "free" ? 2 : plan === "pro" ? 42 : plan === "prime" ? 185 : plan === "custom" ? 240 : 42)
  const tokensTotal = user?.tokensTotal ?? (plan === "free" ? 5 : plan === "pro" ? 100 : plan === "prime" ? 99999 : plan === "custom" ? 1000 : 100)
  const isUnlimited = plan === "prime"
  
  const tokenPercent = isUnlimited ? 100 : Math.min(100, Math.round((tokensUsed / tokensTotal) * 100))
  const tokensLeft = isUnlimited ? "Unlimited" : tokensTotal - tokensUsed
  const tokensLeftVal = typeof tokensLeft === "number" ? tokensLeft : 0
  const remainingPercent = isUnlimited ? 100 : (tokensTotal > 0 ? (tokensLeftVal / tokensTotal) * 100 : 0)
  const isLowCredits = !isUnlimited && remainingPercent < 20

  const navigationGroups: SidebarGroup[] = [
    {
      label: "Main",
      items: [
        { name: "Dashboard", path: "/dashboard", icon: BarChart2 },
        { name: "Applications", path: "/applications", icon: Briefcase, badge: activeApplicationsCount },
        { name: "Interview Timeline", path: "/interview-timeline", icon: Calendar },
        { name: "Interview Notes", path: (pathnames: string) => pathnames.startsWith("/interview-notes"), icon: FileText } as any
      ]
    },
    {
      label: "AI Tools",
      items: [
        { name: "AI Rejection Analysis", path: "/ai-rejection-analysis", icon: Sparkles },
        { name: "AI Career Coach", path: "/ai-career-coach", icon: Bot },
        { name: "AI Mock Interview", path: "/ai-mock-interview", icon: Mic },
        { name: "Resume Intelligence", path: "/resume-intelligence", icon: FileText }
      ]
    },
    {
      label: "Insights",
      items: [
        { name: "Analytics", path: "/analytics", icon: TrendingUp },
        { name: "Goals", path: "/goals", icon: Target },
        { name: "Tasks", path: "/tasks", icon: CheckSquare, badge: 6 } // mockup task counts
      ]
    },
    {
      label: "Account",
      items: [
        { name: "Profile", path: "/profile", icon: User },
        { name: "Notifications", path: "/notifications", icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
        { name: "Refer & Earn", path: "/referrals", icon: Gift },
        { name: "Billing", path: "/billing", icon: CreditCard },
        { name: "Support Hub", path: "/support", icon: HelpCircle }
      ]
    }
  ]

  const checkIsActive = (path: string | ((p: string) => boolean)) => {
    if (typeof path === "function") {
      return path(location.pathname)
    }
    return location.pathname.startsWith(path)
  }

  // Sidebar contents
  const sidebarContent = (
    <div className="h-full flex flex-col justify-between select-none">
      {/* Top Header / Logo */}
      <div>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-2 bg-indigo-500 rounded-xl text-white flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-1.5"
              >
                <span className="font-extrabold text-white text-base tracking-tight">
                  InterviewIQ
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                  AI
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-h-[calc(100vh-140px)]">
          {navigationGroups.map((group) => (
            <div key={group.label} className="space-y-1.5">
              {!isCollapsed && (
                <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  {group.label}
                </span>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = checkIsActive(item.path)
                  const itemPath = typeof item.path === "function" ? "/interview-notes" : item.path

                  return (
                    <NavLink
                      key={item.name}
                      to={itemPath}
                      onClick={closeMobileSidebar}
                      className={() =>
                        cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition group relative overflow-hidden",
                          isActive
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 hover:translate-x-0.5"
                        )
                      }
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-white rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                      
                      {/* Collapsed Tooltip */}
                      {isCollapsed && (
                        <div className="absolute left-16 scale-0 group-hover:scale-100 transition-transform origin-left bg-slate-950 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xl z-50 pointer-events-none whitespace-nowrap border border-slate-800">
                          {item.name}
                          {item.badge && ` (${item.badge})`}
                        </div>
                      )}

                      {/* Item Badge */}
                      {!isCollapsed && item.badge !== undefined && (
                        <span className="ml-auto text-[10px] font-extrabold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile Section */}
      <div className="border-t border-slate-800 p-4 shrink-0 bg-slate-900/60 backdrop-blur-sm">
        {/* AI Tokens Usage Card */}
        {!isCollapsed && (
          <div className="mb-4 -mt-2.5 bg-slate-950/40 border border-slate-850 rounded-xl p-3 text-left">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-violet-400" />
                AI Prep Tokens
              </span>
              <span className={cn("text-white", isLowCredits && "text-red-400 font-extrabold")}>
                {isUnlimited ? "Unlimited" : `${tokensUsed}/${tokensTotal}`}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isUnlimited 
                    ? "bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 animate-pulse" 
                    : isLowCredits 
                      ? "bg-gradient-to-r from-red-500 to-rose-500 animate-pulse" 
                      : "bg-indigo-500"
                )}
                style={{ width: `${tokenPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className={cn("text-[9px] font-bold", isLowCredits ? "text-red-400 animate-pulse" : "text-slate-500")}>
                {isUnlimited ? "Active Prime Plan" : isLowCredits ? "⚠️ Low Credit! Recharge" : `${tokensLeft} tokens left`}
              </span>
              {!isUnlimited && (
                <NavLink
                  to="/billing/upgrade"
                  className={cn(
                    "text-[9px] font-extrabold transition",
                    isLowCredits ? "text-red-450 hover:text-red-400" : "text-indigo-400 hover:text-indigo-305"
                  )}
                >
                  {isLowCredits ? "Recharge →" : "Upgrade →"}
                </NavLink>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-full bg-indigo-600 border border-slate-700 flex items-center justify-center font-bold text-white shrink-0 text-sm">
              {user?.name.split(" ").map((n) => n[0]).join("") || "US"}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate leading-snug">
                  {user?.name || "Arjun Sharma"}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full uppercase">
                    {user?.plan || "pro"}
                  </span>
                </div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed Toggle Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={toggleSidebar}
            className="hidden md:flex p-1.5 border border-slate-800 bg-slate-950 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Sidebar persistent on desktop) */}
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col fixed top-0 bottom-0 left-0 bg-slate-900 border-r border-slate-800 z-30 overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Drawer (Mobile responsive overlay) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileSidebar}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            {/* Sidebar drawer panel */}
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-[260px] max-w-[260px] bg-slate-900 h-full border-r border-slate-800 flex flex-col z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
export default Sidebar
