import React from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"

export const Breadcrumb: React.FC = () => {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)

  return (
    <nav className="flex items-center space-x-1.5 text-xs font-medium text-slate-505 dark:text-slate-400">
      <Link to="/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {pathnames.length > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />}
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`
        const isLast = index === pathnames.length - 1
        
        // Skip rendering id values as long ugly strings, show "Detail" or similar if UUID
        const isUuid = value.length > 10 && /\d/.test(value)
        const label = isUuid 
          ? "Detail"
          : value
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")

        return (
          <React.Fragment key={to}>
            {isLast ? (
              <span className="text-slate-800 dark:text-slate-200 truncate max-w-[150px] font-semibold">{label}</span>
            ) : (
              <>
                <Link to={to} className="hover:text-primary transition-colors truncate max-w-[150px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {label}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
              </>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
export default Breadcrumb
