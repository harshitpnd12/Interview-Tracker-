import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "../../lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconBg?: string // e.g., "text-indigo-500 bg-indigo-500/10"
  trend?: string
  trendDirection?: "up" | "down"
  subText?: string
  loading?: boolean
  sparklineData?: number[]
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBg = "text-primary bg-primary/10",
  trend,
  trendDirection,
  subText,
  loading = false,
  sparklineData,
}) => {
  // Count-up animation for numeric values
  const numericValue = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.]/g, ""))
  const suffix = typeof value === "string" ? String(value).replace(/[0-9.]/g, "") : ""
  const isNumber = !isNaN(numericValue)

  const [displayValue, setDisplayValue] = useState<number | string>(isNumber ? 0 : value)

  useEffect(() => {
    if (!isNumber || loading) return
    let start = 0
    const end = numericValue
    if (start === end) {
      setDisplayValue(end)
      return
    }

    const duration = 800 // ms
    const increment = end > 100 ? Math.ceil(end / 20) : (end / 20)
    const stepTime = Math.max(Math.floor(duration / (end / (increment || 1))), 20)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        clearInterval(timer)
        setDisplayValue(end)
      } else {
        setDisplayValue(isNumber && end % 1 === 0 ? Math.floor(start) : parseFloat(start.toFixed(1)))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [numericValue, isNumber, loading])

  if (loading) {
    return (
      <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16 mt-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 mt-2"></div>
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide uppercase">
          {title}
        </span>
        <div className={cn("p-2.5 rounded-xl shrink-0", iconBg)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isNumber ? `${displayValue}${suffix}` : value}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        {trend && (
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border",
                trendDirection === "up"
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-danger/10 text-danger border-danger/20"
              )}
            >
              {trendDirection === "up" ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {trend}
            </span>
          </div>
        )}
        {subText && (
          <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
            {subText}
          </span>
        )}
      </div>

      {/* Sparkline overlay */}
      {sparklineData && sparklineData.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-10 opacity-30 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path
              d={`M ${sparklineData
                .map((val, idx) => `${(idx / (sparklineData.length - 1)) * 100} ${20 - (val / Math.max(...sparklineData)) * 15}`)
                .join(" L ")}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            />
          </svg>
        </div>
      )}
    </motion.div>
  )
}
export default StatsCard
