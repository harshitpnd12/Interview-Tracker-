import React from "react"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

// Layouts
import MarketingLayout from "./components/layout/MarketingLayout"
import AuthLayout from "./components/layout/AuthLayout"
import AppLayout from "./components/layout/AppLayout"
import AdminLayout from "./components/layout/AdminLayout"

// Pages
import LandingPage from "./pages/landing/LandingPage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"

import DashboardPage from "./pages/dashboard/DashboardPage"
import ApplicationsPage from "./pages/applications/ApplicationsPage"
import ApplicationDetailPage from "./pages/applications/ApplicationDetailPage"
import AddEditApplicationPage from "./pages/applications/AddEditApplicationPage"

import InterviewTimelinePage from "./pages/interviews/InterviewTimelinePage"
import InterviewTimelineDetailPage from "./pages/interviews/InterviewTimelineDetailPage"

import NotesPage from "./pages/notes/NotesPage"
import NoteEditorPage from "./pages/notes/NoteEditorPage"

import RejectionAnalysisPage from "./pages/ai/RejectionAnalysisPage"
import CareerCoachPage from "./pages/ai/CareerCoachPage"
import MockInterviewPage from "./pages/ai/MockInterviewPage"
import MockInterviewSessionPage from "./pages/ai/MockInterviewSessionPage"
import MockInterviewResultsPage from "./pages/ai/MockInterviewResultsPage"

import ResumeIntelligencePage from "./pages/resume/ResumeIntelligencePage"
import AnalyticsPage from "./pages/analytics/AnalyticsPage"
import GoalsPage from "./pages/goals/GoalsPage"
import TasksPage from "./pages/tasks/TasksPage"


import NotificationsPage from "./pages/notifications/NotificationsPage"

import ProfilePage from "./pages/profile/ProfilePage"
import SettingsPage from "./pages/profile/SettingsPage"
import BillingPage from "./pages/billing/BillingPage"
import UpgradePage from "./pages/billing/UpgradePage"

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage"
import AdminUsersPage from "./pages/admin/AdminUsersPage"
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage"
import AdminReportsPage from "./pages/admin/AdminReportsPage"
import AdminSubscriptionsPage from "./pages/admin/AdminSubscriptionsPage"

// Animated Page wrapper
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    path: "/",
    element: <MarketingLayout />,
    children: [
      { index: true, element: <PageWrapper><LandingPage /></PageWrapper> }
    ]
  },
  
  // AUTH ROUTES
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <PageWrapper><LoginPage /></PageWrapper> },
      { path: "register", element: <PageWrapper><RegisterPage /></PageWrapper> },
      { path: "forgot-password", element: <PageWrapper><ForgotPasswordPage /></PageWrapper> },
      { path: "reset-password", element: <PageWrapper><ResetPasswordPage /></PageWrapper> }
    ]
  },

  // LIVE MOCK INTERVIEW SESSION (no sidebar)
  {
    path: "/ai-mock-interview/session",
    element: <MockInterviewSessionPage />
  },

  // PROTECTED CANDIDATE WORKSPACE
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "dashboard", element: <PageWrapper><DashboardPage /></PageWrapper> },
      { path: "applications", element: <PageWrapper><ApplicationsPage /></PageWrapper> },
      { path: "applications/new", element: <PageWrapper><AddEditApplicationPage /></PageWrapper> },
      { path: "applications/:id", element: <PageWrapper><ApplicationDetailPage /></PageWrapper> },
      { path: "applications/:id/edit", element: <PageWrapper><AddEditApplicationPage /></PageWrapper> },
      { path: "interview-timeline", element: <PageWrapper><InterviewTimelinePage /></PageWrapper> },
      { path: "interview-timeline/:id", element: <PageWrapper><InterviewTimelineDetailPage /></PageWrapper> },
      { path: "interview-notes", element: <PageWrapper><NotesPage /></PageWrapper> },
      { path: "interview-notes/new", element: <PageWrapper><NoteEditorPage /></PageWrapper> },
      { path: "interview-notes/:id", element: <PageWrapper><NoteEditorPage /></PageWrapper> },
      { path: "ai-rejection-analysis", element: <PageWrapper><RejectionAnalysisPage /></PageWrapper> },
      { path: "ai-career-coach", element: <PageWrapper><CareerCoachPage /></PageWrapper> },
      { path: "ai-mock-interview", element: <PageWrapper><MockInterviewPage /></PageWrapper> },
      { path: "ai-mock-interview/results/:id", element: <PageWrapper><MockInterviewResultsPage /></PageWrapper> },
      { path: "resume-intelligence", element: <PageWrapper><ResumeIntelligencePage /></PageWrapper> },
      { path: "analytics", element: <PageWrapper><AnalyticsPage /></PageWrapper> },
      { path: "goals", element: <PageWrapper><GoalsPage /></PageWrapper> },
      { path: "tasks", element: <PageWrapper><TasksPage /></PageWrapper> },

      { path: "notifications", element: <PageWrapper><NotificationsPage /></PageWrapper> },
      { path: "profile", element: <PageWrapper><ProfilePage /></PageWrapper> },
      { path: "settings", element: <PageWrapper><SettingsPage /></PageWrapper> },
      { path: "billing", element: <PageWrapper><BillingPage /></PageWrapper> },
      { path: "billing/upgrade", element: <PageWrapper><UpgradePage /></PageWrapper> }
    ]
  },

  // PROTECTED ADMIN PANEL
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <PageWrapper><AdminDashboardPage /></PageWrapper> },
      { path: "users", element: <PageWrapper><AdminUsersPage /></PageWrapper> },
      { path: "analytics", element: <PageWrapper><AdminAnalyticsPage /></PageWrapper> },
      { path: "reports", element: <PageWrapper><AdminReportsPage /></PageWrapper> },
      { path: "subscriptions", element: <PageWrapper><AdminSubscriptionsPage /></PageWrapper> }
    ]
  },

  // Catch all redirect
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />
  }
])

export const App: React.FC = () => {
  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  )
}
export default App
