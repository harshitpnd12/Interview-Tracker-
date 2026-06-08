import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CreditCard, ArrowLeft, CheckCircle2, Ticket, Check, AlertCircle } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"
import { useAuth } from "../../hooks/useAuth"
import { toast } from "sonner"
import { cn } from "../../lib/utils"

export const UpgradePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, updateProfileState } = useAuth()
  
  // Billing cycle state: false = Monthly, true = Annually
  const [isAnnual, setIsAnnual] = useState(false)

  // Coupon states
  const [couponInput, setCouponInput] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [couponError, setCouponError] = useState("")

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError("")
    const code = couponInput.trim().toUpperCase()

    if (!code) {
      setCouponError("Please enter a code.")
      return
    }

    if (code === "SAVE20") {
      setAppliedCoupon("SAVE20")
      setDiscountPercent(20)
      toast.success("Coupon 'SAVE20' applied! 20% discount calculated.")
    } else if (code === "FIRST50") {
      setAppliedCoupon("FIRST50")
      setDiscountPercent(50)
      toast.success("Coupon 'FIRST50' applied! 50% discount calculated.")
    } else if (code === "FREEBIE") {
      setAppliedCoupon("FREEBIE")
      setDiscountPercent(100)
      toast.success("Coupon 'FREEBIE' applied! 100% off calculated.")
    } else {
      setCouponError("Invalid coupon code. Try 'SAVE20' or 'FIRST50'.")
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setDiscountPercent(0)
    setCouponInput("")
    setCouponError("")
    toast.info("Coupon removed.")
  }

  const handleCheckout = (planKey: "free" | "pro" | "prime" | "custom", price: number | string) => {
    if (planKey === "custom") {
      toast.success("Sales query received! An advisor will reach out to you within 24 hours.")
      return
    }

    // Set corresponding limits based on plan
    const tokenLimits = {
      free: { used: 2, total: 5 },
      pro: { used: 42, total: 100 },
      prime: { used: 185, total: 99999 }, // Unlimited representation
    }

    const limits = tokenLimits[planKey as keyof typeof tokenLimits] || { used: 0, total: 0 }

    updateProfileState({
      plan: planKey,
      tokensUsed: limits.used,
      tokensTotal: limits.total
    })

    const couponMessage = appliedCoupon ? ` with coupon ${appliedCoupon}` : ""
    toast.success(`Upgraded to ${planKey.toUpperCase()} Plan${couponMessage}! Billed $${price}.`)
    setTimeout(() => navigate("/billing"), 1200)
  }

  // Plans pricing definition
  const plans = [
    {
      key: "free",
      name: "Free Plan",
      desc: "Essential tracking tools to organize your applications.",
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      features: [
        "Up to 10 job applications",
        "5 AI mock prep tokens total",
        "Basic keyword matching audit",
        "Timeline tracking view"
      ],
      cta: "Current Plan",
      colorClass: "border-slate-200 dark:border-slate-800"
    },
    {
      key: "pro",
      name: "Pro Plan",
      desc: "For active job seekers acing competitive tech rounds.",
      monthlyPrice: 19,
      annualPrice: 15, // 20% discount: $15/mo billed annually ($180)
      popular: false,
      features: [
        "Unlimited job applications",
        "100 AI prep tokens / month",
        "Advanced speech & code feedback",
        "Automated rejection audits",
        "Custom resume keyword tailoring"
      ],
      cta: "Upgrade to Pro",
      colorClass: "border-slate-200 dark:border-slate-800"
    },
    {
      key: "prime",
      name: "Prime Plan",
      desc: "Ultimate features for acing L4/L5 engineering loops.",
      monthlyPrice: 39,
      annualPrice: 31, // 20% discount: $31/mo billed annually ($372)
      popular: true,
      features: [
        "Everything in Pro",
        "Unlimited AI prep tokens / month",
        "1-on-1 resume optimization reviews",
        "Premium company prep questions",
        "Priority customer support"
      ],
      cta: "Go Prime",
      colorClass: "border-primary shadow-xl ring-2 ring-primary/10 dark:ring-primary/5"
    },
    {
      key: "custom",
      name: "Custom Plan",
      desc: "Enterprise grading features for colleges and bootcamps.",
      monthlyPrice: "Custom",
      annualPrice: "Custom",
      popular: false,
      features: [
        "Everything in Prime",
        "Batch student analytics dashboard",
        "Custom school branding integration",
        "SLA guaranteed mock review APIs",
        "Dedicated account manager support"
      ],
      cta: "Contact Sales",
      colorClass: "border-slate-200 dark:border-slate-800"
    }
  ]

  return (
    <div className="space-y-6 select-none text-left">
      {/* Back Header */}
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
        title="Choose Your Roadmap Plan"
        description="Select a subscription tiers built to secure high-tier product roles"
        icon={<CreditCard className="w-5 h-5" />}
      />

      {/* Toggle Monthly / Annual Billing */}
      <div className="flex flex-col items-center justify-center gap-4 pt-4">
        <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-1 rounded-2xl">
          <button
            onClick={() => setIsAnnual(false)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer",
              !isAnnual 
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer",
              isAnnual 
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            Annual Billing
            <span className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-500 rounded-md text-[9px] font-black uppercase">
              Save 20%
            </span>
          </button>
        </div>

        {/* Coupons Entry Box */}
        <div className="w-full max-w-sm">
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-grow">
              <input
                disabled={!!appliedCoupon}
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value)
                  setCouponError("")
                }}
                type="text"
                placeholder={appliedCoupon ? "Coupon active!" : "Enter coupon e.g. SAVE20"}
                className={cn(
                  "w-full pl-9 pr-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none bg-white dark:bg-card uppercase font-semibold",
                  appliedCoupon ? "border-emerald-500/30 text-emerald-500" : "border-slate-250 dark:border-slate-855"
                )}
              />
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            {appliedCoupon ? (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="px-3.5 py-2 border border-rose-200 bg-rose-500/10 text-rose-500 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white cursor-pointer transition shrink-0"
              >
                Remove
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-855 text-white rounded-xl text-xs font-bold cursor-pointer transition shrink-0"
              >
                Apply
              </button>
            )}
          </form>
          {couponError && (
            <p className="text-[10px] text-danger font-semibold mt-1 text-center flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {couponError}
            </p>
          )}
          {appliedCoupon && (
            <p className="text-[10px] text-emerald-500 font-bold mt-1 text-center flex items-center justify-center gap-1">
              <Check className="w-3.5 h-3.5 shrink-0" />
              Coupon {appliedCoupon} applied ({discountPercent}% Discount!)
            </p>
          )}
        </div>
      </div>

      {/* Grid of Plans */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {plans.map((p) => {
          // Calculations
          const basePrice = isAnnual ? p.annualPrice : p.monthlyPrice
          const isNumeric = typeof basePrice === "number"

          let finalPrice = basePrice
          let discountVal = 0

          if (isNumeric && typeof basePrice === "number") {
            discountVal = Math.round(basePrice * (discountPercent / 100) * 100) / 100
            finalPrice = basePrice - discountVal
          }

          const isCurrentPlan = user?.plan === p.key

          return (
            <div
              key={p.key}
              className={cn(
                "bg-white dark:bg-card border rounded-3xl p-6 relative flex flex-col justify-between transition-all hover:translate-y-[-2px] shadow-sm",
                p.popular ? "border-primary shadow-md" : "border-slate-200 dark:border-slate-850"
              )}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Popular Choice
                </span>
              )}

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{p.name}</h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 mt-1.5 leading-relaxed min-h-[40px]">{p.desc}</p>
                
                <div className="mt-4 flex items-baseline gap-1">
                  {isNumeric ? (
                    <>
                      <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        ${finalPrice.toFixed(2)}
                      </span>
                      <span className="text-slate-450 text-[10px] font-bold">/mo</span>
                    </>
                  ) : (
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {p.monthlyPrice}
                    </span>
                  )}
                </div>

                {/* Show discount info */}
                {appliedCoupon && isNumeric && discountVal > 0 && (
                  <div className="text-[10px] text-slate-400 mt-1.5 font-bold flex flex-col gap-0.5">
                    <span className="line-through text-slate-400/80">Regular: ${basePrice.toFixed(2)}/mo</span>
                    <span className="text-emerald-500">Save ${discountVal.toFixed(2)}/mo with {appliedCoupon}</span>
                  </div>
                )}

                {/* Annual billing detail text */}
                {isAnnual && isNumeric && (
                  <p className="text-[10px] text-slate-400 font-bold mt-1">
                    Billed annually (${(finalPrice * 12).toFixed(2)}/yr)
                  </p>
                )}

                <div className="h-px bg-slate-100 dark:bg-slate-850 my-5" />
                
                <ul className="space-y-3">
                  {p.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex gap-2 text-xs text-slate-655 dark:text-slate-400 items-start text-left">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                disabled={isCurrentPlan && p.key !== "custom"}
                onClick={() => handleCheckout(p.key as any, isNumeric ? (finalPrice * (isAnnual ? 12 : 1)).toFixed(2) : "Custom")}
                className={cn(
                  "w-full text-center py-2.5 rounded-xl text-xs font-bold mt-6 transition cursor-pointer",
                  isCurrentPlan
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-450 dark:text-slate-500 cursor-default"
                    : p.popular
                      ? "bg-primary hover:bg-primary/95 text-white shadow-md shadow-indigo-500/10"
                      : "border border-slate-205 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200"
                )}
              >
                {isCurrentPlan ? "Active Sub" : p.cta}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  )
}
export default UpgradePage
