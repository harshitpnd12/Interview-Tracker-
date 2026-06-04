import React, { useContext, useEffect } from "react"
import { Outlet, Navigate, useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { SidebarContext } from "../../context/SidebarContext"
import { useAuth } from "../../hooks/useAuth"
import { toast } from "sonner"

export const AdminLayout: React.FC = () => {
  const sidebarContext = useContext(SidebarContext)
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== "admin") {
      toast.error("Access Denied", {
        description: "You do not have administrative privileges to view that page.",
      })
      navigate("/dashboard")
    }
  }, [user, isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0F0F13] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />
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
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider mb-6 select-none flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Admin Panel Security Guard Active
          </div>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
export default AdminLayout
