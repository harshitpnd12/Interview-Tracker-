import React, { useState } from "react"
import { Shield, Bell, Lock, Save } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"
import { toast } from "sonner"

export const SettingsPage: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [mfa, setMfa] = useState(true)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Settings saved successfully!")
  }

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="Settings & Privacy"
        description="Configure your notifications frequency and safety options"
        icon={<Shield className="w-5 h-5" />}
      />

      <form onSubmit={handleSave} className="max-w-2xl bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        {/* Notifications */}
        <div className="space-y-4 text-left">
          <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-slate-400 shrink-0" /> Notification Rules
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded text-primary focus:ring-primary h-4 w-4 mt-0.5"
              />
              <div className="text-xs leading-normal">
                <span className="font-bold text-slate-700 dark:text-slate-200 block">Email Alerts</span>
                <span className="text-slate-450">Send weekly activity reports, rejection gap alerts and reminders.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="rounded text-primary focus:ring-primary h-4 w-4 mt-0.5"
              />
              <div className="text-xs leading-normal">
                <span className="font-bold text-slate-700 dark:text-slate-200 block">SMS Alerts</span>
                <span className="text-slate-455">Send SMS reminders 1 hour before scheduled mock sessions.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="space-y-4 text-left border-t border-slate-100 dark:border-slate-800 pt-6">
          <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-slate-400 shrink-0" /> Security Guard
          </h3>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={mfa}
              onChange={(e) => setMfa(e.target.checked)}
              className="rounded text-primary focus:ring-primary h-4 w-4 mt-0.5"
            />
            <div className="text-xs leading-normal">
              <span className="font-bold text-slate-700 dark:text-slate-200 block">Multi-Factor Auth (MFA)</span>
              <span className="text-slate-450">Protect profile settings using Google Authenticator codes.</span>
            </div>
          </label>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save preferences
          </button>
        </div>
      </form>
    </div>
  )
}
export default SettingsPage
