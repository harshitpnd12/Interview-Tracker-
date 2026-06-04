import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 relative z-10"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-danger rounded-xl shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm()
                }}
                className="px-4 py-2 bg-danger hover:bg-danger/90 text-white rounded-xl text-sm font-semibold shadow-md transition cursor-pointer"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
export default ConfirmDialog
