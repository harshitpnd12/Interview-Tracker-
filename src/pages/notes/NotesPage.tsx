import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { FileText, Search, Plus, Star, ArrowRight, Tag } from "lucide-react"
import { notesApi } from "../../api/notes.api"
import { demoNotes } from "../../lib/demo-data"
import PageHeader from "../../components/shared/PageHeader"
import Badge from "../../components/shared/Badge"

export const NotesPage: React.FC = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      try {
        return await notesApi.getAllNotes()
      } catch {
        return demoNotes
      }
    },
    placeholderData: demoNotes,
  })

  const filteredNotes = React.useMemo(() => {
    const list = notes || []
    if (!search) return list
    return list.filter(
      (n) =>
        n.companyName.toLowerCase().includes(search.toLowerCase()) ||
        n.roundName.toLowerCase().includes(search.toLowerCase()) ||
        n.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    )
  }, [notes, search])

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="Interview Notes"
        description="Review logged questions, ratings, and learning topics from panels"
        icon={<FileText className="w-5 h-5" />}
      >
        <button
          onClick={() => navigate("/interview-notes/new")}
          className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </PageHeader>

      {/* Search Toolbar */}
      <div className="relative max-w-md w-full">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search by company, round, or topic tag..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-250 dark:border-slate-800 bg-white dark:bg-card rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>

      {isLoading ? (
        <div className="text-xs text-slate-400">Loading interview notes...</div>
      ) : filteredNotes.length === 0 ? (
        <div className="py-20 text-center border border-dashed rounded-3xl bg-white dark:bg-card p-8">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-base font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">
            No Interview Notes Logged
          </h3>
          <p className="text-xs text-slate-450 mt-2 max-w-sm mx-auto leading-relaxed">
            Record questions, panel feedback, and self ratings after completing your rounds.
          </p>
          <button
            onClick={() => navigate("/interview-notes/new")}
            className="mt-6 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            Create First Note
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => navigate(`/interview-notes/${note.id}`)}
              className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-850 dark:text-white">
                      {note.companyName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{note.roundName}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold shrink-0">{note.date}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    Self Rating: {note.selfRating}/5
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed truncate-2-lines">
                  {note.wentWell}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1 text-[10px]">
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end text-xs font-bold text-primary hover:text-indigo-650">
                View & Edit Note
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default NotesPage
