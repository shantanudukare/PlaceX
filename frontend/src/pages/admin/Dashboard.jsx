import React, { useEffect, useState } from 'react'
import { http } from '../../api/http'

import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Spinner from '../../components/ui/Spinner.jsx'

import { useToast } from '../../context/ToastContext.jsx'

import {
  Users,
  Building2,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Clock3,
  UserCheck,
  BarChart3,
  Activity,
} from 'lucide-react'

function StatCard({
  title,
  value,
  badge,
  icon: Icon,
}) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/40 bg-white/70 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

      {/* Glow */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-all duration-300 group-hover:bg-cyan-500/20" />

      <div className="relative z-10 flex items-start justify-between gap-4">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            {value ?? 0}
          </h3>

          {badge ? (
            <div className="mt-4">
              <Badge variant="info">
                {badge}
              </Badge>
            </div>
          ) : null}
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
          <Icon size={28} />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const toast = useToast()

  const [stats, setStats] = useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] = useState('')

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
            'Failed to load stats'
        )

        toast.pushToast({
          type: 'error',
          message:
            err?.message ||
            'Failed to load stats',
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

  const cards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents,
      badge: 'Users',
      icon: Users,
    },
    {
      title: 'Total Companies',
      value: stats?.totalCompanies,
      badge: 'Companies',
      icon: Building2,
    },
    {
      title: 'Total Jobs',
      value: stats?.totalJobs,
      badge: 'Jobs',
      icon: BriefcaseBusiness,
    },
    {
      title: 'Total Applications',
      value:
        stats?.totalApplications,
      badge: 'Applications',
      icon: FileText,
    },
    {
      title: 'Placed Students',
      value: stats?.placedStudents,
      badge: 'Placed',
      icon: GraduationCap,
    },
    {
      title: 'Not Placed',
      value:
        stats?.notPlacedStudents,
      badge: 'Pending',
      icon: Activity,
    },
    {
      title: 'Pending Students',
      value:
        stats?.pendingStudents,
      badge: 'Review',
      icon: UserCheck,
    },
    {
      title: 'Pending Companies',
      value:
        stats?.pendingCompanies,
      badge: 'Review',
      icon: Building2,
    },
    {
      title: 'Pending Jobs',
      value: stats?.pendingJobs,
      badge: 'Review',
      icon: Clock3,
    },
  ]

  return (
    <div>

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-2xl">

        {/* Blur */}
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                <BarChart3 size={28} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Admin Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-300">
                  System-wide approvals and
                  placement overview.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
            <p className="text-sm text-slate-300">
              Pending approvals help
              keep the portal updated
              and secure.
            </p>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="mt-16 flex justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size={28} />

            <p className="text-sm text-slate-500">
              Loading dashboard...
            </p>
          </div>
        </div>
      ) : error ? (

        /* ERROR */
        <Card className="mt-6 rounded-[28px] border border-rose-200 bg-rose-50/70 p-6 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-rose-700">
            {error}
          </div>
        </Card>
      ) : (

        /* STATS GRID */
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {cards.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              badge={card.badge}
              icon={card.icon}
            />
          ))}
        </div>
      )}
    </div>
  )
}