import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { applicationStatusVariant } from '../../utils/format.js'
import { useToast } from '../../context/ToastContext.jsx'

const STATUSES = ['Applied', 'Shortlisted', 'Rejected', 'Selected']

function statusBadgeVariant(status) {
  return applicationStatusVariant(status)
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function assetUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}${path}`
}

export default function CompanyApplicants() {
  const toast = useToast()
  const navigate = useNavigate()
  const { jobId } = useParams()

  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await http.get(
          `/api/companies/job/${jobId}/applicants`
        )
        const payload = res?.data?.data || []
        if (!mounted) return
        setApplicants(payload)
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load applicants')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [jobId])

  const jobInfo = useMemo(() => applicants[0]?.job || null, [applicants])

  async function onUpdateStatus(applicationId, status) {
    setSavingId(applicationId)
    try {
      await http.put(
        `/api/applications/${applicationId}/status`,
        { status }
      )
      toast.pushToast({ type: 'success', message: 'Status updated' })
      const refreshed = await http.get(
        `/api/companies/job/${jobId}/applicants`
      )
      setApplicants(refreshed?.data?.data || [])
    } catch (err) {
      toast.pushToast({
        type: 'error',
        message: err?.message || 'Failed to update status',
      })
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Job Applicants
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {jobInfo?.role ? `For: ${jobInfo.role}` : `Job ID: ${jobId}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/company/jobs')}>
            Back to Jobs
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center pt-10">
          <Spinner size={24} />
        </div>
      ) : error ? (
        <Card className="p-5">
          <div className="text-sm font-medium text-rose-700">{error}</div>
        </Card>
      ) : applicants.length === 0 ? (
        <EmptyState
          title="No applicants yet"
          description="Applicants will appear once students apply to your job."
        />
      ) : (
        <Card className="p-0">
          <div className="overflow-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-600">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Branch / CGPA</th>
                  <th className="px-4 py-3">Resume</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Update</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((a) => {
                  const student = a.student
                  const resumeUrl = assetUrl(a.studentProfile?.resume?.url)
                  const currentStatus = a.status
                  return (
                    <tr
                      key={a._id}
                      className="border-t border-slate-100 hover:bg-slate-50/50"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">
                          {student?.fullName || '—'}
                        </div>
                        <div className="mt-1 text-xs text-slate-600">
                          {student?.email || ''}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {a.studentProfile?.branch || '—'} /{' '}
                        {a.studentProfile?.cgpa ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        {resumeUrl ? (
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                          >
                            View PDF
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500">
                            Not uploaded
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadgeVariant(currentStatus)}>
                          {currentStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                            value={currentStatus}
                            onChange={(e) =>
                              onUpdateStatus(a._id, e.target.value)
                            }
                            disabled={savingId === a._id}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          {savingId === a._id ? <Spinner size={16} /> : null}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}


