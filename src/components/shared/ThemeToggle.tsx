import React from "react"
import { useTheme } from "../../hooks/useTheme"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon } from "lucide-react"

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
      aria-label="Toggle Theme"
    >
      <div className="w-5 h-5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="moon"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              <Moon className="w-5 h-5 text-indigo-400" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              <Sun className="w-5 h-5 text-amber-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  )
}
export default ThemeToggle
