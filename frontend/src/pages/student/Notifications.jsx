import React, { useEffect, useMemo, useState } from 'react'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { formatDate } from '../../utils/format.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function StudentNotifications() {
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
      <div className="absolute -top-10 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
    </div>

    <div className="relative z-10 space-y-8">

      {/* HEADER */}
      <div className="overflow-hidden rounded-[34px] bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-2xl">
        
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 backdrop-blur">
              Notifications Center
            </div>

            <h1 className="mt-5 text-4xl font-bold">
              Stay
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {' '}
                Updated
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
              Get updates about applications, placements,
              approvals and recruitment activities.
            </p>
          </div>

          {/* Unread Count */}
          <div className="rounded-3xl border border-white/10 bg-white/10 px-6 py-5 backdrop-blur-xl">
            <div className="text-sm text-slate-300">
              Unread Notifications
            </div>

            <div className="mt-2 text-4xl font-bold">
              {unreadCount}
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/40 bg-white/70 p-5 shadow-xl backdrop-blur-xl">
        
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Recent Notifications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            All important updates appear here
          </p>
        </div>

        <Button
          type="button"
          disabled={unreadCount === 0}
          onClick={onMarkAllRead}
          className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-white shadow-lg hover:from-blue-700 hover:to-cyan-600"
        >
          Mark all read
        </Button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center pt-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
            <Spinner size={28} />
          </div>
        </div>
      ) : error ? (
        <div className="rounded-[30px] border border-red-200 bg-red-50 p-6 shadow-lg">
          <div className="text-sm font-semibold text-red-700">
            {error}
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-[30px] border border-white/40 bg-white/70 p-10 shadow-xl backdrop-blur-xl">
          <EmptyState
            title="No notifications"
            description="You will see updates here once notifications are available."
          />
        </div>
      ) : (
        <div className="space-y-5">
          
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`group overflow-hidden rounded-[30px] border p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                n.isRead
                  ? 'border-white/40 bg-white/70'
                  : 'border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50'
              }`}
            >
              
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                
                {/* LEFT */}
                <div className="flex-1">
                  
                  <div className="flex flex-wrap items-center gap-3">
                    
                    <h3 className="text-xl font-bold text-slate-900">
                      {n.title}
                    </h3>

                    {!n.isRead ? (
                      <Badge
                        variant="info"
                        className="rounded-full px-3 py-1"
                      >
                        New
                      </Badge>
                    ) : (
                      <Badge
                        variant="success"
                        className="rounded-full px-3 py-1"
                      >
                        Read
                      </Badge>
                    )}
                  </div>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                    {n.message}
                  </p>

                  <div className="mt-5 text-xs font-medium text-slate-400">
                    {formatDate(n.createdAt)}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center">
                  {!n.isRead ? (
                    <Button
                      type="button"
                      onClick={() => onMarkRead(n._id)}
                      className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-white shadow-lg hover:from-blue-700 hover:to-cyan-600"
                    >
                      Mark Read
                    </Button>
                  ) : (
                    <div className="rounded-2xl bg-emerald-100 px-5 py-3 text-sm font-semibold text-emerald-700">
                      Already Read
                    </div>
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

