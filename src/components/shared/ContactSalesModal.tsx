import React, { useState } from "react"
import { Sparkles, X, CheckCircle, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ContactSalesModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ContactSalesModal: React.FC<ContactSalesModalProps> = ({ isOpen, onClose }) => {
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

    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 1400)
  }

  const handleClose = () => {
    // Reset states on exit
    setName("")
    setEmail("")
    setCompany("")
    setTeamSize("1-10")
    setMessage("")
    setIsSuccess(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-lg bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden relative"
          >
            {/* Header / Close Toggler */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> Contact Sales Team
              </h3>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSuccess ? (
              <div className="text-center py-8 space-y-4 animate-fade-in-up">
                <div className="w-16 h-16 bg-emerald-500/15 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Sales Query Sent!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Thank you! Your enterprise preparation query was delivered. A team representative will email you at <span className="font-bold text-primary">{email}</span> within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer mt-2"
                >
                  Close Panel
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <p className="text-[11px] text-slate-450 dark:text-slate-400 leading-relaxed -mt-1">
                  Submit this quick form to set up batch licenses, customized mock questions templates, or school pricing integrations.
                </p>

                {/* Name */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-450 dark:text-slate-400 block mb-1">
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
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-450 dark:text-slate-400 block mb-1">
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
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-450 dark:text-slate-400 block mb-1">
                      Organization
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
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-450 dark:text-slate-400 block mb-1">
                      Cohort Size
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
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-450 dark:text-slate-400 block mb-1">
                    Tell us about your needs
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="We want custom coding templates for our 50 SDE candidates..."
                    className="w-full px-3.5 py-2.5 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none text-slate-800 dark:text-slate-100 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 mt-5">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 border border-slate-205 dark:border-slate-850 text-slate-500 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:bg-primary/50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
export default ContactSalesModal
