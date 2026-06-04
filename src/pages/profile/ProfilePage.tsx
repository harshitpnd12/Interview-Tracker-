import React, { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { User, Save } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"
import Badge from "../../components/shared/Badge"
import { toast } from "sonner"

export const ProfilePage: React.FC = () => {
  const { user, updateProfileState } = useAuth()

  // Local state
  const [name, setName] = useState(user?.name || "Arjun Sharma")
  const [targetRole, setTargetRole] = useState(user?.targetRole || "")
  const [location, setLocation] = useState(user?.location || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [linkedin, setLinkedin] = useState(user?.linkedin || "")
  const [github, setGithub] = useState(user?.github || "")

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileState({
      name,
      targetRole,
      location,
      bio,
      linkedin,
      github
    })
    toast.success("Profile saved successfully!")
  }

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="My Career Profile"
        description="Configure your targets, biography, and platform identifiers"
        icon={<User className="w-5 h-5" />}
      />

      <form onSubmit={handleSave} className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Side: General Profile card (1/3 width) */}
        <div className="bg-white dark:bg-card border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between text-center max-w-sm w-full mx-auto">
          <div className="space-y-4 py-4">
            <div className="w-20 h-20 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-800 flex items-center justify-center font-bold text-white text-2xl mx-auto shadow-md">
              {name.split(" ").map((n) => n[0]).join("") || "US"}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-850 dark:text-white">{name}</h3>
              <p className="text-xs text-slate-450 mt-1">{user?.email || "arjun.sharma@gmail.com"}</p>
              <div className="mt-2.5 flex items-center justify-center gap-1.5">
                <Badge variant="success" className="uppercase font-black tracking-wider">{user?.plan || "pro"} Plan</Badge>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400 space-y-3">
            <div className="flex justify-between items-center">
              <span>Member Since</span>
              <span className="text-slate-800 dark:text-white font-bold">{user?.joinDate || "2025-01-15"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Account Type</span>
              <span className="text-slate-800 dark:text-white font-bold capitalize">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form details (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-card border border-slate-202 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-extrabold text-slate-850 dark:text-white uppercase tracking-wider border-b pb-2">
              General Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                  className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Target Role</label>
                <input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  type="text"
                  className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  type="text"
                  className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">LinkedIn profile</label>
                <input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  type="text"
                  className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">GitHub username</label>
              <input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                type="text"
                className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Biography</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full mt-1.5 px-4 py-2.5 border border-slate-250 dark:border-slate-800 rounded-xl text-xs bg-transparent focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  )
}
export default ProfilePage
