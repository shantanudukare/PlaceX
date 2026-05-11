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
  <div className="relative">

    {/* Background Blur */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-20 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
    </div>

    <div className="relative z-10 space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">

        <div>
          <h2 className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-600 bg-clip-text text-3xl font-bold text-transparent">
            My Jobs
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Manage your job postings and monitor hiring activity.
          </p>
        </div>

        <Link to="/company/jobs/new">
          <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            + Post Job
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-[32px] border border-white/40 bg-white/70 p-6 shadow-2xl backdrop-blur-xl">

        <div className="grid gap-5 md:grid-cols-3">

          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search Role
            </label>

            <input
              value={roleQuery}
              onChange={(e) =>
                setRoleQuery(e.target.value)
              }
              placeholder="Frontend Developer"
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-sm transition-all focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Approval Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-sm transition-all focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100"
            >
              <option value="All">
                All
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center pt-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/70 shadow-xl backdrop-blur-xl">
            <Spinner size={28} />
          </div>
        </div>
      ) : error ? (
        <Card className="rounded-[28px] border border-rose-200 bg-rose-50/80 p-6 shadow-lg backdrop-blur-xl">
          <div className="text-sm font-semibold text-rose-700">
            {error}
          </div>
        </Card>
      ) : filteredJobs.length === 0 ? (
        <div className="rounded-[32px] border border-white/40 bg-white/70 p-10 text-center shadow-2xl backdrop-blur-xl">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 text-3xl text-white shadow-xl">
            💼
          </div>

          <h3 className="mt-6 text-2xl font-bold text-slate-900">
            No Jobs Found
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            Try changing filters or create a new job posting.
          </p>

          <div className="mt-6">
            <Link to="/company/jobs/new">
              <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-xl transition-all hover:scale-[1.02]">
                Post Job
              </button>
            </Link>
          </div>
        </div>
      ) : (

        /* Job Cards */
        <div className="grid gap-6 xl:grid-cols-2">

          {filteredJobs.map((j) => (
            <div
              key={j._id}
              className="group relative overflow-hidden rounded-[32px] border border-white/40 bg-white/70 p-7 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-100"
            >

              {/* Gradient Blur */}
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/20" />

              <div className="relative z-10">

                {/* Top */}
                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {j.role}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {j.location}
                    </p>
                  </div>

                  <div>
                    <Badge
                      variant={approvalBadgeVariant(
                        j.approvalStatus
                      )}
                    >
                      {j.approvalStatus}
                    </Badge>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-medium text-slate-500">
                      Job Mode
                    </div>

                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {j.mode}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-medium text-slate-500">
                      Salary Package
                    </div>

                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {formatMoney(j.ctc)}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-medium text-slate-500">
                      Deadline
                    </div>

                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {formatDate(
                        j.deadline
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-medium text-slate-500">
                      Applicants
                    </div>

                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {j.applicantsCount ??
                        0}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-7 flex flex-wrap gap-3">

                  <Link
                    to={`/company/jobs/${j._id}`}
                  >
                    <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-cyan-400 hover:text-cyan-700">
                      Edit Job
                    </button>
                  </Link>

                  <Link
                    to={`/company/jobs/${j._id}/applicants`}
                  >
                    <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-cyan-400 hover:text-cyan-700">
                      Applicants
                    </button>
                  </Link>

                  <button
                    onClick={() => {
                      setJobToDelete(j)
                      setDeleteOpen(true)
                    }}
                    className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
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
            <button
              type="button"
              disabled={deleting}
              onClick={() =>
                setDeleteOpen(false)
              }
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={deleting}
              onClick={onDeleteConfirmed}
              className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-red-600"
            >
              {deleting
                ? 'Deleting...'
                : 'Confirm Delete'}
            </button>
          </div>
        }
      >
        <div className="text-sm leading-6 text-slate-700">
          This action will permanently remove the job posting and all associated applicant data.
        </div>
      </Modal>
    </div>
  </div>
)
}

