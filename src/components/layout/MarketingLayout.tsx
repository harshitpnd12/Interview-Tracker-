import React from "react"
import { Outlet, Link } from "react-router-dom"
import { Zap } from "lucide-react"
import ThemeToggle from "../shared/ThemeToggle"
import Footer from "./Footer"

export const MarketingLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F0F13] flex flex-col">
      {/* Marketing Navbar */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-[#0f0f13]/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 select-none">
            <div className="p-2 bg-indigo-600 rounded-xl text-white flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              InterviewIQ <span className="text-[9px] font-bold px-1.2 py-0.2 bg-primary/10 text-primary rounded border border-primary/20">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white transition cursor-pointer"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-bold px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md transition cursor-pointer"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
export default MarketingLayout
