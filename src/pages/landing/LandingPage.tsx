import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Zap, Bot, Target, FileText, CheckCircle2, ArrowRight, Sparkles } from "lucide-react"

export const LandingPage: React.FC = () => {
  const features = [
    {
      title: "AI Mock Interviews",
      desc: "Simulate coding, SQL, and system design rounds. Get instant scoring and actionable speech feedback.",
      icon: Bot,
      color: "text-indigo-500 bg-indigo-500/10"
    },
    {
      title: "Rejection Intelligence",
      desc: "Upload interview outcomes to detect technical gaps, communication flaws, and CV inconsistencies.",
      icon: Zap,
      color: "text-violet-500 bg-violet-500/10"
    },
    {
      title: "Active Goal Setting",
      desc: "Track custom prep goals, maintain coding streaks, and auto-generate daily check-lists.",
      icon: Target,
      color: "text-cyan-500 bg-cyan-500/10"
    },
    {
      title: "Resume Parser",
      desc: "Audit your CV compatibility against specific target roles and companies to boost shortlists.",
      icon: FileText,
      color: "text-emerald-500 bg-emerald-500/10"
    }
  ]

  const pricing = [
    {
      name: "Free Trial",
      price: "$0",
      desc: "Perfect for students beginning their search.",
      features: [
        "1 AI Mock Interview / month",
        "Basic resume parsing audit",
        "Applications tracker board",
        "Limited company insights"
      ],
      cta: "Get Started",
      link: "/register",
      popular: false
    },
    {
      name: "Pro Plan",
      price: "$29",
      period: "/mo",
      desc: "Tailored for active job hunters targeting top tech.",
      features: [
        "Unlimited AI Mock Interviews",
        "Advanced speech & code feedback",
        "Automated rejection analysis reports",
        "Full resume intelligence comparator",
        "Premium company prep questions"
      ],
      cta: "Upgrade to Pro",
      link: "/register",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For universities and career bootcamps.",
      features: [
        "Everything in Pro",
        "Batch student analytics dashboard",
        "Custom school branding integration",
        "SLA guaranteed mock review APIs",
        "Dedicated account manager support"
      ],
      cta: "Contact Sales",
      link: "/register",
      popular: false
    }
  ]

  return (
    <div className="bg-slate-50 dark:bg-[#0F0F13] min-h-screen text-slate-800 dark:text-slate-200 select-none">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 dark:bg-indigo-500/5 text-indigo-500 dark:text-indigo-300 rounded-full border border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          The Future of Interview Prep
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-3xl"
        >
          Supercharge Your Prep with{" "}
          <span className="text-gradient">Career Intelligence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-500 dark:text-slate-400 mt-6 text-sm md:text-lg max-w-xl leading-relaxed"
        >
          Track job applications, simulate real-time coding or speech panels with AI, audit resume compatibility, and systematically close technical skill gaps.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary/95 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 cursor-pointer group"
          >
            Start Prepared
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-sm font-bold transition cursor-pointer"
          >
            Try Demo
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200 dark:border-slate-800/60">
        <div className="text-center max-w-lg mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Engineered for Job Seekers
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">
            All the tools you need to organize your pipeline and ace competitive engineering rounds.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className={`p-3 rounded-xl inline-block ${feat.color}`}>
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-4">
                {feat.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200 dark:border-slate-800/60">
        <div className="text-center max-w-lg mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Transparent Pricing plans
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">
            Choose a roadmap that aligns with your active application volume.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricing.map((tier, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-card border rounded-3xl p-8 relative flex flex-col justify-between ${
                tier.popular
                  ? "border-primary shadow-xl ring-2 ring-primary/10"
                  : "border-slate-200 dark:border-slate-800 shadow-sm"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{tier.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-slate-400 text-sm font-semibold">{tier.period}</span>
                  )}
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-6" />
                <ul className="space-y-3.5">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex gap-2.5 items-start text-xs text-slate-600 dark:text-slate-455">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={tier.link}
                className={`w-full text-center py-3 rounded-xl text-xs font-bold mt-8 shadow-sm transition block cursor-pointer ${
                  tier.popular
                    ? "bg-primary hover:bg-primary/95 text-white"
                    : "border border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-4xl mx-auto px-6 py-16 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl text-center relative overflow-hidden shadow-xl mb-20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
          Stay Ahead of Tech Hiring Trends
        </h2>
        <p className="text-indigo-200 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
          Subscribe to get weekly insights on active hiring companies, DSA topics, and negotiation tactics.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            const input = (e.target as HTMLFormElement).elements.namedItem("email") as HTMLInputElement
            if (input?.value) {
              alert(`Subscribed! Check ${input.value} for confirmation.`)
              input.value = ""
            }
          }}
          className="flex flex-col sm:flex-row items-center gap-3 mt-8 max-w-md mx-auto"
        >
          <input
            name="email"
            type="email"
            required
            placeholder="arjun.sharma@gmail.com"
            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-sm placeholder-indigo-300/60 text-white focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <button
            type="submit"
            className="w-full sm:w-auto shrink-0 px-6 py-3 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  )
}
export default LandingPage
