import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { http } from '../../api/http'

import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Badge from '../../components/ui/Badge.jsx'

import {
  formatDate,
  formatMoney,
} from '../../utils/format.js'

import { useToast } from '../../context/ToastContext.jsx'

import {
  Search,
  Building2,
  MapPin,
  BriefcaseBusiness,
  CalendarDays,
  Users,
  CircleDollarSign,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

function approvalBadgeVariant(status) {
  if (status === 'Approved')
    return 'success'

  if (status === 'Pending')
    return 'warning'

  if (status === 'Rejected')
    return 'danger'

  return 'neutral'
}

export default function AdminJobs() {
  const toast = useToast()

  const [jobs, setJobs] = useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] = useState('')

  const [processingId, setProcessingId] =
    useState(null)

  const [roleQuery, setRoleQuery] =
    useState('')

  const [companyQuery, setCompanyQuery] =
    useState('')

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        setLoading(true)

        setError('')

        const res = await http.get(
          '/api/admin/pending-jobs'
        )

        const payload =
          res?.data?.data || []

        if (!mounted) return

        setJobs(payload)
      } catch (err) {
        if (!mounted) return

        setError(
          err?.message ||
            'Failed to load pending jobs'
        )

        toast.pushToast({
          type: 'error',
          message:
            err?.message ||
            'Failed to load pending jobs',
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

  const filteredJobs = useMemo(() => {
    const rq = roleQuery
      .trim()
      .toLowerCase()

    const cq = companyQuery
      .trim()
      .toLowerCase()

    return jobs.filter((j) => {
      if (
        rq &&
        !String(j.role || '')
          .toLowerCase()
          .includes(rq)
      )
        return false

      const name =
        j.companyProfile?.companyName ||
        ''

      if (
        cq &&
        !String(name)
          .toLowerCase()
          .includes(cq)
      )
        return false

      return true
    })
  }, [jobs, roleQuery, companyQuery])

  async function updateStatus(
    jobId,
    approvalStatus
  ) {
    setProcessingId(jobId)

    try {
      await http.put(
        `/api/admin/job/${jobId}/status`,
        {
          approvalStatus,
        }
      )

      toast.pushToast({
        type: 'success',
        message: `Job ${approvalStatus.toLowerCase()}`,
      })

      const refreshed =
        await http.get(
          '/api/admin/pending-jobs'
        )

      setJobs(
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

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-2xl">

        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
                <BriefcaseBusiness
                  size={30}
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Approve Jobs
                </h1>

                <p className="mt-1 text-sm text-slate-300">
                  Review and manage
                  company job postings
                  before approval.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
            <p className="text-sm text-slate-300">
              Total Pending Jobs :
              <span className="ml-2 font-semibold text-white">
                {filteredJobs.length}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="rounded-[30px] border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl">

        <div className="grid gap-5 md:grid-cols-2">

          {/* ROLE */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

              <Search size={16} />

              Search by role
            </label>

            <div className="relative">
              <input
                value={roleQuery}
                onChange={(e) =>
                  setRoleQuery(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition-all focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
                placeholder="Software Engineer"
              />
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

              <Building2 size={16} />

              Search by company
            </label>

            <div className="relative">
              <input
                value={companyQuery}
                onChange={(e) =>
                  setCompanyQuery(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition-all focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
                placeholder="Google"
              />
            </div>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center pt-16">
          <div className="flex flex-col items-center gap-4">
            <Spinner size={28} />

            <p className="text-sm text-slate-500">
              Loading jobs...
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
      ) : filteredJobs.length === 0 ? (

        /* EMPTY */
        <div className="rounded-[30px] border border-dashed border-slate-300 bg-white/60 p-10 shadow-lg backdrop-blur-xl">
          <EmptyState
            title="No pending jobs"
            description="Try clearing filters."
          />
        </div>
      ) : (

        /* JOBS GRID */
        <div className="grid gap-6 lg:grid-cols-2">

          {filteredJobs.map((j) => (
            <div
              key={j._id}
              className="group relative overflow-hidden rounded-[30px] border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >

              {/* Glow */}
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl transition-all duration-300 group-hover:bg-cyan-500/20" />

              <div className="relative z-10">

                {/* TOP */}
                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {j.role}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {j.mode}
                    </p>
                  </div>

                  <Badge
                    variant={approvalBadgeVariant(
                      j.approvalStatus
                    )}
                  >
                    {j.approvalStatus}
                  </Badge>
                </div>

                {/* COMPANY */}
                <div className="mt-6 space-y-4">

                  <div className="flex items-center gap-3 text-slate-700">
                    <Building2
                      size={18}
                    />

                    <span className="text-sm font-medium">
                      {j.companyProfile
                        ?.companyName ||
                        '—'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700">
                    <MapPin size={18} />

                    <span className="text-sm">
                      {j.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700">
                    <CircleDollarSign
                      size={18}
                    />

                    <span className="text-sm font-medium">
                      {formatMoney(
                        j.ctc
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700">
                    <CalendarDays
                      size={18}
                    />

                    <span className="text-sm">
                      Deadline :
                      {' '}
                      {formatDate(
                        j.deadline
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700">
                    <Users size={18} />

                    <span className="text-sm">
                      Applicants :
                      {' '}
                      {j.applicantsCount ??
                        0}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-8 flex flex-wrap gap-3">

                  <button
                    disabled={
                      processingId ===
                      j._id
                    }
                    onClick={() =>
                      updateStatus(
                        j._id,
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
                      j._id
                    }
                    onClick={() =>
                      updateStatus(
                        j._id,
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