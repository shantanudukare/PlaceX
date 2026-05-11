import React, { useEffect, useState } from 'react'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import Button from '../../components/ui/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

import {
  FileText,
  CheckCircle2,
  XCircle,
  Trophy,
  TrendingUp,
  Sparkles,
} from 'lucide-react'

function StatCard({
  title,
  value,
  badge,
  icon: Icon,
  gradient,
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[30px] border border-white/40 bg-gradient-to-br ${gradient} p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
    >
      {/* Blur */}
      <div className="absolute top-0 right-0 h-28 w-28 rounded-full bg-white/20 blur-3xl" />

      <div className="relative z-10">
        
        <div className="flex items-start justify-between">
          
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur">
            <Icon size={28} />
          </div>

          {badge ? (
            <div className="rounded-full border border-white/20 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {badge}
            </div>
          ) : null}
        </div>

        <div className="mt-8">
          <p className="text-sm font-medium text-white/80">
            {title}
          </p>

          <h2 className="mt-2 text-5xl font-bold text-white">
            {value ?? 0}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const toast = useToast()

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        setLoading(true)

        const res = await http.get(
          '/api/dashboard/student'
        )

        const payload = res?.data?.data || {}

        if (!mounted) return

        setStats(payload)
      } catch (err) {
        if (!mounted) return

        setError(
          err?.message || 'Failed to load dashboard'
        )

        toast.pushToast({
          type: 'error',
          message:
            err?.message ||
            'Failed to load dashboard',
        })
      } finally {
        if (!mounted) return

        setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const approvalStatus = user?.approvalStatus

  return (
    <div className="relative">
      
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">

        {/* HEADER */}
        <div className="overflow-hidden rounded-[34px] bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-2xl">
          
          <div className="absolute" />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur">
                <Sparkles size={16} />
                Student Dashboard
              </div>

              <h1 className="mt-5 text-4xl font-bold">
                Welcome back,
                <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  {' '}
                  {user?.fullName?.split(' ')[0] ||
                    'Student'}
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                Track your placement progress, monitor
                applications and stay updated with
                recruitment activities.
              </p>
            </div>

            {/* Approval Status */}
            {approvalStatus && (
              <div
                className={`rounded-3xl border px-5 py-4 text-sm font-medium shadow-lg backdrop-blur ${
                  approvalStatus === 'Approved'
                    ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                    : 'border-amber-400/20 bg-amber-400/10 text-amber-100'
                }`}
              >
                <div className="text-xs uppercase tracking-wider opacity-80">
                  Account Status
                </div>

                <div className="mt-1 text-lg font-semibold">
                  {approvalStatus}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
              <Spinner size={28} />
            </div>
          </div>
        ) : error ? (
          <Card className="mt-10 rounded-[30px] border border-red-200 bg-red-50 p-8 shadow-lg">
            
            <div className="text-lg font-semibold text-red-700">
              Failed to Load Dashboard
            </div>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <div className="mt-6">
              <Button
                variant="secondary"
                onClick={() =>
                  window.location.reload()
                }
                className="rounded-xl"
              >
                Retry
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* STATS */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              
              <StatCard
                title="Total Applications"
                value={stats?.totalApplications}
                badge="All"
                icon={FileText}
                gradient="from-blue-600 to-cyan-500"
              />

              <StatCard
                title="Shortlisted"
                value={stats?.shortlistedCount}
                badge="Progress"
                icon={TrendingUp}
                gradient="from-indigo-600 to-blue-500"
              />

              <StatCard
                title="Rejected"
                value={stats?.rejectedCount}
                badge="Past"
                icon={XCircle}
                gradient="from-rose-500 to-red-500"
              />

              <StatCard
                title="Selected"
                value={stats?.selectedCount}
                badge="Placed"
                icon={Trophy}
                gradient="from-emerald-500 to-green-500"
              />
            </div>

            {/* EXTRA SECTION */}
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              
              {/* Progress Card */}
              <div className="rounded-[30px] border border-white/40 bg-white/70 p-7 shadow-xl backdrop-blur-xl">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Placement Progress
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Your current recruitment journey
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
                    <TrendingUp size={28} />
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-600">
                        Applications
                      </span>

                      <span className="font-semibold text-slate-900">
                        {stats?.totalApplications || 0}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                        style={{
                          width: `${Math.min(
                            (stats?.totalApplications || 0) *
                              10,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-600">
                        Selected
                      </span>

                      <span className="font-semibold text-slate-900">
                        {stats?.selectedCount || 0}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500"
                        style={{
                          width: `${Math.min(
                            (stats?.selectedCount || 0) *
                              25,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="rounded-[30px] border border-white/40 bg-white/70 p-7 shadow-xl backdrop-blur-xl">
                
                <h2 className="text-2xl font-bold text-slate-900">
                  Quick Tips
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Improve your placement opportunities
                </p>

                <div className="mt-8 space-y-4">
                  
                  <div className="rounded-2xl bg-blue-50 p-4">
                    <div className="font-semibold text-blue-900">
                      Keep Your Profile Updated
                    </div>

                    <p className="mt-1 text-sm text-blue-700">
                      Add projects, skills and resume regularly.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-cyan-50 p-4">
                    <div className="font-semibold text-cyan-900">
                      Apply Early
                    </div>

                    <p className="mt-1 text-sm text-cyan-700">
                      Early applicants usually get better visibility.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <div className="font-semibold text-emerald-900">
                      Prepare for Interviews
                    </div>

                    <p className="mt-1 text-sm text-emerald-700">
                      Focus on aptitude, DSA and communication.
                    </p>
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