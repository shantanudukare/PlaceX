import React, { useEffect, useMemo, useState } from 'react'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { formatDate, formatMoney } from '../../utils/format.js'
import { useToast } from '../../context/ToastContext.jsx'

function approvalBadgeVariant(status) {
  if (status === 'Approved') return 'success'
  if (status === 'Pending') return 'warning'
  if (status === 'Rejected') return 'danger'
  return 'neutral'
}

export default function AdminJobs() {
  const toast = useToast()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingId, setProcessingId] = useState(null)

  const [roleQuery, setRoleQuery] = useState('')
  const [companyQuery, setCompanyQuery] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await http.get('/api/admin/pending-jobs')
        const payload = res?.data?.data || []
        if (!mounted) return
        setJobs(payload)
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load pending jobs')
        toast.pushToast({
          type: 'error',
          message: err?.message || 'Failed to load pending jobs',
        })
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const filteredJobs = useMemo(() => {
    const rq = roleQuery.trim().toLowerCase()
    const cq = companyQuery.trim().toLowerCase()
    return jobs.filter((j) => {
      if (rq && !String(j.role || '').toLowerCase().includes(rq))
        return false
      const name = j.companyProfile?.companyName || ''
      if (cq && !String(name).toLowerCase().includes(cq)) return false
      return true
    })
  }, [jobs, roleQuery, companyQuery])

  async function updateStatus(jobId, approvalStatus) {
    setProcessingId(jobId)
    try {
      await http.put(`/api/admin/job/${jobId}/status`, {
        approvalStatus,
      })
      toast.pushToast({
        type: 'success',
        message: `Job ${approvalStatus.toLowerCase()}`,
      })
      const refreshed = await http.get('/api/admin/pending-jobs')
      setJobs(refreshed?.data?.data || [])
    } catch (err) {
      toast.pushToast({
        type: 'error',
        message: err?.message || 'Update failed',
      })
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Approve Jobs
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Review job postings waiting for admin approval.
        </p>
      </div>

      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Search by role
            </label>
            <input
              value={roleQuery}
              onChange={(e) => setRoleQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
              placeholder="e.g. Software Engineer"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Search by company
            </label>
            <input
              value={companyQuery}
              onChange={(e) => setCompanyQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
              placeholder="e.g. Google"
            />
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center pt-10">
          <Spinner size={24} />
        </div>
      ) : error ? (
        <Card className="p-5">
          <div className="text-sm font-medium text-rose-700">{error}</div>
        </Card>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title="No pending jobs"
          description="Try clearing filters."
        />
      ) : (
        <Card className="p-0">
          <div className="overflow-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-600">
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">CTC</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Applicants</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((j) => (
                  <tr
                    key={j._id}
                    className="border-t border-slate-100 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {j.role}
                      <div className="mt-1 text-xs text-slate-600">
                        {j.mode}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {j.companyProfile?.companyName || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {j.location}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatMoney(j.ctc)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(j.deadline)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {j.applicantsCount ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={approvalBadgeVariant(j.approvalStatus)}>
                        {j.approvalStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="primary"
                          disabled={processingId === j._id}
                          loading={processingId === j._id}
                          onClick={() =>
                            updateStatus(j._id, 'Approved')
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          disabled={processingId === j._id}
                          loading={processingId === j._id}
                          onClick={() =>
                            updateStatus(j._id, 'Rejected')
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}


