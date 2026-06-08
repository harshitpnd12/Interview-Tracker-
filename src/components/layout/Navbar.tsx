import React, { useContext, useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, Bell, User, Settings, CreditCard, LogOut, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SidebarContext } from "../../context/SidebarContext"
import { useAuth } from "../../hooks/useAuth"
import { useNotifications } from "../../hooks/useNotifications"
import ThemeToggle from "../shared/ThemeToggle"
import Breadcrumb from "../shared/Breadcrumb"
import CommandPalette from "../shared/CommandPalette"
import Badge from "../shared/Badge"

export const Navbar: React.FC = () => {
  const sidebarContext = useContext(SidebarContext)
  const { user, logout } = useAuth()
  const { notifications, unreadCount, markAsRead } = useNotifications()
  const navigate = useNavigate()

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false)
  
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notifMenuRef = useRef<HTMLDivElement>(null)

  if (!sidebarContext) {
    throw new Error("Navbar must be used within a SidebarProvider")
  }

  const { toggleMobileSidebar } = sidebarContext

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false)
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(target)) {
        setIsNotifMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  const handleSignOut = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-white/80 dark:bg-[#0F0F13]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-6">
      {/* Left Area */}
      <div className="flex items-center gap-4">
        {/* Hamburger Toggler */}
        <button
          onClick={toggleMobileSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 md:hidden cursor-pointer"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Breadcrumb */}
        <div className="hidden md:block">
          <Breadcrumb />
        </div>

        {/* Mobile Header Logo */}
        <div className="md:hidden flex items-center gap-1.5 select-none">
          <span className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight">
            InterviewIQ
          </span>
          <span className="text-[9px] font-bold px-1 bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 rounded border border-indigo-500/20">
            AI
          </span>
        </div>
      </div>

      {/* Right Area */}
      <div className="flex items-center gap-3">
        {/* Command Palette Search Trigger */}
        <CommandPalette />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications Alert Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse-ring ring-4 ring-indigo-500/10" />
            )}
          </button>

          <AnimatePresence>
            {isNotifMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 p-2"
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <span>Recent Notifications</span>
                  {unreadCount > 0 && <Badge variant="primary">{unreadCount} Unread</Badge>}
                </div>
                
                <div className="max-h-64 overflow-y-auto py-1 divide-y divide-slate-50 dark:divide-slate-900">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 font-semibold">
                      All caught up! No notifications.
                    </div>
                  ) : (
                    notifications.slice(0, 4).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id)
                          if (notif.actionUrl) {
                            navigate(notif.actionUrl)
                            setIsNotifMenuOpen(false)
                          }
                        }}
                        className={`p-3 text-left rounded-xl transition cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                          !notif.isRead ? "bg-primary/5 dark:bg-primary/10" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 shrink-0 text-primary">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {notif.title}
                            </div>
                            <div className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5 leading-relaxed">
                              {notif.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <Link
                  to="/notifications"
                  onClick={() => setIsNotifMenuOpen(false)}
                  className="block text-center py-2.5 text-xs font-bold text-primary hover:text-indigo-600 border-t border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-b-xl"
                >
                  View All Notifications
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Settings Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-full border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 font-bold text-white flex items-center justify-center text-xs shrink-0">
              {user?.name.split(" ").map((n) => n[0]).join("") || "US"}
            </div>
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-card border border-slate-250 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 p-1.5"
              >
                {/* Header detail */}
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="text-sm font-bold text-slate-850 dark:text-white truncate">
                    {user?.name || "Arjun Sharma"}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {user?.email || "arjun.sharma@gmail.com"}
                  </div>
                  <div className="mt-1.5 flex">
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full uppercase">
                      {user?.plan || "pro"} Plan
                    </span>
                  </div>
                </div>

                {/* Navigation items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate("/profile")
                      setIsUserMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-left cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-400 dark:text-slate-300" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings")
                      setIsUserMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-left cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-400 dark:text-slate-300" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      navigate("/billing")
                      setIsUserMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-left cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-slate-400 dark:text-slate-300" />
                    Billing & Plan
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-500 hover:text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
export default Navbar
