import React, {
  useEffect,
  useState,
} from 'react'

import { http } from '../../api/http'

import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Spinner from '../../components/ui/Spinner.jsx'

import { useToast } from '../../context/ToastContext.jsx'

import {
  GraduationCap,
  Clock3,
  FileCheck2,
  BriefcaseBusiness,
  Activity,
  TrendingUp,
  BarChart3,
} from 'lucide-react'

function SummaryCard({
  title,
  value,
  variant = 'info',
  icon: Icon,
  gradient,
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[30px] border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
    >

      {/* Glow */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl transition-all duration-300 group-hover:bg-cyan-500/20" />

      <div className="relative z-10 flex items-start justify-between gap-4">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            {value ?? 0}
          </h2>

          <div className="mt-4">
            <Badge variant={variant}>
              {title}
            </Badge>
          </div>
        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          <Icon size={30} />
        </div>
      </div>
    </div>
  )
}

export default function AdminPlacementSummary() {
  const toast = useToast()

  const [stats, setStats] =
    useState(null)

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
          '/api/dashboard/admin'
        )

        const payload =
          res?.data?.data || {}

        if (!mounted) return

        setStats(payload)
      } catch (err) {
        if (!mounted) return

        setError(
          err?.message ||
            'Failed to load summary'
        )

        toast.pushToast({
          type: 'error',
          message:
            err?.message ||
            'Failed to load summary',
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

  const pendingApprovals =
    (stats?.pendingStudents ?? 0) +
    (stats?.pendingCompanies ?? 0) +
    (stats?.pendingJobs ?? 0)

  return (
    <div className="space-y-6">

      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-2xl">

        {/* Blur */}
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
                <BarChart3 size={30} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Placement Summary
                </h1>

                <p className="mt-1 text-sm text-slate-300">
                  System-wide placement
                  statistics and overview.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
            <p className="text-sm text-slate-300">
              Monitor placement growth
              and approval activity in
              real time.
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
              Loading summary...
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
      ) : (

        /* SUMMARY CARDS */
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          <SummaryCard
            title="Placed Students"
            value={
              stats?.placedStudents
            }
            variant="success"
            icon={GraduationCap}
            gradient="from-emerald-500 to-green-500"
          />

          <SummaryCard
            title="Not Placed"
            value={
              stats?.notPlacedStudents
            }
            variant="warning"
            icon={Clock3}
            gradient="from-amber-500 to-orange-500"
          />

          <SummaryCard
            title="Selected Applications"
            value={
              stats?.selectedApplications
            }
            variant="info"
            icon={FileCheck2}
            gradient="from-blue-600 to-cyan-500"
          />
        </div>
      )}

      {/* OVERVIEW SECTION */}
      {stats ? (
        <div className="grid gap-6 lg:grid-cols-2">

          {/* APPLICATION OVERVIEW */}
          <div className="relative overflow-hidden rounded-[30px] border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl">

            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative z-10">

              <div className="flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
                  <BriefcaseBusiness
                    size={26}
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Applications
                  </h2>

                  <p className="text-sm text-slate-500">
                    Total applications
                    across the portal
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-end justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Applications
                  </p>

                  <h3 className="mt-2 text-5xl font-bold text-slate-900">
                    {stats?.totalApplications ??
                      0}
                  </h3>
                </div>

                <div className="rounded-2xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                  Active
                </div>
              </div>
            </div>
          </div>

          {/* APPROVAL OVERVIEW */}
          <div className="relative overflow-hidden rounded-[30px] border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl">

            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="relative z-10">

              <div className="flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg">
                  <Activity size={26} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Pending Reviews
                  </h2>

                  <p className="text-sm text-slate-500">
                    Students, companies &
                    jobs waiting approval
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-end justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Pending
                  </p>

                  <h3 className="mt-2 text-5xl font-bold text-slate-900">
                    {pendingApprovals}
                  </h3>
                </div>

                <div className="rounded-2xl bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                  Review
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* PERFORMANCE CARD */}
      {stats ? (
        <div className="relative overflow-hidden rounded-[32px] border border-white/40 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 p-8 text-white shadow-2xl">

          <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                  <TrendingUp size={28} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    Placement Performance
                  </h2>

                  <p className="mt-1 text-sm text-blue-100">
                    Overall placement
                    activity overview
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl bg-white/10 px-6 py-5 backdrop-blur">
                <p className="text-sm text-blue-100">
                  Placed Students
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {stats?.placedStudents ??
                    0}
                </h3>
              </div>

              <div className="rounded-2xl bg-white/10 px-6 py-5 backdrop-blur">
                <p className="text-sm text-blue-100">
                  Applications
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {stats?.totalApplications ??
                    0}
                </h3>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}