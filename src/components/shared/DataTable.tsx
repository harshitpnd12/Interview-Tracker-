import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpDown, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Inbox } from "lucide-react"
import { cn } from "../../lib/utils"
import EmptyState from "./EmptyState"

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onRowClick?: (row: T) => void
  bulkActions?: (selectedRows: T[]) => React.ReactNode
  searchable?: boolean
  selectable?: boolean
  pageSize?: number
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  onRowClick,
  bulkActions,
  selectable = false,
  pageSize = 10,
}: DataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)

  // Sorting logic
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const sortedData = useMemo(() => {
    if (!sortKey) return data

    return [...data].sort((a: any, b: any) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]

      if (aVal === undefined || aVal === null) return 1
      if (bVal === undefined || bVal === null) return -1

      if (typeof aVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      return sortDirection === "asc" ? aVal - bVal : bVal - aVal
    })
  }, [data, sortKey, sortDirection])

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  // Select all logic
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageIds = paginatedData.map((row) => row.id)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])))
    } else {
      const pageIds = paginatedData.map((row) => row.id)
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((rowId) => rowId !== id))
    }
  }

  const isAllPageSelected = useMemo(() => {
    if (paginatedData.length === 0) return false
    return paginatedData.every((row) => selectedIds.includes(row.id))
  }, [paginatedData, selectedIds])

  const selectedRowsData = useMemo(() => {
    return data.filter((row) => selectedIds.includes(row.id))
  }, [data, selectedIds])

  return (
    <div className="relative border border-slate-200 dark:border-slate-800 bg-white dark:bg-card rounded-2xl shadow-sm overflow-hidden flex flex-col">
      
      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              {selectable && (
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllPageSelected}
                    onChange={handleSelectAll}
                    className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={cn(
                    "p-4 text-sm font-semibold select-none",
                    col.sortable ? "cursor-pointer hover:text-slate-950 dark:hover:text-white" : ""
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <span className="text-slate-400">
                        {sortKey === col.key ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
            {loading ? (
              // Skeleton Loader Rows
              Array.from({ length: pageSize }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {selectable && (
                    <td className="p-4 text-center">
                      <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded mx-auto" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="p-4">
                      <div className="h-4 bg-slate-250 dark:bg-slate-700 rounded w-5/6" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-8">
                  <EmptyState
                    icon={Inbox}
                    title="No records found"
                    description="Try tweaking your filters or search query to find what you are looking for."
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const isSelected = selectedIds.includes(row.id)
                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={cn(
                      "hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors",
                      onRowClick ? "cursor-pointer" : "",
                      isSelected ? "bg-primary/5 dark:bg-primary/10" : ""
                    )}
                  >
                    {selectable && (
                      <td
                        className="p-4 text-center"
                        onClick={(e) => e.stopPropagation()} // Prevent row click trigger
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                          className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const val = (row as any)[col.key]
                      return (
                        <td key={col.key} className="p-4 text-sm text-slate-600 dark:text-slate-300">
                          {col.render ? col.render(val, row) : String(val ?? "")}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && !loading && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-250 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-900/10">
          <div>
            Showing {Math.min(data.length, (currentPage - 1) * pageSize + 1)}-
            {Math.min(data.length, currentPage * pageSize)} of {data.length} records
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-xs font-bold transition",
                    currentPage === p
                      ? "bg-primary text-white border-primary"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                  )}
                >
                  {p}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bulk actions drawer */}
      <AnimatePresence>
        {selectable && selectedIds.length > 0 && bulkActions && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-30"
          >
            <span className="text-xs font-bold">
              {selectedIds.length} item{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <div className="h-4 w-px bg-slate-700 dark:bg-slate-300" />
            <div className="flex items-center gap-3">
              {bulkActions(selectedRowsData)}
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-black font-semibold transition cursor-pointer"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
