import React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

export const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth()

  return (
    <footer className="py-6 border-t border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-[#0F0F13]/40 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>© {new Date().getFullYear()} InterviewIQ AI. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <Link to={isAuthenticated ? "/support" : "/help"} className="hover:text-primary transition-colors">Support</Link>
        </div>
      </div>
    </footer>
  )
}
export default Footer
