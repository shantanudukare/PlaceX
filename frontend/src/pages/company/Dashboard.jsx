import React, { useEffect, useState } from 'react'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { useToast } from '../../context/ToastContext.jsx'

function StatCard({ title, value, badge }) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      
      {/* Gradient Blur */}
      <div className="absolute -top-10 right-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/20" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        
        <div>
          <div className="text-sm font-medium text-slate-500">
            {title}
          </div>

          <div className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            {value ?? 0}
          </div>
        </div>

        {badge ? (
          <div className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1 text-xs font-semibold text-white shadow-lg">
            {badge}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default function CompanyDashboard() {
  const toast = useToast()

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        setLoading(true)
        setError('')

        const res = await http.get(
          '/api/dashboard/company'
        )

        const payload =
          res?.data?.data || {}

        if (!mounted) return

        setStats(payload)
      } catch (err) {
        if (!mounted) return

        setError(
          err?.message ||
            'Failed to load dashboard'
        )

        toast.pushToast({
          type: 'error',
          message:
            err?.message ||
            'Failed to load dashboard',
        })
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="relative">

      {/* Background Blur */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">

          <div>
            <h2 className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-600 bg-clip-text text-3xl font-bold text-transparent">
              Company Dashboard
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Monitor job performance and
              applicant statuses.
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/60 shadow-xl backdrop-blur-xl">
              <Spinner size={28} />
            </div>
          </div>
        ) : error ? (
          <Card className="mt-6 rounded-[28px] border border-rose-200 bg-rose-50/80 p-6 shadow-lg backdrop-blur-xl">
            <div className="text-sm font-semibold text-rose-700">
              {error}
            </div>
          </Card>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              <StatCard
                title="Posted Jobs"
                value={stats?.totalPostedJobs}
                badge="Jobs"
              />

              <StatCard
                title="Total Applications"
                value={
                  stats?.totalApplications
                }
                badge="All"
              />

              <StatCard
                title="Shortlisted"
                value={stats?.shortlistedCount}
                badge="Next"
              />

              <StatCard
                title="Rejected"
                value={stats?.rejectedCount}
                badge="Past"
              />

              <StatCard
                title="Selected"
                value={stats?.selectedCount}
                badge="Placed"
              />
            </div>

            {/* Bottom Highlight Section */}
            <div className="mt-8 overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-2xl">

              <div className="absolute" />

              <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                <div>
                  <h3 className="text-2xl font-bold">
                    Hiring Insights
                  </h3>

                  <p className="mt-2 text-sm text-slate-300">
                    Track recruitment activity,
                    monitor candidate progress,
                    and manage your hiring
                    pipeline efficiently.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 backdrop-blur-xl">
                  <div className="text-sm text-slate-300">
                    Active Hiring
                  </div>

                  <div className="mt-1 text-3xl font-bold">
                    {stats?.totalPostedJobs ??
                      0}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}