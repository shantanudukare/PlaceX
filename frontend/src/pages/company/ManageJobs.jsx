import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import Modal from '../../components/ui/Modal.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { formatDate, formatMoney } from '../../utils/format.js'
import { useToast } from '../../context/ToastContext.jsx'

function approvalBadgeVariant(status) {
  if (status === 'Approved') return 'success'
  if (status === 'Pending') return 'warning'
  if (status === 'Rejected') return 'danger'
  return 'neutral'
}

export default function CompanyManageJobs() {
  const toast = useToast()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [roleQuery, setRoleQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await http.get('/api/companies/my-jobs')
        const payload = res?.data?.data || []
        if (!mounted) return
        setJobs(payload)
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load jobs')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const filteredJobs = useMemo(() => {
    const q = roleQuery.trim().toLowerCase()
    return jobs.filter((j) => {
      if (q && !String(j.role || '').toLowerCase().includes(q)) return false
      if (statusFilter !== 'All' && j.approvalStatus !== statusFilter)
        return false
      return true
    })
  }, [jobs, roleQuery, statusFilter])

  async function onDeleteConfirmed() {
    if (!jobToDelete?._id) return
    setDeleting(true)
    try {
      await http.delete(`/api/jobs/${jobToDelete._id}`)
      toast.pushToast({ type: 'success', message: 'Job deleted' })
      setDeleteOpen(false)
      setJobToDelete(null)
      const res = await http.get('/api/companies/my-jobs')
      setJobs(res?.data?.data || [])
    } catch (err) {
      toast.pushToast({ type: 'error', message: err?.message || 'Delete failed' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">My Jobs</h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage your job postings and their approvals.
          </p>
        </div>

        <div className="flex gap-2">
          <Link to="/company/jobs/new">
            <Button type="button">Post Job</Button>
          </Link>
        </div>
      </div>

      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Search role
            </label>
            <input
              value={roleQuery}
              onChange={(e) => setRoleQuery(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Approval status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
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
          title="No jobs found"
          description="Try changing filters or post a new job."
          action={
            <Link to="/company/jobs/new">
              <Button type="button">Post Job</Button>
            </Link>
          }
        />
      ) : (
        <Card className="p-0">
          <div className="overflow-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-600">
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">CTC</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Applicants</th>
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
                    </td>
                    <td className="px-4 py-3 text-slate-700">{j.location}</td>
                    <td className="px-4 py-3">
                      <Badge variant="neutral">{j.mode}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatMoney(j.ctc)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(j.deadline)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={approvalBadgeVariant(j.approvalStatus)}>
                        {j.approvalStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {j.applicantsCount ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/company/jobs/${j._id}`}>
                          <Button type="button" variant="secondary">
                            Edit
                          </Button>
                        </Link>
                        <Link to={`/company/jobs/${j._id}/applicants`}>
                          <Button type="button" variant="secondary">
                            Applicants
                          </Button>
                        </Link>
                        <Button
                          type="button"
                          variant="danger"
                          className="px-3"
                          onClick={() => {
                            setJobToDelete(j)
                            setDeleteOpen(true)
                          }}
                        >
                          Delete
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

      <Modal
        isOpen={deleteOpen}
        title="Delete Job"
        onClose={() => {
          if (!deleting) {
            setDeleteOpen(false)
            setJobToDelete(null)
          }
        }}
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={deleting}
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              loading={deleting}
              disabled={deleting}
              onClick={onDeleteConfirmed}
            >
              Confirm Delete
            </Button>
          </div>
        }
      >
        <div className="text-sm text-slate-700">
          This will permanently remove the job posting. Applicants will no
          longer be visible for this job.
        </div>
      </Modal>
    </div>
  )
}

