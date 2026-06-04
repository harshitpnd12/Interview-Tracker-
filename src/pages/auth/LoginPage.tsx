import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"
import { useAuth } from "../../hooks/useAuth"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"

const loginSchema = zod.object({
  email: zod.string().min(1, "Email is required").email("Invalid email format"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormInputs = zod.infer<typeof loginSchema>

export const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shouldShake, setShouldShake] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "arjun.sharma@gmail.com",
      password: "password123",
    }
  })

  const triggerShake = () => {
    setShouldShake(true)
    setTimeout(() => setShouldShake(false), 500)
  }

  const onSubmit = async (data: LoginFormInputs) => {
    setIsSubmitting(true)
    setErrorMsg(null)
    try {
      await login(data.email, data.password)
      navigate("/dashboard")
    } catch (err: any) {
      triggerShake()
      if (err.response?.status === 401) {
        setErrorMsg("Invalid email or password. Hint: try arjun.sharma@gmail.com / password123")
      } else {
        setErrorMsg("Server connection failed. Switched to offline database.")
        // Since login fallback triggers in AuthContext, we redirect anyway
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
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome back</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
          Sign in to access your interview workspace
        </p>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          onClick={() => {
            login("arjun.sharma@gmail.com", "password").then(() => navigate("/dashboard"))
          }}
          type="button"
          className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>
        <button
          onClick={() => {
            login("arjun.sharma@gmail.com", "password").then(() => navigate("/dashboard"))
          }}
          type="button"
          className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer"
        >
          <svg className="w-4 h-4 text-slate-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          GitHub
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute left-0 right-0 h-px bg-slate-150 dark:bg-slate-850" />
        <span className="relative px-3 bg-white dark:bg-card text-[10px] uppercase font-bold text-slate-400">
          or continue with email
        </span>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/35 rounded-xl flex items-start gap-2.5 text-xs text-danger">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-4">
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
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-primary hover:text-indigo-600 transition"
            >
              Forgot Password?
            </Link>
          </div>
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
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-primary hover:bg-primary/95 disabled:bg-primary/80 text-white rounded-xl text-sm font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-6"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="text-center text-xs text-slate-500 dark:text-slate-450 mt-6 select-none">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-primary hover:text-indigo-600 transition">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  )
}
export default LoginPage
