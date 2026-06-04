import React from "react"

export const LoadingSpinner: React.FC<{ size?: "sm" | "md" | "lg"; fullPage?: boolean }> = ({ size = "md", fullPage = false }) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3"
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-primary border-t-transparent ${sizes[size]}`}></div>
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return spinner
}
export default LoadingSpinner
