import React from "react"
import { Outlet } from "react-router-dom"
import { motion } from "framer-motion"
import { Zap, CheckCircle2, Award, TrendingUp, Users } from "lucide-react"

export const AuthLayout: React.FC = () => {
  const highlights = [
    { text: "AI Mock Interviews", desc: "Practice speech & code with real-time scoring" },
    { text: "Rejection Analysis", desc: "Identify skill gaps and resume misalignment automatically" },
    { text: "Career Roadmap Integration", desc: "Establish goals, track timelines, and unlock notifications" }
  ]

  const stats = [
    { label: "12,000+ Users", icon: Users, delay: 0.1 },
    { label: "87% Success Rate", icon: TrendingUp, delay: 0.2 },
    { label: "AI Powered Coaching", icon: Award, delay: 0.3 }
  ]

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0F0F13] overflow-hidden">
      {/* Left Panel: Desktop visual branding (45% width) */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 flex-col justify-between p-12 text-white overflow-hidden shrink-0">
        
        {/* SVG geometric background pattern overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating background blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-45 -right-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="flex items-center gap-2.5 z-10 select-none">
          <div className="p-2.5 bg-white/10 rounded-xl text-white flex items-center justify-center shrink-0 border border-white/15">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
            InterviewIQ <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/15 text-white rounded border border-white/20">AI</span>
          </span>
        </div>

        {/* Quotes & Highlights */}
        <div className="z-10 my-auto space-y-8 max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight">
              Your Career Journey Starts Here.
            </h2>
            <p className="text-indigo-200 text-sm mt-3 leading-relaxed">
              Supercharge your preparation, analyze application outcomes, and coach yourself to land SDE-2 roles.
            </p>
          </motion.div>

          <div className="space-y-4">
            {highlights.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                className="flex gap-3 items-start"
              >
                <div className="p-1 bg-white/10 text-white rounded-lg shrink-0 border border-white/10 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 fill-none" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.text}</h4>
                  <p className="text-xs text-indigo-200 mt-0.5 leading-normal">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating Stat badges */}
        <div className="z-10 grid grid-cols-3 gap-3">
          {stats.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: item.delay }}
              className="bg-white/10 border border-white/10 backdrop-blur-md rounded-xl p-3 flex flex-col justify-between h-20 shadow-lg text-left"
            >
              <item.icon className="w-4 h-4 text-indigo-300" />
              <span className="text-[10px] font-extrabold text-white leading-normal truncate">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Panel: Content Card (55% width on desktop, 100% on mobile) */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="none" />
            <path d="M0 0 L100 100" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        {/* Auth form card wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8 relative"
        >
          {/* Logo visible only on mobile */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6 select-none">
            <div className="p-2 bg-indigo-600 rounded-xl text-white flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              InterviewIQ <span className="text-[9px] font-bold px-1.2 py-0.2 bg-primary/10 text-primary rounded border border-primary/20">AI</span>
            </span>
          </div>

          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
export default AuthLayout
