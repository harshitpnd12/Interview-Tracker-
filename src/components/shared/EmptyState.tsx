import React from "react"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  ctaLabel?: string
  ctaAction?: () => void
  secondaryLabel?: string
  secondaryAction?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaAction,
  secondaryLabel,
  secondaryAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/10 rounded-2xl"
    >
      <div className="p-4 bg-primary/10 text-primary rounded-2xl mb-4 shrink-0">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mt-2 leading-relaxed">
        {description}
      </p>
      
      {(ctaLabel || secondaryLabel) && (
        <div className="flex items-center gap-3 mt-6">
          {secondaryLabel && secondaryAction && (
            <button
              onClick={secondaryAction}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {secondaryLabel}
            </button>
          )}
          {ctaLabel && ctaAction && (
            <button
              onClick={ctaAction}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold shadow-md transition cursor-pointer"
            >
              {ctaLabel}
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
export default EmptyState
