import React from "react"
import { useNavigate } from "react-router-dom"
import { CreditCard, Receipt, ChevronRight } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"
import Badge from "../../components/shared/Badge"

export const BillingPage: React.FC = () => {
  const navigate = useNavigate()

  const history = [
    { invoice: "INV-8219", date: "2025-05-15", amount: "$29.00", status: "paid" },
    { invoice: "INV-7291", date: "2025-04-15", amount: "$29.00", status: "paid" },
    { invoice: "INV-6182", date: "2025-03-15", amount: "$29.00", status: "paid" },
  ]

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="Billing & Subscription"
        description="Monitor invoice logs, update payment cards, and review plans"
        icon={<CreditCard className="w-5 h-5" />}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Plan summary */}
        <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Plan</span>
              <Badge variant="success">Pro Plan</Badge>
            </div>
            
            <h3 className="text-xl font-black text-slate-850 dark:text-white">$29.00 / month</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Your subscription will automatically renew on June 15, 2025 using card ending in 4242.
            </p>
          </div>

          <button
            onClick={() => navigate("/billing/upgrade")}
            className="mt-6 w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1 cursor-pointer"
          >
            Upgrade Plan Options
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Payment Method details */}
        <div className="bg-white dark:bg-card border border-slate-202 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-slate-400 shrink-0" /> Billing History
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-850">
            {history.map((inv) => (
              <div key={inv.invoice} className="py-2.5 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span className="text-slate-800 dark:text-slate-200">{inv.invoice}</span>
                <span>{inv.date}</span>
                <span className="font-bold text-slate-700 dark:text-white">{inv.amount}</span>
                <Badge variant="success">{inv.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default BillingPage
