import React, { useEffect, useState } from 'react'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { useToast } from '../../context/ToastContext.jsx'

function SummaryCard({ title, value, variant = 'info' }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-700">{title}</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {value ?? 0}
          </div>
        </div>
        <Badge variant={variant}>{title}</Badge>
      </div>
    </Card>
  )
}

export default function AdminPlacementSummary() {
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
        setError(err?.message || 'Failed to load summary')
        toast.pushToast({
          type: 'error',
          message: err?.message || 'Failed to load summary',
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
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Placement Summary
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Derived from admin dashboard placement stats.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center pt-10">
          <Spinner size={24} />
        </div>
      ) : error ? (
        <Card className="p-5">
          <div className="text-sm font-medium text-rose-700">{error}</div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Placed Students"
            value={stats?.placedStudents}
            variant="success"
          />
          <SummaryCard
            title="Not Placed"
            value={stats?.notPlacedStudents}
            variant="warning"
          />
          <SummaryCard
            title="Selected Applications"
            value={stats?.selectedApplications}
            variant="info"
          />
        </div>
      )}

      {stats ? (
        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-900">
            High-level Overview
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-medium text-slate-600">
                Total Applications
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-900">
                {stats?.totalApplications ?? 0}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-medium text-slate-600">
                Pending Approvals
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-900">
                {(stats?.pendingStudents ?? 0) +
                  (stats?.pendingCompanies ?? 0) +
                  (stats?.pendingJobs ?? 0)}
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  )
}


