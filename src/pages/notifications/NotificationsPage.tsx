import React from "react"
import { useNotifications } from "../../hooks/useNotifications"
import { Bell, Trash2, Sparkles } from "lucide-react"
import PageHeader from "../../components/shared/PageHeader"

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications()

  return (
    <div className="space-y-6 select-none text-left">
      <PageHeader
        title="Notifications Center"
        description="Monitor system updates, prep milestones, and application alerts"
        icon={<Bell className="w-5 h-5" />}
      >
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="px-4 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Mark All as Read
          </button>
        )}
      </PageHeader>

      <div className="max-w-3xl space-y-4">
        {notifications.length === 0 ? (
          <div className="py-20 text-center border border-dashed rounded-3xl bg-white dark:bg-card p-8">
            <Bell className="w-10 h-10 text-slate-400 mx-auto mb-4" />
            <h3 className="text-base font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">
              Inbox is empty
            </h3>
            <p className="text-xs text-slate-450 mt-2 max-w-sm mx-auto leading-relaxed">
              System alerts and interview reminders will show up here.
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-4 bg-white dark:bg-card border rounded-3xl shadow-sm flex items-start justify-between gap-4 transition hover:shadow-md cursor-pointer ${
                !notif.isRead ? "border-l-4 border-l-primary" : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-850 dark:text-white">
                    {notif.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {notif.description}
                  </p>
                  <span className="text-[9px] text-slate-400 font-bold block mt-2">
                    {notif.createdAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotification(notif.id)
                  }}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
export default NotificationsPage
