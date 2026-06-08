import React, { useState } from "react"
import { HelpCircle, Search, CreditCard, User, Sparkles, AlertCircle, ChevronDown, ChevronUp, Send, CheckCircle } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"

export const SupportPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null)
  
  // Ticket Form States
  const [ticketName, setTicketName] = useState("")
  const [ticketEmail, setTicketEmail] = useState("")
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketCategory, setTicketCategory] = useState("billing")
  const [ticketMessage, setTicketMessage] = useState("")
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const faqs = [
    {
      q: "How many mock interviews do I get on the Free plan?",
      a: "The Free Plan includes 5 AI mock prep tokens total to help you get started with basic interview simulations. If you need more active loops, you can upgrade to the Pro plan (100 tokens/mo) or Prime plan (unlimited tokens/mo).",
      category: "pricing"
    },
    {
      q: "Can I upgrade or downgrade my plan at any time?",
      a: "Yes, you can upgrade or cancel your subscription at any time. If you upgrade, the new limits are applied immediately. If you cancel, your premium features remain active until the end of your current billing cycle.",
      category: "billing"
    },
    {
      q: "How does Rejection Intelligence audit my CV?",
      a: "Rejection Intelligence compares your CV against target job descriptions and previous interview transcripts. It audits keywords, detects technical alignment issues, identifies communication flaws, and suggests corrections.",
      category: "features"
    },
    {
      q: "How do I request billing invoices or logs?",
      a: "All invoice logs and receipts are automatically generated and listed in your User Settings under the 'Billing' dashboard. You can download pdf copies of invoices directly from the table.",
      category: "billing"
    },
    {
      q: "Is my speech recording and CV data secure?",
      a: "Absolutely. We treat security and privacy seriously. All parsed resumes, transcripts, and voice data are fully encrypted in transit and at rest, and are never shared with external hiring teams without your consent.",
      category: "security"
    }
  ]

  const categories = [
    { name: "Account Setup", desc: "Manage registration, passwords, profile details, and notifications.", icon: User, color: "text-indigo-500 bg-indigo-500/10" },
    { name: "Billing & Plans", desc: "Invoices, billing cycles, upgrading options, and coupons.", icon: CreditCard, color: "text-emerald-500 bg-emerald-500/10" },
    { name: "AI Simulators", desc: "Preparing for coding panels, SQL exercises, and career coach advice.", icon: Sparkles, color: "text-violet-500 bg-violet-500/10" },
    { name: "Troubleshooting", desc: "Known bugs, layout errors, dashboard syncing issues, and latency.", icon: AlertCircle, color: "text-rose-500 bg-rose-500/10" }
  ]

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate ticket logging API
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      
      // Reset fields
      setTicketName("")
      setTicketEmail("")
      setTicketSubject("")
      setTicketCategory("billing")
      setTicketMessage("")
    }, 1500)
  }

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 select-none text-left">
      <PageHeader
        title="Support Hub"
        description="Search documentation, find answers to frequently asked questions, or open a support ticket"
        icon={<HelpCircle className="w-5 h-5" />}
      />

      {/* Search Bar section */}
      <div className="max-w-xl bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
        <h3 className="text-sm font-extrabold text-slate-850 dark:text-white">
          How can we help you today?
        </h3>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type search terms, e.g. 'billing', 'rejection'..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Quick Help Categories Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((c) => (
          <div
            key={c.name}
            className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className={`p-2.5 rounded-xl inline-block ${c.color} mb-3.5`}>
              <c.icon className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-850 dark:text-white">{c.name}</h4>
            <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* FAQ and Ticket Section Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive FAQ Accordions (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-card border border-slate-202 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-855 dark:text-white uppercase tracking-wider border-b pb-2">
              Frequently Asked Questions
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              Quick answers to common queries
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-850">
            {filteredFaqs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 font-semibold">
                No FAQs match your search query. Try other keywords.
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = activeFaqIndex === index
                return (
                  <div key={index} className="py-3">
                    <button
                      onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between gap-4 text-left text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-primary transition cursor-pointer py-1"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pl-1 animate-fade-in-up">
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right: Support Ticket Form (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          {isSuccess ? (
            <div className="text-center py-10 space-y-4 animate-fade-in-up">
              <div className="w-12 h-12 bg-emerald-500/15 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white">
                Ticket Created!
              </h4>
              <p className="text-[10px] text-slate-450 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Your support ticket has been submitted. Our support engineers will contact you shortly.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition mt-2"
              >
                Open Another Ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <h3 className="text-xs font-extrabold text-slate-855 dark:text-white uppercase tracking-wider border-b pb-2">
                  Open Support Ticket
                </h3>
                <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-1">
                  Can't find the answer? Get direct engineering team help
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  placeholder="Arjun Sharma"
                  className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  placeholder="arjun@gmail.com"
                  className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    Issue Area
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                  >
                    <option value="billing">Billing & Plan</option>
                    <option value="ai-tokens">AI Prep Tokens</option>
                    <option value="dsa-panel">Mock Simulator</option>
                    <option value="other">General Query</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    Subject Summary
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Upgrade billing error"
                    className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  Describe your problem
                </label>
                <textarea
                  required
                  rows={3}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Write details of the issue here..."
                  className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              {/* Submit Ticket */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer disabled:bg-primary/50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Ticket...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Ticket
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
export default SupportPage
