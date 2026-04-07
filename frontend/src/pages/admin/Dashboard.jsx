import React, { useEffect, useState } from 'react'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { useToast } from '../../context/ToastContext.jsx'

function StatCard({ title, value, badge }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-700">{title}</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {value ?? 0}
          </div>
        </div>
        {badge ? <Badge variant="info">{badge}</Badge> : null}
      </div>
    </Card>
  )
}

export default function AdminDashboard() {
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
        const res = await http.get('/api/dashboard/admin')
        const payload = res?.data?.data || {}
        if (!mounted) return
        setStats(payload)
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load stats')
        toast.pushToast({
          type: 'error',
          message: err?.message || 'Failed to load stats',
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
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Admin Dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            System-wide approvals and placement overview.
          </p>
        </div>
        <div className="text-sm text-slate-600">
          Pending approvals help keep the portal up to date.
        </div>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center">
          <Spinner size={24} />
        </div>
      ) : error ? (
        <Card className="mt-6 p-5">
          <div className="text-sm font-medium text-rose-700">{error}</div>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard title="Total Students" value={stats?.totalStudents} badge="Users" />
          <StatCard title="Total Companies" value={stats?.totalCompanies} badge="Users" />
          <StatCard title="Total Jobs" value={stats?.totalJobs} badge="Jobs" />
          <StatCard title="Total Applications" value={stats?.totalApplications} badge="Apps" />
          <StatCard title="Placed Students" value={stats?.placedStudents} badge="Placed" />
          <StatCard title="Not Placed" value={stats?.notPlacedStudents} badge="Pending" />
          <StatCard title="Pending Students" value={stats?.pendingStudents} badge="Review" />
          <StatCard title="Pending Companies" value={stats?.pendingCompanies} badge="Review" />
          <StatCard title="Pending Jobs" value={stats?.pendingJobs} badge="Review" />
        </div>
      )}
    </div>
  )
}

