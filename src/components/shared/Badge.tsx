import React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "muted" | "outline"
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "primary", className, ...props }) => {
  const variants = {
    primary: "bg-primary/15 text-primary border-primary/20",
    secondary: "bg-secondary/15 text-secondary border-secondary/20",
    success: "bg-success/15 text-success border-success/20",
    warning: "bg-warning/15 text-warning border-warning/20",
    danger: "bg-danger/15 text-danger border-danger/20",
    muted: "bg-slate-100 text-slate-700 dark:bg-slate-850 dark:text-slate-300 border-slate-200 dark:border-slate-800",
    outline: "bg-transparent text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
export default Badge
