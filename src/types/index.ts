export interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  plan: "free" | "pro" | "prime" | "custom" | "enterprise"
  role: "user" | "admin"
  joinDate: string
  targetRole?: string
  targetCompanies?: string[]
  skills?: string[]
  location?: string
  linkedin?: string
  github?: string
  portfolio?: string
  bio?: string
  tokensUsed?: number
  tokensTotal?: number
}

export interface Application {
  id: string
  companyName: string
  companyLogo?: string
  jobTitle: string
  location: string
  jobType: "full-time" | "part-time" | "internship" | "contract"
  status: "applied" | "under-review" | "phone-screen" | "technical" 
          | "hr-round" | "final-round" | "offer" | "rejected" | "withdrawn"
          | "aptitude" | "correspond"
  priority: "high" | "medium" | "low"
  appliedDate: string
  salary?: { min: number; max: number; currency: string }
  source: "linkedin" | "naukri" | "company-site" | "referral" | "other"
  notes?: string
  tags?: string[]
  recruiterName?: string
  recruiterEmail?: string
  nextFollowUp?: string
  resumeUsed?: string
  jobDescriptionUrl?: string
  resumePdf?: string
  jdText?: string
}

export interface InterviewRound {
  id: string
  applicationId: string
  roundName: string
  roundType: "online-assessment" | "technical" | "system-design" 
             | "behavioral" | "hr" | "case-study" | "group-discussion"
  status: "scheduled" | "completed" | "cancelled" | "pending"
  date?: string
  duration?: number
  platform?: string
  interviewerName?: string
  selfRating?: number
  result?: "cleared" | "rejected" | "waiting"
  feedback?: string
}

export interface NoteQuestion {
  id: string
  text: string
  myAnswer?: string
  difficulty: "easy" | "medium" | "hard"
  type: "technical" | "behavioral" | "situational" | "hr" | "case"
  isImportant: boolean
}

export interface InterviewNote {
  id: string
  applicationId: string
  companyName: string
  roundName: string
  date: string
  questions: NoteQuestion[]
  selfRating: number
  communicationRating: number
  technicalRating: number
  problemSolvingRating: number
  wentWell?: string
  improvements?: string
  feedbackReceived?: string
  learningTopics?: string[]
  tags?: string[]
}

export interface Goal {
  id: string
  title: string
  description?: string
  category: "job-search" | "interview-prep" | "technical" | "career" | "personal"
  type: "numeric" | "boolean" | "streak"
  targetValue?: number
  currentValue?: number
  unit?: string
  frequency: "daily" | "weekly" | "monthly" | "custom"
  deadline?: string
  status: "active" | "completed" | "overdue" | "paused"
  streak?: number
}

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description?: string
  category: "interview-prep" | "application" | "study" | "research" | "admin" | "personal"
  priority: "high" | "medium" | "low"
  dueDate?: string
  dueTime?: string
  completed: boolean
  completedAt?: string
  isAISuggested: boolean
  estimatedMinutes?: number
  linkedApplicationId?: string
  linkedGoalId?: string
  subTasks?: SubTask[]
  repeat?: "none" | "daily" | "weekly" | "weekdays"
}

export interface Notification {
  id: string
  type: "interview-reminder" | "ai-insight" | "application-update" 
        | "goal-alert" | "achievement" | "mock-interview" | "resume" 
        | "system" | "billing" | "streak"
  title: string
  description: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
  actionLabel?: string
}

export interface Company {
  id: string
  name: string
  industry: string
  size: string
  hqLocation: string
  website?: string
  glassdoorRating?: number
  interviewDifficulty: number // 1-5
  avgProcessDuration: string
  avgRounds: number
  topRoles?: string[]
  interviewStyle?: string
  tags?: string[]
  interviewProcess?: { round: string; details: string }[]
  questions?: string[]
}

export interface Job {
  id: string
  title: string
  company: string
  companyLogo?: string
  location: string
  workMode: "remote" | "hybrid" | "on-site"
  jobType: "full-time" | "part-time" | "internship" | "contract"
  salaryMin?: number
  salaryMax?: number
  currency?: string
  experienceMin: number
  experienceMax: number
  skills: string[]
  postedDate: string
  description?: string
  applicationUrl?: string
  aiMatchScore?: number
  isSaved: boolean
  isApplied: boolean
  isNew: boolean
}

export interface MockInterviewSession {
  id: string
  type: "technical" | "system-design" | "behavioral" | "case-study" | "sql"
  difficulty: "entry" | "mid" | "senior"
  targetCompany?: string | null
  duration: number // minutes
  score?: number // 0-100
  problemSolvingScore?: number
  communicationScore?: number
  codeQualityScore?: number
  timeManagementScore?: number
  completedAt?: string
  status: "in-progress" | "completed"
  transcript?: { role: "interviewer" | "candidate"; text: string; timestamp: string }[]
  feedback?: { category: string; rating: number; text: string }[]
}
