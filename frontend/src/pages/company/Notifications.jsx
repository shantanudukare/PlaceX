import React, { useEffect, useMemo, useState } from 'react'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { formatDate } from '../../utils/format.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function CompanyNotifications() {
  const toast = useToast()

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await http.get('/api/notifications')
        const payload = res?.data?.data || []
        if (!mounted) return
        setNotifications(payload)
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load notifications')
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  )

  async function onMarkRead(id) {
    try {
      await http.put(`/api/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      )
      toast.pushToast({ type: 'success', message: 'Marked as read' })
    } catch (err) {
      toast.pushToast({ type: 'error', message: err?.message || 'Failed' })
    }
  }

  async function onMarkAllRead() {
    try {
      await http.put('/api/notifications/read-all')
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      toast.pushToast({ type: 'success', message: 'All marked as read' })
    } catch (err) {
      toast.pushToast({ type: 'error', message: err?.message || 'Failed' })
    }
  }

  return (
  <div className="relative">

    {/* Background Blur */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-20 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
    </div>

    <div className="relative z-10 space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">

        <div>
          <h2 className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-600 bg-clip-text text-3xl font-bold text-transparent">
            Notifications
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Stay updated with applications, approvals, and hiring activity.
          </p>
        </div>

        {/* Unread + Button */}
        <div className="flex flex-wrap items-center gap-3">

          <div className="rounded-2xl border border-white/40 bg-white/70 px-5 py-3 shadow-lg backdrop-blur-xl">

            <div className="text-xs font-medium text-slate-500">
              Unread Notifications
            </div>

            <div className="mt-1 text-2xl font-bold text-slate-900">
              {unreadCount}
            </div>
          </div>

          <button
            type="button"
            disabled={unreadCount === 0}
            onClick={onMarkAllRead}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center pt-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/70 shadow-xl backdrop-blur-xl">
            <Spinner size={28} />
          </div>
        </div>
      ) : error ? (

        /* Error */
        <Card className="rounded-[28px] border border-rose-200 bg-rose-50/80 p-6 shadow-lg backdrop-blur-xl">
          <div className="text-sm font-semibold text-rose-700">
            {error}
          </div>
        </Card>
      ) : notifications.length === 0 ? (

        /* Empty */
        <div className="rounded-[32px] border border-white/40 bg-white/70 p-10 text-center shadow-2xl backdrop-blur-xl">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 text-3xl text-white shadow-xl">
            🔔
          </div>

          <h3 className="mt-6 text-2xl font-bold text-slate-900">
            No Notifications
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            Notifications will appear here when updates happen.
          </p>
        </div>
      ) : (

        /* Notification Cards */
        <div className="space-y-5">

          {notifications.map((n) => (
            <div
              key={n._id}
              className={`group relative overflow-hidden rounded-[30px] border p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
                n.isRead
                  ? 'border-white/40 bg-white/70'
                  : 'border-cyan-200 bg-gradient-to-r from-cyan-50/90 to-blue-50/90'
              }`}
            >

              {/* Blur */}
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/20" />

              <div className="relative z-10 flex flex-wrap items-start justify-between gap-5">

                {/* Left */}
                <div className="min-w-[260px] flex-1">

                  <div className="flex flex-wrap items-center gap-3">

                    {/* Icon */}
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-lg ${
                        n.isRead
                          ? 'bg-slate-100'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                      }`}
                    >
                      {n.isRead ? '📩' : '🔔'}
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {n.title}
                      </h3>

                      <div className="mt-1 flex items-center gap-2">

                        {!n.isRead ? (
                          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-700">
                            New
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Read
                          </span>
                        )}

                        <span className="text-xs text-slate-500">
                          {formatDate(
                            n.createdAt
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mt-5 rounded-2xl bg-white/70 p-4 text-sm leading-7 text-slate-700 shadow-sm backdrop-blur-xl">
                    {n.message}
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center">

                  {n.isRead ? (
                    <div className="rounded-2xl bg-emerald-100 px-5 py-3 text-sm font-semibold text-emerald-700">
                      ✓ Read
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onMarkRead(n._id)
                      }
                      className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)
}


