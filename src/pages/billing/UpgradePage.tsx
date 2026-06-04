import React from "react"
import { useNavigate } from "react-router-dom"
import { CreditCard, ArrowLeft, CheckCircle2 } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"
import { toast } from "sonner"

export const UpgradePage: React.FC = () => {
  const navigate = useNavigate()

  const handleCheckout = (plan: string) => {
    toast.success(`Upgraded to ${plan}! Processing invoice...`)
    setTimeout(() => navigate("/billing"), 1000)
  }

  return (
    <div className="space-y-6 select-none text-left">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/billing")}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-450 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-slate-400">Back to Billing</span>
      </div>

      <PageHeader
        title="Upgrade Subscription Plan"
        description="Select a roadmap subscription to continue practicing live mock runs"
        icon={<CreditCard className="w-5 h-5" />}
      />

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-6">
        {/* Pro Plan */}
        <div className="bg-white dark:bg-card border-2 border-primary rounded-3xl p-8 relative flex flex-col justify-between shadow-xl">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Popular Choice
          </span>
          
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pro Plan</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">For active job hunters targeting top tech.</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">$29.00</span>
              <span className="text-slate-450 text-sm font-semibold">/mo</span>
            </div>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-6" />
            <ul className="space-y-3">
              {["Unlimited AI Mock Interviews", "Advanced speech diagnostics", "Automated rejection audits"].map((feat, fIdx) => (
                <li key={fIdx} className="flex gap-2 text-xs text-slate-655 dark:text-slate-400 items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => handleCheckout("Pro Plan")}
            className="w-full text-center py-3 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold mt-8 shadow-sm transition cursor-pointer"
          >
            Upgrade to Pro
          </button>
        </div>

        {/* Enterprise */}
        <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-semibold">For universities and coding cohorts.</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Custom</span>
            </div>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-6" />
            <ul className="space-y-3">
              {["Everything in Pro", "Batch student analytics", "Dedicated support manager"].map((feat, fIdx) => (
                <li key={fIdx} className="flex gap-2 text-xs text-slate-655 dark:text-slate-400 items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => handleCheckout("Enterprise Plan")}
            className="w-full text-center py-3 border border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 rounded-xl text-xs font-bold mt-8 transition cursor-pointer"
          >
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  )
}
export default UpgradePage
