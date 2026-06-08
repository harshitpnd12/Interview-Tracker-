import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Send, Sparkles, Building, Users, CheckCircle } from "lucide-react"

export const ContactSalesPage: React.FC = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [teamSize, setTeamSize] = useState("1-10")
  const [message, setMessage] = useState("")
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API request sending
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 1500)
  }

  return (
    <div className="bg-slate-50 dark:bg-[#0F0F13] min-h-screen text-slate-800 dark:text-slate-200 select-none py-12 px-6">
      {/* Header and Back Button */}
      <div className="max-w-6xl mx-auto mb-10 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-10 items-stretch">
        {/* Left Side: Benefits Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[400px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              InterviewIQ Enterprise
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Scale prep across cohorts
            </h2>
            <p className="text-indigo-200 text-xs mt-3 leading-relaxed">
              Equip your cohort, university class, or engineering team with advanced AI simulator access, interview tracking boards, and analytics.
            </p>

            <div className="space-y-5 mt-10">
              <div className="flex gap-3.5 items-start">
                <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Batch Student Analytics</h4>
                  <p className="text-[10px] text-indigo-200/80 mt-1 leading-relaxed">
                    Track mock completion rates, average scores, and active pipeline volumes.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300 shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Custom School Branding</h4>
                  <p className="text-[10px] text-indigo-200/80 mt-1 leading-relaxed">
                    White-label mock questions and assessment templates with your logos.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Enterprise Grade SLA APIs</h4>
                  <p className="text-[10px] text-indigo-200/80 mt-1 leading-relaxed">
                    Integrate speech evaluation metrics directly into your internal databases.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-indigo-300/60 mt-10 pt-6 border-t border-white/10">
            Trusted by top universities and engineering bootcamps globally.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-7 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col justify-center min-h-[480px]">
          {isSuccess ? (
            <div className="text-center space-y-5 py-8 animate-fade-in-up">
              <div className="w-16 h-16 bg-emerald-500/15 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-float border border-emerald-500/30">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Request Sent Successfully!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Thank you for contacting sales. Our enterprise advisor will reach out to you at <span className="font-bold text-primary">{email}</span> within 24 hours.
              </p>
              <div className="pt-6">
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Return to Homepage
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Get in Touch
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Send us a sales request to set up custom billing or trial access.
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arjun Sharma"
                  className="w-full px-3.5 py-2.5 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arjun@university.edu"
                  className="w-full px-3.5 py-2.5 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Company */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    Institution / Company
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Scaler Academy"
                    className="w-full px-3.5 py-2.5 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Team Size */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    Cohort / Team Size
                  </label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none text-slate-800 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="1-10">1-10 candidates</option>
                    <option value="11-50">11-50 candidates</option>
                    <option value="50-200">50-200 candidates</option>
                    <option value="200+">200+ candidates</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  How can we help you?
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your active hiring/training preparation rounds..."
                  className="w-full px-3.5 py-2.5 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none text-slate-800 dark:text-slate-100 resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer disabled:bg-primary/50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Request
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
export default ContactSalesPage
