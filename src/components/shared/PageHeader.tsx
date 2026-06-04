import React from "react"
import { cn } from "../../lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, icon, children, className }) => {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8", className)}>
      <div className="flex items-start gap-3">
        {icon && <div className="p-2.5 bg-primary/10 rounded-xl text-primary mt-1 shrink-0">{icon}</div>}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
        {children}
      </div>
    </div>
  )
}
export default PageHeader
