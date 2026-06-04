import React, { createContext, useState, useEffect } from "react"

interface SidebarContextType {
  isCollapsed: boolean
  isMobileOpen: boolean
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar_collapsed")
    return saved === "true"
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem("sidebar_collapsed", String(next))
      return next
    })
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev)
  }

  const closeMobileSidebar = () => {
    setIsMobileOpen(false)
  }

  // Close mobile sidebar on window resize if resolution becomes desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        toggleSidebar,
        toggleMobileSidebar,
        closeMobileSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
