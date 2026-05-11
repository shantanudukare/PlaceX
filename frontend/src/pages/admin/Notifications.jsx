import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { http } from '../../api/http'

import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'

import { formatDate } from '../../utils/format.js'

import { useToast } from '../../context/ToastContext.jsx'

import {
  Bell,
  CheckCheck,
  Clock3,
  Sparkles,
} from 'lucide-react'

export default function AdminNotifications() {
  const toast = useToast()

  const [notifications, setNotifications] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        setLoading(true)

        setError('')

        const res = await http.get(
          '/api/notifications'
        )

        const payload =
          res?.data?.data || []

        if (!mounted) return

        setNotifications(payload)
      } catch (err) {
        if (!mounted) return

        setError(
          err?.message ||
            'Failed to load notifications'
        )
      } finally {
        if (mounted)
          setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (n) => !n.isRead
      ).length,
    [notifications]
  )

  async function onMarkRead(id) {
    try {
      await http.put(
        `/api/notifications/${id}/read`
      )

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id
            ? {
                ...n,
                isRead: true,
              }
            : n
        )
      )

      toast.pushToast({
        type: 'success',
        message: 'Marked as read',
      })
    } catch (err) {
      toast.pushToast({
        type: 'error',
        message:
          err?.message || 'Failed',
      })
    }
  }

  async function onMarkAllRead() {
    try {
      await http.put(
        '/api/notifications/read-all'
      )

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true,
        }))
      )

      toast.pushToast({
        type: 'success',
        message:
          'All marked as read',
      })
    } catch (err) {
      toast.pushToast({
        type: 'error',
        message:
          err?.message || 'Failed',
      })
    }
  }

  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-2xl">

        {/* Blur */}
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
              <Bell size={30} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Notifications
              </h1>

              <p className="mt-1 text-sm text-slate-300">
                Review admin updates
                and system events.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-wrap items-center gap-4">

            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
              <p className="text-sm text-slate-300">
                Unread Notifications
              </p>

              <h3 className="mt-1 text-3xl font-bold text-white">
                {unreadCount}
              </h3>
            </div>

            <button
              type="button"
              disabled={
                unreadCount === 0
              }
              onClick={onMarkAllRead}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck size={18} />

              Mark all read
            </button>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center pt-16">
          <div className="flex flex-col items-center gap-4">
            <Spinner size={28} />

            <p className="text-sm text-slate-500">
              Loading notifications...
            </p>
          </div>
        </div>
      ) : error ? (

        /* ERROR */
        <Card className="rounded-[28px] border border-rose-200 bg-rose-50/70 p-6 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-rose-700">
            {error}
          </div>
        </Card>
      ) : notifications.length === 0 ? (

        /* EMPTY */
        <div className="rounded-[30px] border border-dashed border-slate-300 bg-white/60 p-10 shadow-lg backdrop-blur-xl">
          <EmptyState
            title="No notifications"
            description="You will see updates here when events occur."
          />
        </div>
      ) : (

        /* NOTIFICATIONS LIST */
        <div className="space-y-5">

          {notifications.map((n) => (
            <div
              key={n._id}
              className={`group relative overflow-hidden rounded-[30px] border p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                n.isRead
                  ? 'border-white/40 bg-white/70'
                  : 'border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50'
              }`}
            >

              {/* Glow */}
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl transition-all duration-300 group-hover:bg-cyan-500/20" />

              <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                {/* CONTENT */}
                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-3">

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg ${
                        n.isRead
                          ? 'bg-gradient-to-br from-slate-500 to-slate-700'
                          : 'bg-gradient-to-br from-blue-600 to-cyan-500'
                      }`}
                    >
                      {n.isRead ? (
                        <CheckCheck
                          size={24}
                        />
                      ) : (
                        <Sparkles
                          size={24}
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h2 className="text-xl font-bold text-slate-900">
                          {n.title}
                        </h2>

                        {!n.isRead ? (
                          <Badge variant="info">
                            New
                          </Badge>
                        ) : (
                          <Badge variant="success">
                            Read
                          </Badge>
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">

                        <Clock3
                          size={15}
                        />

                        {formatDate(
                          n.createdAt
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-700">
                    {n.message}
                  </p>
                </div>

                {/* ACTION */}
                {!n.isRead ? (
                  <div className="flex shrink-0">

                    <button
                      type="button"
                      onClick={() =>
                        onMarkRead(
                          n._id
                        )
                      }
                      className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                    >
                      <CheckCheck
                        size={18}
                      />

                      Mark read
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}