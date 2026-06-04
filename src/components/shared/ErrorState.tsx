import React from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to load data",
  description = "Something went wrong while retrieving the requested records.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-red-200/30 dark:border-red-900/20 bg-red-50/20 dark:bg-red-950/5 rounded-2xl max-w-md mx-auto text-center my-6">
      <div className="p-3 bg-red-100 dark:bg-red-900/20 text-danger rounded-xl mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 flex items-center gap-2 px-4 py-2 bg-danger hover:bg-danger/90 text-white rounded-xl text-sm font-semibold transition shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  )
}
export default ErrorState
