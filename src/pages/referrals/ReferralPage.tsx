import React, { useState } from "react"
import { Gift, Copy, Check, DollarSign, Users, Award, ShieldCheck, CreditCard, ChevronDown, ChevronUp } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"
import { useAuth } from "../../hooks/useAuth"
import { toast } from "sonner"

export const ReferralPage: React.FC = () => {
  const { user } = useAuth()
  
  // Custom mock referral link base
  const username = user?.email.split("@")[0] || "user"
  const referralLink = `https://interviewiq.ai/ref=${username}`
  const referralCode = username.toUpperCase() + "10"

  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [payoutEmail, setPayoutEmail] = useState("")
  const [showTerms, setShowTerms] = useState(false)

  // Interactive local states for referrals
  const [earnings, setEarnings] = useState(10.50) // e.g. 3 purchases @ $3.50
  const [referredCount] = useState(12)
  const [purchasedCount] = useState(3)
  const [payoutsList, setPayoutsList] = useState([
    { id: "po-1", date: "2026-05-10", amount: 7.00, method: "PayPal (arjun.sh***)", status: "Completed" }
  ])

  // Mock list of referrals
  const referralsHistory = [
    { email: "vikas.verma@outlook.com", date: "2026-06-02", status: "Premium Upgraded", payout: "$3.50" },
    { email: "sneha.k@razorpay.com", date: "2026-05-28", status: "Premium Upgraded", payout: "$3.50" },
    { email: "ankit.mehta@gmail.com", date: "2026-05-15", status: "Premium Upgraded", payout: "$3.50" },
    { email: "rohit_sharma@zepto.com", date: "2026-06-05", status: "Signed Up (Free)", payout: "$0.00" },
    { email: "deepika.padukone@gmail.com", date: "2026-06-03", status: "Signed Up (Free)", payout: "$0.00" },
    { email: "priya_patel@yahoo.com", date: "2026-05-20", status: "Signed Up (Free)", payout: "$0.00" },
  ]

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopiedLink(true)
    toast.success("Referral link copied to clipboard!")
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopiedCode(true)
    toast.success("Coupon code copied to clipboard!")
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault()
    if (!payoutEmail.trim()) {
      toast.error("Please enter a valid payout address.")
      return
    }
    if (earnings < 10) {
      toast.error("Minimum payout balance is $10.00.")
      return
    }

    const currentPayout = {
      id: `po-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString().split("T")[0],
      amount: earnings,
      method: payoutEmail,
      status: "Pending Approval"
    }

    setPayoutsList([currentPayout, ...payoutsList])
    toast.success(`Payout request of $${earnings.toFixed(2)} submitted!`)
    setEarnings(0)
    setPayoutEmail("")
  }

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="Refer & Earn Program"
        description="Share InterviewIQ with colleagues and earn cash commissions on upgrades"
        icon={<Gift className="w-5 h-5 text-indigo-500 fill-indigo-500/10" />}
      />

      {/* TOP: Earnings and referral links */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Total Earned */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <DollarSign className="absolute right-4 bottom-4 w-12 h-12 text-white/10 shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Balance Available</span>
          <h2 className="text-3xl font-black mt-2">${earnings.toFixed(2)}</h2>
          <p className="text-[10px] text-indigo-100 mt-2 font-semibold">Earn $3.50 per upgrading user</p>
        </div>

        {/* Invited Count */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <Users className="absolute right-4 bottom-4 w-10 h-10 text-slate-100 dark:text-slate-800 shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-450 block">Referred Sign-ups</span>
          <h2 className="text-3xl font-black mt-2 text-slate-800 dark:text-white">{referredCount}</h2>
          <p className="text-[10px] text-slate-400 mt-2 font-semibold">Conversion rate: {Math.round((purchasedCount/referredCount)*100)}%</p>
        </div>

        {/* Upgrade Count */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <Award className="absolute right-4 bottom-4 w-10 h-10 text-slate-100 dark:text-slate-800 shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-450 block">Premium Sales</span>
          <h2 className="text-3xl font-black mt-2 text-slate-800 dark:text-white">{purchasedCount}</h2>
          <p className="text-[10px] text-slate-400 mt-2 font-semibold">Active Pro/Prime subscriptions</p>
        </div>

        {/* Total payouts history info */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <CreditCard className="absolute right-4 bottom-4 w-10 h-10 text-slate-100 dark:text-slate-800 shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-450 block">Total Cashed Out</span>
          <h2 className="text-3xl font-black mt-2 text-slate-850 dark:text-white">
            ${payoutsList.reduce((sum, current) => sum + (current.status === "Completed" ? current.amount : 0), 0).toFixed(2)}
          </h2>
          <p className="text-[10px] text-slate-400 mt-2 font-semibold">{payoutsList.length} total request logs</p>
        </div>
      </div>

      {/* MIDDLE SECTION: Copy Utilities & Cash Out Forms */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sharing options */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider border-b pb-2">
            Invite Your Friends
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Give your friends an exclusive coupon code. When they upgrade, we'll deposit <strong>$3.50</strong> straight to your balance.
          </p>

          <div className="space-y-4">
            {/* Referral Link copy option */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wide">
                Your Referral Link
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={referralLink}
                  type="text"
                  className="flex-grow px-3 py-2 border border-slate-200 dark:border-slate-850 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy
                </button>
              </div>
            </div>

            {/* Referral Discount Coupon Code copy option */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-455 uppercase tracking-wide">
                Friend Discount Coupon (10% Off)
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={referralCode}
                  type="text"
                  className="flex-grow px-3 py-2 border border-slate-200 dark:border-slate-855 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 focus:outline-none font-bold text-slate-700 dark:text-slate-300"
                />
                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-855 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Cash Out portal */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-slate-400" /> Cash Out Earnings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We process payout requests within 2-3 business days. Minimum payout threshold is $10.00.
            </p>

            <form onSubmit={handleRequestPayout} className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wide">
                  Payout Method (PayPal email / UPI Address)
                </label>
                <input
                  required
                  value={payoutEmail}
                  onChange={(e) => setPayoutEmail(e.target.value)}
                  type="text"
                  placeholder="e.g. arjun.sharma@paypal.com"
                  className="w-full px-3 py-2 border border-slate-250 dark:border-slate-850 rounded-xl text-xs bg-transparent focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={earnings < 10}
                className="w-full text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Request Payout (${earnings.toFixed(2)})
              </button>
            </form>
          </div>

          <div className="flex items-center gap-1.5 mt-4 text-[10px] text-slate-450 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Encrypted billing and secure payouts guaranteed.</span>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: Terms & Conditions collapsible & Referral Logs table */}
      <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
            Referred Users History
          </h3>
          <span className="text-[10px] font-bold text-slate-450">List of invitations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-450 font-bold uppercase tracking-wider border-b dark:border-slate-800 pb-2">
                <th className="pb-3 text-sm font-semibold">User Email</th>
                <th className="pb-3 text-sm font-semibold">Register Date</th>
                <th className="pb-3 text-sm font-semibold">Referral Status</th>
                <th className="pb-3 text-sm font-semibold">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {referralsHistory.map((ref, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{ref.email}</td>
                  <td className="py-3 text-slate-500">{ref.date}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ref.status.includes("Upgraded") 
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400" 
                        : "bg-slate-100 text-slate-605 dark:bg-slate-800 dark:text-slate-400"
                    }`}>
                      {ref.status}
                    </span>
                  </td>
                  <td className={`py-3 font-bold ${ref.payout !== "$0.00" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                    {ref.payout}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Collapsible Terms and Conditions */}
        <div className="border-t dark:border-slate-850 pt-4">
          <button
            onClick={() => setShowTerms(!showTerms)}
            className="flex items-center justify-between w-full text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <span>Referral Program Terms & Conditions</span>
            {showTerms ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showTerms && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/30 border dark:border-slate-800 rounded-2xl text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed space-y-2 max-h-48 overflow-y-auto">
              <p className="font-bold text-slate-700 dark:text-slate-300">Last Updated: June 8, 2026</p>
              <p>
                1. <strong>Eligibility:</strong> The InterviewIQ Referral Program allows active users to earn cash bonuses by referring new users who successfully register and purchase a premium plan (Pro or Prime).
              </p>
              <p>
                2. <strong>Referral Tracking:</strong> Referrals are tracked via the custom link containing your unique username. Cookied user sign-ups remain valid for up to 30 days.
              </p>
              <p>
                3. <strong>Commission Payouts:</strong> For every referred user who purchases a premium upgrade, you will earn $3.50. You must hold a balance of at least $10.00 to request cash out.
              </p>
              <p>
                4. <strong>Abuse and Fraud:</strong> Self-referral loops, creating fake duplicate accounts, spam sharing on forums, or coupon stacking to deceive the tracking engine are strictly prohibited. Accounts engaging in suspicious actions will be terminated without payout.
              </p>
              <p>
                5. <strong>Taxes:</strong> All affiliates are responsible for tax filings regarding referral income depending on local jurisdiction guidelines.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default ReferralPage
