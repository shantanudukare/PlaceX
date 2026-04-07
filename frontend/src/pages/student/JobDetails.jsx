import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Textarea from '../../components/ui/Textarea.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { applicationStatusVariant, formatDate, formatMoney } from '../../utils/format.js'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function assetUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}${path}`
}

export default function StudentJobDetails() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()

  const [job, setJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [coverLetter, setCoverLetter] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const [jobRes, appsRes] = await Promise.all([
          http.get(`/api/jobs/${jobId}`),
          http.get('/api/students/my-applications'),
        ])

        if (!mounted) return
        setJob(jobRes?.data?.data || null)
        setApplications(appsRes?.data?.data || [])
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load job details')
        toast.pushToast({
          type: 'error',
          message: err?.message || 'Failed to load job details',
        })
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [jobId])

  const existingApp = useMemo(() => {
    return applications.find((a) => a.job?._id === jobId) || null
  }, [applications, jobId])

  const canApply = user?.approvalStatus === 'Approved'
  const approvalHint = canApply
    ? ''
    : `Your account is ${user?.approvalStatus}. Applications are disabled until approved.`

  async function onApply(e) {
    e.preventDefault()
    if (existingApp) return
    if (!canApply) {
      toast.pushToast({ type: 'error', message: approvalHint })
      return
    }

    setSubmitting(true)
    try {
      await http.post(`/api/applications/${jobId}`, {
        coverLetter: coverLetter || '',
      })
      toast.pushToast({ type: 'success', message: 'Application submitted' })
      navigate('/student/applications', { replace: true })
    } catch (err) {
      toast.pushToast({ type: 'error', message: err?.message || 'Apply failed' })
    } finally {
      setSubmitting(false)
    }
  }

  const companyLogo = assetUrl(job?.companyProfile?.logo?.url)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Job Details
          </h2>
          <div className="mt-1 text-sm text-slate-600">
            {job?.role || ''}
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/student/jobs">
            <Button type="button" variant="secondary">
              Back to Jobs
            </Button>
          </Link>
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
      ) : job ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-600">Role</div>
                  <div className="mt-1 text-xl font-semibold text-slate-900">
                    {job.role}
                  </div>
                </div>
                <Badge variant="neutral">{job.mode}</Badge>
              </div>

              <div className="mt-4 text-sm text-slate-700 whitespace-pre-wrap">
                {job.description}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-600">CTC</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    {formatMoney(job.ctc)}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-600">Location</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    {job.location}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-600">
                    Minimum CGPA
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    {job.minCgpa}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-600">Openings</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    {job.openings ?? 1}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-600">Deadline</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    {formatDate(job.deadline)}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Eligible Branches
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(job.allowedBranches || []).map((b) => (
                      <Badge key={b} variant="neutral">
                        {b}
                      </Badge>
                    ))}
                    {!job.allowedBranches?.length ? (
                      <div className="text-sm text-slate-600">—</div>
                    ) : null}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Skills Required
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(job.skillsRequired || []).slice(0, 12).map((s) => (
                      <Badge key={s} variant="neutral">
                        {s}
                      </Badge>
                    ))}
                    {!job.skillsRequired?.length ? (
                      <div className="text-sm text-slate-600">—</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="text-sm font-semibold text-slate-900">
                Company
              </div>
              <div className="mt-3 flex items-start gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {companyLogo ? (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <img src={companyLogo} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      Logo
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-900">
                    {job.companyProfile?.companyName || '—'}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {job.companyProfile?.location || job.location}
                  </div>
                  {job.companyProfile?.description ? (
                    <div className="mt-2 text-sm text-slate-700">
                      {job.companyProfile.description}
                    </div>
                  ) : null}
                  {job.companyProfile?.website ? (
                    <a
                      className="mt-2 inline-flex text-sm font-medium text-slate-900 underline hover:text-slate-700"
                      href={job.companyProfile.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Website
                    </a>
                  ) : null}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <div className="text-sm font-semibold text-slate-900">
                Application
              </div>

              {existingApp ? (
                <div className="mt-3 space-y-2">
                  <div className="text-sm text-slate-600">
                    You have already applied.
                  </div>
                  <Badge variant={applicationStatusVariant(existingApp.status)}>
                    {existingApp.status}
                  </Badge>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      navigate('/student/applications', { replace: true })
                    }
                  >
                    View My Applications
                  </Button>
                </div>
              ) : (
                <form className="mt-3 space-y-4" onSubmit={onApply}>
                  {!canApply ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                      {approvalHint}
                    </div>
                  ) : null}

                  <Textarea
                    label="Cover Letter (optional)"
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Write a short cover letter..."
                  />

                  <Button
                    type="submit"
                    loading={submitting}
                    disabled={submitting || !canApply}
                    className="w-full"
                  >
                    Apply Now
                  </Button>
                  <div className="text-xs text-slate-500">
                    Your eligibility is checked server-side.
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  )
}

