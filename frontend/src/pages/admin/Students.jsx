import React, {
  useEffect,
  useState,
} from 'react'

import { http } from '../../api/http'

import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Badge from '../../components/ui/Badge.jsx'

import { formatDate } from '../../utils/format.js'

import { useToast } from '../../context/ToastContext.jsx'

import {
  GraduationCap,
  Mail,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Users,
} from 'lucide-react'

export default function AdminStudents() {
  const toast = useToast()

  const [students, setStudents] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [processingId, setProcessingId] =
    useState(null)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        setLoading(true)

        setError('')

        const res = await http.get(
          '/api/admin/pending-students'
        )

        const payload =
          res?.data?.data || []

        if (!mounted) return

        setStudents(payload)
      } catch (err) {
        if (!mounted) return

        setError(
          err?.message ||
            'Failed to load pending students'
        )

        toast.pushToast({
          type: 'error',
          message:
            err?.message ||
            'Failed to load pending students',
        })
      } finally {
        if (mounted)
          setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  async function updateStatus(
    studentId,
    approvalStatus
  ) {
    setProcessingId(studentId)

    try {
      await http.put(
        `/api/admin/student/${studentId}/status`,
        {
          approvalStatus,
        }
      )

      toast.pushToast({
        type: 'success',
        message: `Student ${approvalStatus.toLowerCase()}`,
      })

      const refreshed =
        await http.get(
          '/api/admin/pending-students'
        )

      setStudents(
        refreshed?.data?.data || []
      )
    } catch (err) {
      toast.pushToast({
        type: 'error',
        message:
          err?.message ||
          'Update failed',
      })
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-2xl">

        {/* Glow */}
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
              <GraduationCap
                size={30}
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Approve Students
              </h1>

              <p className="mt-1 text-sm text-slate-300">
                Review student accounts
                waiting for approval.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
            <p className="text-sm text-slate-300">
              Pending Students :
              <span className="ml-2 font-semibold text-white">
                {students.length}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center pt-16">
          <div className="flex flex-col items-center gap-4">
            <Spinner size={28} />

            <p className="text-sm text-slate-500">
              Loading students...
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
      ) : students.length === 0 ? (

        /* EMPTY */
        <div className="rounded-[30px] border border-dashed border-slate-300 bg-white/60 p-10 shadow-lg backdrop-blur-xl">
          <EmptyState
            title="No pending students"
            description="Everything is up to date."
          />
        </div>
      ) : (

        /* STUDENTS GRID */
        <div className="grid gap-6 lg:grid-cols-2">

          {students.map((s) => (
            <div
              key={s._id}
              className="group relative overflow-hidden rounded-[30px] border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >

              {/* Glow */}
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl transition-all duration-300 group-hover:bg-cyan-500/20" />

              <div className="relative z-10">

                {/* TOP */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
                      <Users size={28} />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {s.fullName}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Student Account
                      </p>
                    </div>
                  </div>

                  <Badge variant="warning">
                    {s.approvalStatus}
                  </Badge>
                </div>

                {/* DETAILS */}
                <div className="mt-8 space-y-4">

                  <div className="flex items-center gap-3 text-slate-700">
                    <Mail size={18} />

                    <span className="text-sm">
                      {s.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700">
                    <CalendarDays
                      size={18}
                    />

                    <span className="text-sm">
                      Joined :
                      {' '}
                      {formatDate(
                        s.createdAt
                      )}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-8 flex flex-wrap gap-3">

                  <button
                    disabled={
                      processingId ===
                      s._id
                    }
                    onClick={() =>
                      updateStatus(
                        s._id,
                        'Approved'
                      )
                    }
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-60"
                  >
                    <CheckCircle2
                      size={18}
                    />

                    Approve
                  </button>

                  <button
                    disabled={
                      processingId ===
                      s._id
                    }
                    onClick={() =>
                      updateStatus(
                        s._id,
                        'Rejected'
                      )
                    }
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-60"
                  >
                    <XCircle
                      size={18}
                    />

                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}