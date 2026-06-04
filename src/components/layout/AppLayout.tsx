import React, { useContext } from "react"
import { Outlet, Navigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { SidebarContext } from "../../context/SidebarContext"
import { useAuth } from "../../hooks/useAuth"

export const AppLayout: React.FC = () => {
  const sidebarContext = useContext(SidebarContext)
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0F0F13] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  // Route protection
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const isCollapsed = sidebarContext?.isCollapsed ?? false

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F0F13] text-foreground flex flex-col">
      <Sidebar />
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        } ml-0`}
      >
        <Navbar />
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
export default AppLayout
