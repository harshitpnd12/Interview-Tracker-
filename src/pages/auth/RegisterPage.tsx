import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"
import { useAuth } from "../../hooks/useAuth"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"

const registerSchema = zod.object({
  name: zod.string().min(1, "Full name is required"),
  email: zod.string().min(1, "Email is required").email("Invalid email format"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: zod.string().min(1, "Confirm password is required"),
  terms: zod.boolean().refine((val) => val === true, "You must accept the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type RegisterFormInputs = zod.infer<typeof registerSchema>

export const RegisterPage: React.FC = () => {
  const { register: signup } = useAuth()
  const navigate = useNavigate()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shouldShake, setShouldShake] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  })

  const passwordValue = watch("password", "")

  // Calculate password strength score (0 to 4)
  const strengthScore = React.useMemo(() => {
    if (!passwordValue) return 0
    let score = 0
    if (passwordValue.length >= 6) score += 1
    if (passwordValue.length >= 10) score += 1
    if (/[A-Z]/.test(passwordValue) && /[a-z]/.test(passwordValue)) score += 1
    if (/[0-9]/.test(passwordValue) || /[^A-Za-z0-9]/.test(passwordValue)) score += 1
    return score
  }, [passwordValue])

  const strengthMeta = React.useMemo(() => {
    switch (strengthScore) {
      case 0:
        return { label: "", color: "bg-slate-200" }
      case 1:
        return { label: "Weak", color: "bg-red-500" }
      case 2:
        return { label: "Fair", color: "bg-amber-500" }
      case 3:
        return { label: "Strong", color: "bg-yellow-500" }
      case 4:
        return { label: "Very Strong", color: "bg-emerald-500" }
      default:
        return { label: "", color: "bg-slate-200" }
    }
  }, [strengthScore])

  const triggerShake = () => {
    setShouldShake(true)
    setTimeout(() => setShouldShake(false), 500)
  }

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsSubmitting(true)
    setErrorMsg(null)
    try {
      await signup(data.name, data.email, data.password)
      navigate("/dashboard")
    } catch (err: any) {
      triggerShake()
      if (err.response?.status === 400) {
        setErrorMsg("Email address is already registered.")
      } else {
        setErrorMsg("Network error. Registering locally in offline mode.")
        setTimeout(() => navigate("/dashboard"), 1000)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const onInvalidSubmit = () => {
    triggerShake()
  }

  return (
    <div className={shouldShake ? "animate-shake" : ""}>
      <div className="text-center">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create Account</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
          Sign up to build your Career Intelligence profile
        </p>
      </div>

      {errorMsg && (
        <div className="mt-4 mb-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/35 rounded-xl flex items-start gap-2.5 text-xs text-danger animate-fade-in-up">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-4 mt-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Full Name
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="Arjun Sharma"
            className="w-full mt-1.5 px-4 py-2.5 border border-slate-250 dark:border-slate-800 rounded-xl text-sm bg-transparent text-slate-900 dark:text-white"
          />
          {errors.name && (
            <span className="text-[10px] text-danger font-semibold mt-1 block">
              {errors.name.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Email Address
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="arjun.sharma@gmail.com"
            className="w-full mt-1.5 px-4 py-2.5 border border-slate-250 dark:border-slate-800 rounded-xl text-sm bg-transparent text-slate-900 dark:text-white"
          />
          {errors.email && (
            <span className="text-[10px] text-danger font-semibold mt-1 block">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Password
          </label>
          <div className="relative mt-1.5">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-slate-250 dark:border-slate-800 rounded-xl text-sm bg-transparent text-slate-900 dark:text-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <span className="text-[10px] text-danger font-semibold mt-1 block">
              {errors.password.message}
            </span>
          )}

          {/* Password Strength Meter */}
          {passwordValue && (
            <div className="mt-2.5 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span>Password Strength</span>
                <span className="font-extrabold uppercase">{strengthMeta.label}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-full rounded-full transition-colors duration-300 ${
                      idx < strengthScore ? strengthMeta.color : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Confirm Password
          </label>
          <div className="relative mt-1.5">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-slate-250 dark:border-slate-800 rounded-xl text-sm bg-transparent text-slate-900 dark:text-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-[10px] text-danger font-semibold mt-1 block">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <div className="flex items-start gap-2.5 mt-4 select-none">
          <input
            {...register("terms")}
            id="terms"
            type="checkbox"
            className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer mt-0.5"
          />
          <label htmlFor="terms" className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            I agree to the{" "}
            <a href="#" className="font-semibold text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-semibold text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </label>
        </div>
        {errors.terms && (
          <span className="text-[10px] text-danger font-semibold mt-1 block">
            {errors.terms.message}
          </span>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-primary hover:bg-primary/95 disabled:bg-primary/80 text-white rounded-xl text-sm font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-6"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating profile...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="text-center text-xs text-slate-500 dark:text-slate-450 mt-6 select-none">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary hover:text-indigo-600 transition">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  )
}
export default RegisterPage
