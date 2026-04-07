import React, { useEffect, useMemo, useState } from 'react'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { formatDate } from '../../utils/format.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminNotifications() {
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Notifications
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Review admin updates and system events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-600">
            Unread: <b>{unreadCount}</b>
          </div>
          <Button
            type="button"
            variant="secondary"
            disabled={unreadCount === 0}
            onClick={onMarkAllRead}
          >
            Mark all read
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center pt-10">
          <Spinner size={24} />
        </div>
      ) : error ? (
        <Card className="p-5">
          <div className="text-sm font-medium text-rose-700">{error}</div>
        </Card>
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You will see updates here when events occur."
        />
      ) : (
        <Card className="p-0">
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n._id}
                className="flex flex-wrap items-start justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-[260px] flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-slate-900">
                      {n.title}
                    </div>
                    {!n.isRead ? <Badge variant="info">New</Badge> : null}
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    {n.message}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    {formatDate(n.createdAt)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {n.isRead ? (
                    <Badge variant="success">Read</Badge>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => onMarkRead(n._id)}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}


