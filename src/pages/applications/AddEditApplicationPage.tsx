import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"
import { Briefcase, ArrowLeft, Loader2, X, FileText, Upload } from "lucide-react"
import { useApplications } from "../../hooks/useApplications"
import PageHeader from "../../components/shared/PageHeader"
import { toast } from "sonner"
import type { Application } from "../../types"

const applicationFormSchema = zod.object({
  companyName: zod.string().min(1, "Company Name is required"),
  jobTitle: zod.string().min(1, "Job Title is required"),
  location: zod.string().min(1, "Location is required"),
  jobType: zod.enum(["full-time", "part-time", "internship", "contract"]),
  status: zod.enum(
    ["applied", "under-review", "phone-screen", "technical", "hr-round", "final-round", "offer", "rejected", "withdrawn"]
  ),
  priority: zod.enum(["high", "medium", "low"]),
  appliedDate: zod.string().min(1, "Applied Date is required"),
  source: zod.enum(["linkedin", "naukri", "company-site", "referral", "other"]),
  jobDescriptionUrl: zod.string().url("Must be a valid URL").or(zod.literal("")),
  notes: zod.string().optional(),
  nextFollowUp: zod.string().optional(),
  jdText: zod.string().optional(),
})

type ApplicationFormInputs = zod.infer<typeof applicationFormSchema>

export const AddEditApplicationPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = !!id
  const { createApplication, updateApplication, getApplicationQuery } = useApplications()

  // Tag Input State
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  // PDF upload state
  const [resumePdfBase64, setResumePdfBase64] = useState<string>("")
  const [pdfFileName, setPdfFileName] = useState<string>("")

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormInputs>({
    resolver: zodResolver(applicationFormSchema) as any,
    defaultValues: {
      appliedDate: new Date().toISOString().split("T")[0],
      status: "applied",
      priority: "medium",
      source: "linkedin",
      jobDescriptionUrl: "",
      jdText: "",
    },
  })

  // Load existing application if edit mode
  const { data: existingApp, isLoading: isAppLoading } = getApplicationQuery(id || "")

  useEffect(() => {
    if (isEditMode && existingApp) {
      reset({
        companyName: existingApp.companyName,
        jobTitle: existingApp.jobTitle,
        location: existingApp.location,
        jobType: existingApp.jobType,
        status: existingApp.status,
        priority: existingApp.priority,
        appliedDate: existingApp.appliedDate,
        source: existingApp.source,
        jobDescriptionUrl: existingApp.jobDescriptionUrl ?? "",
        notes: existingApp.notes ?? "",
        nextFollowUp: existingApp.nextFollowUp ?? "",
        jdText: existingApp.jdText ?? "",
      })
      setTags(existingApp.tags ?? [])
      setResumePdfBase64(existingApp.resumePdf ?? "")
      setPdfFileName(existingApp.resumePdf ? "attached_resume.pdf" : "")
    }
  }, [existingApp, isEditMode, reset])

  // Tags handlings
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, idx) => idx !== index))
  }

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only.")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB.")
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64String = event.target?.result as string
      setResumePdfBase64(base64String)
      setPdfFileName(file.name)
      toast.success("PDF uploaded successfully!")
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePdf = () => {
    setResumePdfBase64("")
    setPdfFileName("")
    toast.success("Resume PDF removed.")
  }

  const onSubmit = async (data: ApplicationFormInputs) => {
    const formattedData: Omit<Application, "id"> = {
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      location: data.location,
      jobType: data.jobType,
      status: data.status,
      priority: data.priority,
      appliedDate: data.appliedDate,
      source: data.source,
      tags: tags,
      notes: data.notes,
      nextFollowUp: data.nextFollowUp || undefined,
      jobDescriptionUrl: data.jobDescriptionUrl || undefined,
      jdText: data.jdText || undefined,
      resumePdf: resumePdfBase64 || undefined,
    }

    try {
      if (isEditMode && id) {
        await updateApplication({ id, data: formattedData })
        toast.success("Application updated successfully!")
      } else {
        await createApplication(formattedData)
        toast.success("Application created successfully!")
      }
      navigate("/applications")
    } catch (error) {
      toast.error("An error occurred while saving the application.")
    }
  }

  if (isEditMode && isAppLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/applications")}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <PageHeader
          title={isEditMode ? "Edit Application" : "New Application"}
          description={isEditMode ? "Modify existing application files" : "Log a new application to your board"}
          icon={<Briefcase className="w-5 h-5" />}
          className="mb-0"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* SECTION 1: Company Info */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white border-b pb-2">
            Section 1 — Company Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Company Name *
              </label>
              <input
                {...register("companyName")}
                type="text"
                placeholder="Google, Stripe, etc."
                className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-sm bg-transparent"
              />
              {errors.companyName && (
                <span className="text-[10px] text-danger font-semibold mt-1 block">
                  {errors.companyName.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Location *
              </label>
              <input
                {...register("location")}
                type="text"
                placeholder="Bengaluru, Remote, etc."
                className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-sm bg-transparent"
              />
              {errors.location && (
                <span className="text-[10px] text-danger font-semibold mt-1 block">
                  {errors.location.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Position Details */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white border-b pb-2">
            Section 2 — Position Details
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Job Title *
              </label>
              <input
                {...register("jobTitle")}
                type="text"
                placeholder="SDE-2 Backend Engineer"
                className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-sm bg-transparent"
              />
              {errors.jobTitle && (
                <span className="text-[10px] text-danger font-semibold mt-1 block">
                  {errors.jobTitle.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Job Type *
              </label>
              <select
                {...register("jobType")}
                className="w-full mt-1.5 px-3 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-card text-slate-800 dark:text-white"
              >
                <option value="">Select Option</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
              {errors.jobType && (
                <span className="text-[10px] text-danger font-semibold mt-1 block">
                  {errors.jobType.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Job Description Text
            </label>
            <textarea
              {...register("jdText")}
              rows={5}
              placeholder="Paste the job description text here..."
              className="w-full mt-1.5 px-4 py-2.5 border border-slate-250 dark:border-slate-800 rounded-xl text-sm bg-transparent focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Job Description URL
            </label>
            <input
              {...register("jobDescriptionUrl")}
              type="text"
              placeholder="https://careers.company.com/job/123"
              className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-sm bg-transparent"
            />
            {errors.jobDescriptionUrl && (
              <span className="text-[10px] text-danger font-semibold mt-1 block">
                {errors.jobDescriptionUrl.message}
              </span>
            )}
          </div>
        </div>

        {/* SECTION 3: Application Info */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white border-b pb-2">
            Section 3 — Timeline Details
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Date Applied *
              </label>
              <input
                {...register("appliedDate")}
                type="date"
                className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-sm bg-transparent text-slate-800 dark:text-white"
              />
              {errors.appliedDate && (
                <span className="text-[10px] text-danger font-semibold mt-1 block">
                  {errors.appliedDate.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Source *
              </label>
              <select
                {...register("source")}
                className="w-full mt-1.5 px-3 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-card text-slate-800 dark:text-white"
              >
                <option value="linkedin">LinkedIn</option>
                <option value="naukri">Naukri</option>
                <option value="company-site">Company Careers</option>
                <option value="referral">Employee Referral</option>
                <option value="other">Other Platform</option>
              </select>
              {errors.source && (
                <span className="text-[10px] text-danger font-semibold mt-1 block">
                  {errors.source.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Follow-up Date
              </label>
              <input
                {...register("nextFollowUp")}
                type="date"
                className="w-full mt-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-sm bg-transparent text-slate-800 dark:text-white"
              />
            </div>
          </div>


        </div>

        {/* SECTION 4: Status & Priority */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white border-b pb-2">
            Section 4 — Status & Priority
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Application Status *
              </label>
              <select
                {...register("status")}
                className="w-full mt-1.5 px-3 py-2 border border-slate-250 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-card text-slate-800 dark:text-white font-semibold"
              >
                <option value="applied">Applied</option>
                <option value="under-review">Under Review</option>
                <option value="phone-screen">Phone Screen</option>
                <option value="technical">Technical Round</option>
                <option value="hr-round">HR / Googliness Round</option>
                <option value="final-round">Final Round</option>
                <option value="offer">Offer Received</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Priority *
              </label>
              <div className="flex gap-4 mt-2">
                {["high", "medium", "low"].map((pOption) => (
                  <label key={pOption} className="flex items-center gap-2 text-xs font-semibold cursor-pointer capitalize">
                    <input
                      {...register("priority")}
                      type="radio"
                      value={pOption}
                      className="rounded-full text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    />
                    {pOption}
                  </label>
                ))}
              </div>
              {errors.priority && (
                <span className="text-[10px] text-danger font-semibold mt-1 block">
                  {errors.priority.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 5: Notes & Tags */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white border-b pb-2">
            Section 5 — Notes & Tags
          </h3>
          
          {/* Tags list */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Tags (Press Enter to add)
            </label>
            <div className="flex flex-wrap items-center gap-2 mt-2 p-2 border border-slate-250 dark:border-slate-800 rounded-xl bg-transparent min-h-11">
              {tags.map((tag, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold select-none border border-primary/15">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(idx)}
                    className="p-0.5 hover:bg-primary/20 rounded-full cursor-pointer text-indigo-400 hover:text-indigo-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                type="text"
                placeholder={tags.length === 0 ? "e.g. backend, remote, FAANG" : ""}
                className="border-0 focus:ring-0 p-0 text-sm bg-transparent flex-1 placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Additional Notes
            </label>
            <textarea
              {...register("notes")}
              rows={4}
              placeholder="Record any details about company research, conversation notes, or salary expectations..."
              className="w-full mt-1.5 px-4 py-2.5 border border-slate-250 dark:border-slate-800 rounded-xl text-sm bg-transparent focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        {/* SECTION 6: Resume Attachment */}
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white border-b pb-2">
            Section 6 — Resume Attachment
          </h3>
          
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Upload Resume (PDF only, max 2MB)
            </label>
            
            {resumePdfBase64 ? (
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-indigo-500/10 text-primary rounded-xl shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="text-xs font-bold truncate block">{pdfFileName || "attached_resume.pdf"}</span>
                    <span className="text-[9px] text-slate-450 font-semibold block mt-0.5">PDF Ready for Saving</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePdf}
                  className="p-1 hover:text-danger text-slate-400 transition cursor-pointer"
                  title="Remove PDF"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-250 dark:border-slate-800 rounded-2xl p-6 hover:bg-slate-50/30 dark:hover:bg-slate-900/5 transition text-center cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    Click or drag PDF resume here
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Support PDF files up to 2MB
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/applications")}
            className="px-5 py-2.5 border border-slate-205 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Application"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
export default AddEditApplicationPage
