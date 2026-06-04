import type { User, Application, InterviewRound, Goal, Task, MockInterviewSession, Notification, Company, Job, InterviewNote } from "../types"

export const demoUser: User = {
  id: "user-001",
  name: "Arjun Sharma",
  email: "arjun.sharma@gmail.com",
  plan: "pro",
  role: "user",
  joinDate: "2025-01-15",
  targetRole: "Software Engineer II / SDE-2",
  targetCompanies: ["Google", "Microsoft", "Razorpay", "Zepto", "Stripe"],
  skills: ["Python", "Node.js", "React", "System Design", "MySQL", "Docker"],
  location: "Bengaluru, India",
  linkedin: "linkedin.com/in/arjunsharma",
  github: "github.com/arjunsharma",
  bio: "Backend engineer targeting SDE-2 roles at product companies.",
  avatar: null
}

export const demoApplications: Application[] = [
  { 
    id: "app-001", 
    companyName: "Google", 
    jobTitle: "Software Engineer L4", 
    location: "Bengaluru · On-site", 
    jobType: "full-time",
    status: "technical", 
    priority: "high",
    appliedDate: "2025-05-20", 
    source: "linkedin",
    salary: { min: 4000000, max: 8000000, currency: "INR" },
    tags: ["Big Tech", "DSA Heavy", "Googliness"],
    recruiterName: "Sneha Reddy",
    recruiterEmail: "snehareddy@google.com",
    nextFollowUp: "2025-06-06",
    resumeUsed: "Arjun_SDE2_Backend_2025.pdf",
    jobDescriptionUrl: "https://careers.google.com/jobs/results/12345"
  },
  { 
    id: "app-002", 
    companyName: "Microsoft", 
    jobTitle: "Product Manager",
    location: "Hyderabad · Hybrid", 
    jobType: "full-time",
    status: "hr-round", 
    priority: "high",
    appliedDate: "2025-05-22", 
    source: "company-site",
    salary: { min: 4500000, max: 7000000, currency: "INR" },
    tags: ["Product Management", "Cloud Services"],
    recruiterName: "Amit Kumar",
    recruiterEmail: "amit.kumar@microsoft.com",
    nextFollowUp: "2025-06-08",
    resumeUsed: "Arjun_PM_Resume_2025.pdf",
    jobDescriptionUrl: "https://careers.microsoft.com/jobs/results/5678"
  },
  { 
    id: "app-003", 
    companyName: "Amazon", 
    jobTitle: "SDE-2",
    location: "Bengaluru · On-site", 
    jobType: "full-time",
    status: "offer", 
    priority: "high",
    appliedDate: "2025-05-10", 
    source: "referral",
    salary: { min: 3500000, max: 6000000, currency: "INR" },
    tags: ["Backend", "L5", "Java/AWS"],
    recruiterName: "Vikram Sen",
    recruiterEmail: "vikramsen@amazon.com",
    resumeUsed: "Arjun_SDE2_Backend_2025.pdf"
  },
  { 
    id: "app-004", 
    companyName: "Stripe", 
    jobTitle: "Backend Engineer",
    location: "Remote", 
    jobType: "full-time",
    status: "under-review", 
    priority: "high",
    appliedDate: "2025-05-25", 
    source: "company-site",
    salary: { min: 8000000, max: 15000000, currency: "INR" },
    tags: ["Fintech", "Ruby", "High Pay"],
    recruiterName: "Emily Watson",
    recruiterEmail: "emily@stripe.com",
    nextFollowUp: "2025-06-12",
    resumeUsed: "Arjun_SDE2_Backend_2025.pdf"
  },
  { 
    id: "app-005", 
    companyName: "Razorpay", 
    jobTitle: "SDE-2 Backend",
    location: "Bengaluru · Hybrid", 
    jobType: "full-time",
    status: "phone-screen", 
    priority: "high",
    appliedDate: "2025-05-28", 
    source: "linkedin",
    salary: { min: 3000000, max: 4200000, currency: "INR" },
    tags: ["Indian Unicorn", "Fintech", "Node.js"],
    recruiterName: "Nisha Patel",
    recruiterEmail: "nisha.patel@razorpay.com",
    nextFollowUp: "2025-06-07",
    resumeUsed: "Arjun_SDE2_Backend_2025.pdf"
  },
  { 
    id: "app-006", 
    companyName: "Zomato", 
    jobTitle: "SDE-1",
    location: "Gurugram · Hybrid", 
    jobType: "full-time",
    status: "applied", 
    priority: "medium",
    appliedDate: "2025-06-01", 
    source: "naukri",
    tags: ["Consumer App", "Fast Paced"]
  },
  { 
    id: "app-007", 
    companyName: "Swiggy", 
    jobTitle: "Backend Engineer II",
    location: "Bengaluru · On-site", 
    jobType: "full-time",
    status: "rejected", 
    priority: "medium",
    appliedDate: "2025-04-30", 
    source: "linkedin",
    tags: ["Logistics", "Java", "System Design Fail"]
  },
  { 
    id: "app-008", 
    companyName: "Atlassian", 
    jobTitle: "Software Engineer",
    location: "Remote", 
    jobType: "full-time",
    status: "applied", 
    priority: "medium",
    appliedDate: "2025-06-02", 
    source: "company-site",
    salary: { min: 7000000, max: 12000000, currency: "INR" },
    tags: ["Work Life Balance", "Distributed systems"]
  },
  { 
    id: "app-009", 
    companyName: "Zepto", 
    jobTitle: "ML Engineer",
    location: "Mumbai · On-site", 
    jobType: "full-time",
    status: "final-round", 
    priority: "high",
    appliedDate: "2025-05-15", 
    source: "referral",
    tags: ["Quick Commerce", "Python", "GPU Cluster"]
  },
  { 
    id: "app-010", 
    companyName: "Meesho", 
    jobTitle: "Product Analyst",
    location: "Bengaluru · Hybrid", 
    jobType: "full-time",
    status: "under-review", 
    priority: "low",
    appliedDate: "2025-05-29", 
    source: "naukri",
    tags: ["E-commerce", "SQL", "Analytics"]
  },
  { 
    id: "app-011", 
    companyName: "Paytm", 
    jobTitle: "Backend Developer",
    location: "Noida · On-site", 
    jobType: "full-time",
    status: "applied", 
    priority: "low",
    appliedDate: "2025-06-03", 
    source: "naukri",
    tags: ["Fintech", "NodeJS"]
  },
  { 
    id: "app-012", 
    companyName: "CRED", 
    jobTitle: "SDE-2",
    location: "Bengaluru · On-site", 
    jobType: "full-time",
    status: "withdrawn", 
    priority: "low",
    appliedDate: "2025-04-20", 
    source: "linkedin",
    tags: ["Fintech", "Ruby/Go"]
  },
  { 
    id: "app-013", 
    companyName: "PhonePe", 
    jobTitle: "Data Scientist",
    location: "Bengaluru · Hybrid", 
    jobType: "full-time",
    status: "technical", 
    priority: "medium",
    appliedDate: "2025-05-18", 
    source: "company-site",
    tags: ["Data Science", "Python"]
  },
  { 
    id: "app-014", 
    companyName: "Notion", 
    jobTitle: "Software Engineer",
    location: "Remote", 
    jobType: "full-time",
    status: "applied", 
    priority: "medium",
    appliedDate: "2025-06-04", 
    source: "company-site",
    salary: { min: 9000000, max: 16000000, currency: "INR" },
    tags: ["SaaS", "React/TypeScript", "Editor"]
  },
  { 
    id: "app-015", 
    companyName: "Groww", 
    jobTitle: "SDE-1",
    location: "Bengaluru · Hybrid", 
    jobType: "full-time",
    status: "applied", 
    priority: "low",
    appliedDate: "2025-06-04", 
    source: "naukri",
    tags: ["Trading", "Java"]
  }
]

export const demoInterviewRounds: Record<string, InterviewRound[]> = {
  "app-001": [
    { 
      id: "ir-001", 
      applicationId: "app-001", 
      roundName: "Resume Shortlist",
      roundType: "online-assessment", 
      status: "completed",
      date: "2025-05-20", 
      result: "cleared",
      feedback: "Shortlisted via LinkedIn screening.", 
      selfRating: 5 
    },
    { 
      id: "ir-002", 
      applicationId: "app-001", 
      roundName: "Online Assessment",
      roundType: "online-assessment", 
      status: "completed",
      date: "2025-05-25", 
      duration: 90, 
      platform: "HackerRank",
      result: "cleared", 
      selfRating: 4,
      feedback: "2 DSA problems — solved both. Binary tree path sum + DP Knapsack variant." 
    },
    { 
      id: "ir-003", 
      applicationId: "app-001", 
      roundName: "Technical Round 1",
      roundType: "technical", 
      status: "scheduled",
      date: "2025-06-05T14:00:00", 
      duration: 60, 
      platform: "Google Meet",
      interviewerName: "Rahul Sharma"
    },
    { 
      id: "ir-004", 
      applicationId: "app-001", 
      roundName: "Technical Round 2",
      roundType: "system-design", 
      status: "pending" 
    },
    { 
      id: "ir-005", 
      applicationId: "app-001", 
      roundName: "HR / Googliness",
      roundType: "hr", 
      status: "pending" 
    }
  ],
  "app-002": [
    {
      id: "ir-201",
      applicationId: "app-002",
      roundName: "PM Screening",
      roundType: "behavioral",
      status: "completed",
      date: "2025-05-26",
      duration: 45,
      platform: "Microsoft Teams",
      result: "cleared",
      selfRating: 5,
      feedback: "Answered behavioral questions about conflict resolution and product ownership."
    },
    {
      id: "ir-202",
      applicationId: "app-002",
      roundName: "Product Case Round",
      roundType: "case-study",
      status: "scheduled",
      date: "2025-06-08T11:00:00",
      duration: 60,
      platform: "Microsoft Teams",
      interviewerName: "Ananya Iyer"
    }
  ]
}

export const demoGoals: Goal[] = [
  { 
    id: "goal-001", 
    title: "Weekly Applications", 
    category: "job-search",
    type: "numeric", 
    targetValue: 5, 
    currentValue: 4, 
    unit: "applications",
    frequency: "weekly", 
    deadline: "2025-06-08", 
    status: "active", 
    streak: 3 
  },
  { 
    id: "goal-002", 
    title: "Mock Interviews per Week", 
    category: "interview-prep",
    type: "numeric", 
    targetValue: 3, 
    currentValue: 1, 
    unit: "sessions",
    frequency: "weekly", 
    deadline: "2025-06-08", 
    status: "active" 
  },
  { 
    id: "goal-003", 
    title: "LeetCode Practice", 
    category: "technical",
    type: "numeric", 
    targetValue: 25, 
    currentValue: 18, 
    unit: "problems",
    frequency: "monthly", 
    deadline: "2025-06-30", 
    status: "active" 
  },
  { 
    id: "goal-004", 
    title: "System Design Study", 
    category: "technical",
    type: "numeric", 
    targetValue: 4, 
    currentValue: 2, 
    unit: "systems",
    frequency: "monthly", 
    deadline: "2025-06-30", 
    status: "active" 
  },
  { 
    id: "goal-005", 
    title: "Company Research", 
    category: "job-search",
    type: "numeric", 
    targetValue: 5, 
    currentValue: 5, 
    unit: "profiles",
    frequency: "weekly", 
    deadline: "2025-06-08", 
    status: "completed" 
  },
  { 
    id: "goal-006", 
    title: "Salary Negotiation Prep", 
    category: "career",
    type: "boolean", 
    targetValue: 1, 
    currentValue: 0,
    frequency: "custom", 
    deadline: "2025-06-15", 
    status: "active" 
  }
]

export const demoTasks: Task[] = [
  { 
    id: "task-001", 
    title: "Prepare for Google Technical Round 1 (tomorrow)",
    category: "interview-prep", 
    priority: "high", 
    dueDate: "2025-06-05",
    completed: false, 
    isAISuggested: true, 
    estimatedMinutes: 120,
    linkedApplicationId: "app-001",
    subTasks: [
      { id: "st-001", title: "Review Binary Tree Algorithms", completed: true },
      { id: "st-002", title: "Review Graph Traversals (DFS/BFS)", completed: false },
      { id: "st-003", title: "Practice 3 LeetCode Tree problems", completed: false },
      { id: "st-004", title: "Review time and space complexity", completed: false }
    ]
  },
  { 
    id: "task-002", 
    title: "Send follow-up email to Microsoft recruiter",
    category: "application", 
    priority: "high",
    dueDate: "2025-06-05", 
    dueTime: "15:00",
    completed: false, 
    isAISuggested: false,
    linkedApplicationId: "app-002"
  },
  { 
    id: "task-003", 
    title: "Complete LeetCode Daily Challenge",
    category: "study", 
    priority: "medium",
    dueDate: "2025-06-05", 
    completed: false,
    isAISuggested: false, 
    estimatedMinutes: 30 
  },
  { 
    id: "task-004", 
    title: "Update Swiggy application status",
    category: "admin", 
    priority: "medium",
    dueDate: "2025-06-05", 
    completed: false, 
    isAISuggested: false,
    linkedApplicationId: "app-007"
  },
  { 
    id: "task-005", 
    title: "Research Razorpay engineering culture",
    category: "research", 
    priority: "medium",
    dueDate: "2025-06-05", 
    completed: false,
    isAISuggested: false, 
    estimatedMinutes: 30,
    linkedApplicationId: "app-005"
  },
  { 
    id: "task-006", 
    title: "Read System Design: Design Twitter article",
    category: "study", 
    priority: "low",
    dueDate: "2025-06-05", 
    completed: false,
    isAISuggested: true, 
    estimatedMinutes: 45 
  },
  { 
    id: "task-007", 
    title: "Applied to Zomato Backend Engineer",
    category: "application", 
    priority: "medium",
    dueDate: "2025-06-05", 
    completed: true,
    completedAt: "2025-06-05T09:00:00", 
    isAISuggested: false,
    linkedApplicationId: "app-006"
  },
  { 
    id: "task-008", 
    title: "Reviewed yesterday's mock interview feedback",
    category: "interview-prep", 
    priority: "medium",
    dueDate: "2025-06-05", 
    completed: true,
    completedAt: "2025-06-05T10:30:00", 
    isAISuggested: false 
  }
]

export const demoMockSessions: MockInterviewSession[] = [
  { 
    id: "mis-001", 
    type: "technical", 
    difficulty: "mid",
    targetCompany: "Google", 
    duration: 45, 
    score: 82,
    problemSolvingScore: 80, 
    communicationScore: 88,
    codeQualityScore: 78, 
    timeManagementScore: 82,
    completedAt: "2025-06-03", 
    status: "completed",
    transcript: [
      { role: "interviewer", text: "Welcome. Today we will focus on designing a system to find the top K active users in real-time. But first, let's write a function to detect a cycle in a directed graph.", timestamp: "00:02" },
      { role: "candidate", text: "Sure. We can solve the cycle detection problem using Depth First Search (DFS) and keeping track of the recursion stack.", timestamp: "01:15" },
      { role: "interviewer", text: "Excellent. Can you implement it and discuss the time complexity?", timestamp: "04:30" }
    ],
    feedback: [
      { category: "Problem Solving", rating: 4, text: "Good understanding of graph structures. Quickly identified DFS with recursion stack check." },
      { category: "Communication", rating: 5, text: "Clear and audible explanation. Talked out loud while writing code." },
      { category: "Code Quality", rating: 3.8, text: "Code was syntactically correct, could introduce better variable names." },
      { category: "Time Management", rating: 4.2, text: "Finished the coding part in under 25 minutes, leaving ample time for analysis." }
    ]
  },
  { 
    id: "mis-002", 
    type: "system-design", 
    difficulty: "mid",
    targetCompany: "Amazon", 
    duration: 50, 
    score: 74,
    completedAt: "2025-06-01", 
    status: "completed",
    feedback: [
      { category: "System Architecture", rating: 3.5, text: "Identified need for CDNs and caching, but forgot about database replication." }
    ]
  },
  { 
    id: "mis-003", 
    type: "behavioral", 
    difficulty: "mid",
    targetCompany: "Microsoft", 
    duration: 30, 
    score: 91,
    completedAt: "2025-05-29", 
    status: "completed" 
  },
  { 
    id: "mis-004", 
    type: "technical", 
    difficulty: "mid",
    targetCompany: "Flipkart", 
    duration: 40, 
    score: 68,
    completedAt: "2025-05-27", 
    status: "completed" 
  },
  { 
    id: "mis-005", 
    type: "sql", 
    difficulty: "entry",
    targetCompany: null, 
    duration: 35, 
    score: 79,
    completedAt: "2025-05-25", 
    status: "completed" 
  }
]

export const demoNotifications: Notification[] = [
  { 
    id: "notif-001", 
    type: "interview-reminder",
    title: "Google Technical Round 1 — Tomorrow at 2:00 PM",
    description: "Don't forget to prepare! You have 18 hours remaining.",
    isRead: false, 
    createdAt: "2025-06-05T08:00:00",
    actionUrl: "/interview-timeline", 
    actionLabel: "Start Prep →" 
  },
  { 
    id: "notif-002", 
    type: "ai-insight",
    title: "New AI Rejection Analysis Ready",
    description: "Your Amazon application has been analyzed. System Design gap detected.",
    isRead: false, 
    createdAt: "2025-06-05T07:00:00",
    actionUrl: "/ai-rejection-analysis", 
    actionLabel: "View Analysis →" 
  },
  { 
    id: "notif-003", 
    type: "application-update",
    title: "Razorpay moved your application to Under Review",
    description: "Your Backend Engineer application status was updated.",
    isRead: false, 
    createdAt: "2025-06-05T06:00:00",
    actionUrl: "/applications/app-005" 
  },
  { 
    id: "notif-004", 
    type: "goal-alert",
    title: "Weekly Application Goal — 1 left to complete",
    description: "You've submitted 4/5 applications. 1 more by Sunday!",
    isRead: false, 
    createdAt: "2025-06-04T18:00:00",
    actionUrl: "/goals" 
  },
  { 
    id: "notif-005", 
    type: "achievement",
    title: "Goal Completed! 🎉",
    description: "You completed your Company Research goal for this week.",
    isRead: true, 
    createdAt: "2025-06-04T12:00:00" 
  },
  { 
    id: "notif-006", 
    type: "mock-interview",
    title: "Mock Interview Score Released",
    description: "You scored 82/100 in the Google Technical Mock. View details.",
    isRead: true, 
    createdAt: "2025-06-03T17:00:00",
    actionUrl: "/ai-mock-interview/results/mis-001",
    actionLabel: "View Feedback"
  },
  { 
    id: "notif-007", 
    type: "resume",
    title: "Resume Analysis Completed",
    description: "Your active resume score increased to 84/100.",
    isRead: true, 
    createdAt: "2025-06-02T10:00:00",
    actionUrl: "/resume-intelligence"
  },
  { 
    id: "notif-008", 
    type: "ai-insight",
    title: "Career Coach Update Available",
    description: "Your personalized study plan has been updated based on your recent activity.",
    isRead: true, 
    createdAt: "2025-06-01T09:00:00",
    actionUrl: "/ai-career-coach"
  },
  { 
    id: "notif-009", 
    type: "streak",
    title: "5-Day Coding Streak! 🔥",
    description: "Keep it up! Consistency is key to passing tech rounds.",
    isRead: true, 
    createdAt: "2025-05-31T20:00:00"
  },
  { 
    id: "notif-010", 
    type: "system",
    title: "Weekly Summary Report",
    description: "Your Weekly Career Activity breakdown is ready to download.",
    isRead: true, 
    createdAt: "2025-05-30T08:00:00"
  },
  { 
    id: "notif-011", 
    type: "application-update",
    title: "Swiggy Application Status Updated",
    description: "Status changed to Rejected. Review AI Rejection analysis.",
    isRead: true, 
    createdAt: "2025-04-30T16:00:00",
    actionUrl: "/ai-rejection-analysis"
  },
  { 
    id: "notif-012", 
    type: "interview-reminder",
    title: "Microsoft Round Confirmed",
    description: "PM Screening confirmed for 2025-05-26 at 11:00 AM.",
    isRead: true, 
    createdAt: "2025-05-24T14:00:00"
  },
  { 
    id: "notif-013", 
    type: "billing",
    title: "Subscription Renewal Notice",
    description: "Your Pro plan will renew automatically on 2025-06-15.",
    isRead: true, 
    createdAt: "2025-05-15T09:00:00",
    actionUrl: "/billing"
  },
  { 
    id: "notif-014", 
    type: "system",
    title: "New AI Engine Update v2.1",
    description: "Improved resume matching accuracy and behavioral speech analysis.",
    isRead: true, 
    createdAt: "2025-05-12T10:00:00"
  },
  { 
    id: "notif-015", 
    type: "billing",
    title: "Trial Expiring Soon",
    description: "Your premium trial features expire in 3 days. Upgrade today to avoid service gaps.",
    isRead: true, 
    createdAt: "2025-05-10T12:00:00",
    actionUrl: "/billing/upgrade"
  }
]

export const demoCompanies: Company[] = [
  { 
    id: "co-001", 
    name: "Google", 
    industry: "Internet & Technology", 
    size: "100,000+ employees", 
    hqLocation: "Mountain View, CA", 
    website: "google.com",
    glassdoorRating: 4.5,
    interviewDifficulty: 4.6, 
    avgProcessDuration: "4-6 weeks", 
    avgRounds: 5,
    topRoles: ["Software Engineer", "Site Reliability Engineer", "Product Manager"],
    interviewStyle: "Heavy DSA Focus, Googliness, System Design for senior roles.",
    tags: ["FAANG", "Workplace Perks", "Scale"],
    interviewProcess: [
      { round: "Online Assessment", details: "2 DSA problems on HackerRank (90 mins)." },
      { round: "Technical Screen", details: "1 DSA coding interview via Google Meet (45 mins)." },
      { round: "Onsite Loop", details: "3 coding rounds + 1 system design round + 1 Googliness behavioral round." }
    ],
    questions: [
      "Design a rate limiter for API requests.",
      "Find the length of the longest subarray with at most K distinct elements.",
      "How do you handle conflict with a product manager who wants to ship a feature that has technical debt?"
    ]
  },
  { 
    id: "co-002", 
    name: "Microsoft", 
    industry: "Software & Cloud", 
    size: "100,000+ employees", 
    hqLocation: "Redmond, WA", 
    website: "microsoft.com",
    glassdoorRating: 4.4,
    interviewDifficulty: 4.1, 
    avgProcessDuration: "3-5 weeks", 
    avgRounds: 4,
    topRoles: ["Software Engineer", "Program Manager", "Azure Architect"],
    interviewStyle: "Algorithmic thinking, object-oriented design, Azure cloud domain questions.",
    tags: ["Big Tech", "Hybrid Work", "Enterprise Software"],
    interviewProcess: [
      { round: "Recruiter Call", details: "Initial background alignment." },
      { round: "Technical Screen", details: "Coding and basic OOP theory." },
      { round: "Onsite Loop", details: "3 technical coding/design sessions + 1 architectural evaluation." }
    ],
    questions: [
      "Implement a Least Recently Used (LRU) Cache.",
      "Check if a binary tree is balanced.",
      "Design a real-time collaborative document editor like Word Online."
    ]
  },
  { 
    id: "co-003", 
    name: "Amazon", 
    industry: "E-Commerce & Cloud Services", 
    size: "1,000,000+ employees", 
    hqLocation: "Seattle, WA", 
    website: "amazon.com",
    glassdoorRating: 3.8,
    interviewDifficulty: 4.0, 
    avgProcessDuration: "3-4 weeks", 
    avgRounds: 5,
    topRoles: ["Software Development Engineer", "Solution Architect", "Operations Manager"],
    interviewStyle: "Obsession with 16 Leadership Principles (LPs) and System Design.",
    tags: ["Customer Obsession", "AWS", "High Scale"],
    interviewProcess: [
      { round: "Online Assessment", details: "Debugging, coding, and work simulation (90 mins)." },
      { round: "Technical Screen", details: "1 Coding round + 15 mins LP questions." },
      { round: "Onsite Loop", details: "4 rounds focusing heavily on LPs, System Design, and Object Oriented Design." }
    ],
    questions: [
      "Design an Amazon Locker delivery system.",
      "Merge K sorted linked lists.",
      "Tell me about a time you had to make a quick decision without all the data (Bias for Action)."
    ]
  },
  { 
    id: "co-004", 
    name: "Stripe", 
    industry: "Financial Infrastructure", 
    size: "5,000 - 10,000 employees", 
    hqLocation: "San Francisco, CA", 
    website: "stripe.com",
    glassdoorRating: 4.0,
    interviewDifficulty: 4.5, 
    avgProcessDuration: "4-5 weeks", 
    avgRounds: 5,
    topRoles: ["Backend Engineer", "Integration Engineer", "Data Engineer"],
    interviewStyle: "Practical coding, API design, bug squash, integration testing.",
    tags: ["Fintech", "Developer First", "High Talent Bar"],
    interviewProcess: [
      { round: "Technical Screen", details: "Writing real executable code to parse structured data." },
      { round: "Onsite Loop", details: "Bug squash round + Integration design + Coding round + Manager alignment." }
    ],
    questions: [
      "Implement an API rate limiting mechanism with token bucket.",
      "Parse and process a set of nested JSON ledger logs.",
      "Write a utility that matches charge transactions with bank payouts."
    ]
  },
  { 
    id: "co-005", 
    name: "Razorpay", 
    industry: "Fintech & Payments", 
    size: "2,000 - 5,000 employees", 
    hqLocation: "Bengaluru, India", 
    website: "razorpay.com",
    glassdoorRating: 4.1,
    interviewDifficulty: 3.8, 
    avgProcessDuration: "2-3 weeks", 
    avgRounds: 4,
    topRoles: ["Backend Developer", "Frontend Developer", "Product Engineer"],
    interviewStyle: "Practical coding, Node.js internals, database scaling, payment systems concurrency.",
    tags: ["Indian Unicorn", "Fintech Leader", "Fast Execution"],
    questions: [
      "Explain Node.js event loop and design an asynchronous task scheduler.",
      "Design a payment gateway checkout system supporting high concurrent requests.",
      "Explain transactional integrity across microservices (Saga pattern)."
    ]
  },
  { 
    id: "co-006", 
    name: "Zomato", 
    industry: "FoodTech & Delivery", 
    size: "5,000 - 10,000 employees", 
    hqLocation: "Gurugram, India", 
    website: "zomato.com",
    glassdoorRating: 3.9,
    interviewDifficulty: 3.7, 
    avgProcessDuration: "2 weeks", 
    avgRounds: 3,
    questions: [
      "Design a geo-spatial search system to find drivers near a restaurant.",
      "How would you optimize SQL queries for order retrieval during peak hours?"
    ]
  },
  { 
    id: "co-007", 
    name: "Zepto", 
    industry: "Quick Commerce", 
    size: "1,000 - 2,000 employees", 
    hqLocation: "Mumbai, India", 
    website: "zeptonow.com",
    glassdoorRating: 4.2,
    interviewDifficulty: 4.0, 
    avgProcessDuration: "2-3 weeks", 
    avgRounds: 4,
    questions: [
      "Design a warehouse inventory management database structure.",
      "How to implement routing algorithms for 10-minute grocery delivery."
    ]
  },
  { 
    id: "co-008", 
    name: "Atlassian", 
    industry: "Collaboration Software", 
    size: "10,000+ employees", 
    hqLocation: "Sydney, Australia", 
    website: "atlassian.com",
    glassdoorRating: 4.3,
    interviewDifficulty: 3.9, 
    avgProcessDuration: "3-4 weeks", 
    avgRounds: 4,
    questions: [
      "Design JIRA issue hierarchy models.",
      "Write a rate limiter for collaborative dashboard widgets.",
      "Explain the differences between optimistic and pessimistic locking."
    ]
  }
]

export const demoJobs: Job[] = [
  { 
    id: "job-001", 
    title: "SDE-2 Backend (Payments)", 
    company: "Razorpay", 
    location: "Bengaluru, India", 
    workMode: "hybrid", 
    jobType: "full-time",
    salaryMin: 3200000, 
    salaryMax: 4500000, 
    currency: "INR",
    experienceMin: 3, 
    experienceMax: 6,
    skills: ["Node.js", "Redis", "MySQL", "AWS"], 
    postedDate: "2025-06-02",
    description: "Join the core billing and transaction systems team. Work on highly scalable Node.js microservices processing millions of daily transactions.",
    aiMatchScore: 92, 
    isSaved: true, 
    isApplied: false, 
    isNew: true 
  },
  { 
    id: "job-002", 
    title: "Software Engineer L4", 
    company: "Google", 
    location: "Bengaluru, India", 
    workMode: "on-site", 
    jobType: "full-time",
    salaryMin: 3800000, 
    salaryMax: 5500000, 
    currency: "INR",
    experienceMin: 2, 
    experienceMax: 5,
    skills: ["Python", "C++", "DSA", "Distributed Systems"], 
    postedDate: "2025-06-03",
    description: "Develop the next generation search products and advertising systems. Focus on algorithm design, code efficiency, and low-latency storage engines.",
    aiMatchScore: 88, 
    isSaved: false, 
    isApplied: true, 
    isNew: true 
  },
  { 
    id: "job-003", 
    title: "Software Engineer II (Backend)", 
    company: "Stripe", 
    location: "Remote (India)", 
    workMode: "remote", 
    jobType: "full-time",
    salaryMin: 7000000, 
    salaryMax: 11000000, 
    currency: "INR",
    experienceMin: 4, 
    experienceMax: 8,
    skills: ["Ruby", "Go", "API Design", "Distributed Systems"], 
    postedDate: "2025-06-01",
    description: "Help build the global economic infrastructure for the internet. Design developer-friendly APIs, microservices, and ledger systems.",
    aiMatchScore: 85, 
    isSaved: true, 
    isApplied: false, 
    isNew: false 
  },
  { 
    id: "job-004", 
    title: "Backend Engineer II (SDE-2)", 
    company: "Zepto", 
    location: "Bengaluru, India", 
    workMode: "on-site", 
    jobType: "full-time",
    salaryMin: 3000000, 
    salaryMax: 4200000, 
    currency: "INR",
    experienceMin: 3, 
    experienceMax: 6,
    skills: ["Node.js", "Redis", "PostgreSQL", "Kafka"], 
    postedDate: "2025-05-30",
    description: "Work on express routing algorithms, warehouse stock forecasting databases, and real-time delivery scheduling engines.",
    aiMatchScore: 94, 
    isSaved: false, 
    isApplied: false, 
    isNew: false 
  },
  { 
    id: "job-005", 
    title: "Software Engineer (Teams Integration)", 
    company: "Microsoft", 
    location: "Hyderabad, India", 
    workMode: "hybrid", 
    jobType: "full-time",
    salaryMin: 3500000, 
    salaryMax: 5000000, 
    currency: "INR",
    experienceMin: 2, 
    experienceMax: 5,
    skills: ["C#", "TypeScript", "React", "Azure"], 
    postedDate: "2025-06-04",
    description: "Build robust integrations and third-party app connectors for Microsoft Teams. Optimize React frontend components and Azure backend services.",
    aiMatchScore: 81, 
    isSaved: false, 
    isApplied: false, 
    isNew: true 
  },
  { 
    id: "job-006", 
    title: "Software Engineer SDE-2", 
    company: "CRED", 
    location: "Bengaluru, India", 
    workMode: "on-site", 
    jobType: "full-time",
    salaryMin: 3800000, 
    salaryMax: 5500000, 
    currency: "INR",
    experienceMin: 3, 
    experienceMax: 7,
    skills: ["Go", "Node.js", "MongoDB", "Kubernetes"], 
    postedDate: "2025-05-25",
    description: "Own card verification networks, member acquisition flows, and credit reward algorithms.",
    aiMatchScore: 78, 
    isSaved: false, 
    isApplied: false, 
    isNew: false 
  },
  { 
    id: "job-007", 
    title: "Software Development Engineer (Confluence)", 
    company: "Atlassian", 
    location: "Remote (India)", 
    workMode: "remote", 
    jobType: "full-time",
    salaryMin: 6500000, 
    salaryMax: 9500000, 
    currency: "INR",
    experienceMin: 2, 
    experienceMax: 6,
    skills: ["Java", "React", "AWS", "Spring Boot"], 
    postedDate: "2025-06-02",
    description: "Enhance user experience and collaborative editing engines in Confluence. Work across React SPA and Java Spring Boot services.",
    aiMatchScore: 87, 
    isSaved: false, 
    isApplied: false, 
    isNew: false 
  },
  { 
    id: "job-008", 
    title: "Software Engineer SDE-1", 
    company: "Groww", 
    location: "Bengaluru, India", 
    workMode: "hybrid", 
    jobType: "full-time",
    salaryMin: 1800000, 
    salaryMax: 2600000, 
    currency: "INR",
    experienceMin: 1, 
    experienceMax: 3,
    skills: ["Java", "Spring Boot", "MySQL", "Hibernate"], 
    postedDate: "2025-06-04",
    description: "Develop reliable and low-latency order placement interfaces. Focus on database indexing and transaction safety.",
    aiMatchScore: 74, 
    isSaved: false, 
    isApplied: false, 
    isNew: true 
  },
  { 
    id: "job-009", 
    title: "Software Engineer (Block Components)", 
    company: "Notion", 
    location: "Remote", 
    workMode: "remote", 
    jobType: "full-time",
    salaryMin: 9000000, 
    salaryMax: 15000000, 
    currency: "INR",
    experienceMin: 3, 
    experienceMax: 6,
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"], 
    postedDate: "2025-06-03",
    description: "Design and implement Notion's block editor plugins and collaborative real-time APIs. Keep browser performance smooth with virtualization.",
    aiMatchScore: 83, 
    isSaved: true, 
    isApplied: false, 
    isNew: true 
  },
  { 
    id: "job-010", 
    title: "Data Scientist (Merchant Analytics)", 
    company: "PhonePe", 
    location: "Bengaluru, India", 
    workMode: "hybrid", 
    jobType: "full-time",
    salaryMin: 2800000, 
    salaryMax: 4000000, 
    currency: "INR",
    experienceMin: 2, 
    experienceMax: 5,
    skills: ["Python", "SQL", "Pandas", "Scikit-Learn"], 
    postedDate: "2025-05-28",
    description: "Build forecasting and user propensity models for PhonePe merchants. Develop Python data pipelines and dashboards.",
    aiMatchScore: 79, 
    isSaved: false, 
    isApplied: false, 
    isNew: false 
  }
]

export const demoNotes: InterviewNote[] = [
  {
    id: "note-001",
    applicationId: "app-001",
    companyName: "Google",
    roundName: "Online Assessment",
    date: "2025-05-25",
    questions: [
      { id: "q-01", text: "Find the longest path in a binary tree where each node has a value greater than its parent.", difficulty: "medium", type: "technical", isImportant: true, myAnswer: "Used dynamic programming on tree nodes by calculating longest paths bottom-up." },
      { id: "q-02", text: "Given an array of integers, partition it into K subsets with equal sum.", difficulty: "hard", type: "technical", isImportant: false, myAnswer: "Solved using backtracking with bitmasking to keep track of visited elements." }
    ],
    selfRating: 4,
    communicationRating: 4,
    technicalRating: 5,
    problemSolvingRating: 4,
    wentWell: "Solved both coding problems and passed all test cases within 70 minutes out of 90.",
    improvements: "Could write more concise recursion base cases.",
    feedbackReceived: "Cleared to the next rounds.",
    learningTopics: ["Backtracking", "Bitmasking", "Dynamic Programming on Trees"],
    tags: ["DSA", "Trees", "DP"]
  }
]
