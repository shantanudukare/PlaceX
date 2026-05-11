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
  <div className="relative">
    
    {/* Background Blur */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-10 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
    </div>

    <div className="relative z-10 space-y-8">

      {/* HEADER */}
      <div className="overflow-hidden rounded-[34px] bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-2xl">
        
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 backdrop-blur">
              Job Opportunity
            </div>

            <h1 className="mt-5 text-4xl font-bold">
              {job?.role || 'Job Details'}
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
              Explore job requirements, eligibility criteria
              and apply directly from the portal.
            </p>
          </div>

          <Link to="/student/jobs">
            <Button
              type="button"
              className="rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-white backdrop-blur hover:bg-white/20"
            >
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center pt-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
            <Spinner size={28} />
          </div>
        </div>
      ) : error ? (
        <div className="rounded-[30px] border border-red-200 bg-red-50 p-6 shadow-lg">
          <div className="text-sm font-semibold text-red-700">
            {error}
          </div>
        </div>
      ) : job ? (
        <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
          
          {/* LEFT SIDE */}
          <div className="space-y-8">

            {/* MAIN JOB CARD */}
            <div className="rounded-[30px] border border-white/40 bg-white/70 p-7 shadow-xl backdrop-blur-xl">
              
              <div className="flex flex-wrap items-start justify-between gap-4">
                
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {job.role}
                  </h2>

                  <p className="mt-2 text-base text-slate-500">
                    {job.companyProfile?.companyName || '—'}
                  </p>
                </div>

                <Badge
                  variant="neutral"
                  className="rounded-full px-4 py-1.5"
                >
                  {job.mode}
                </Badge>
              </div>

              {/* Description */}
              <div className="mt-8 rounded-3xl bg-slate-50 p-6">
                
                <h3 className="text-lg font-semibold text-slate-900">
                  Job Description
                </h3>

                <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {job.description}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                
                <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-5 text-white shadow-lg">
                  <div className="text-sm text-white/80">
                    Package
                  </div>

                  <div className="mt-2 text-2xl font-bold">
                    {formatMoney(job.ctc)}
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-md">
                  <div className="text-sm text-slate-500">
                    Location
                  </div>

                  <div className="mt-2 text-lg font-semibold text-slate-900">
                    {job.location}
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-md">
                  <div className="text-sm text-slate-500">
                    Minimum CGPA
                  </div>

                  <div className="mt-2 text-lg font-semibold text-slate-900">
                    {job.minCgpa}
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-md">
                  <div className="text-sm text-slate-500">
                    Openings
                  </div>

                  <div className="mt-2 text-lg font-semibold text-slate-900">
                    {job.openings ?? 1}
                  </div>
                </div>
              </div>

              {/* Deadline */}
              <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-5">
                
                <div className="text-sm font-medium text-blue-700">
                  Application Deadline
                </div>

                <div className="mt-2 text-xl font-bold text-blue-900">
                  {formatDate(job.deadline)}
                </div>
              </div>
            </div>

            {/* BRANCHES + SKILLS */}
            <div className="grid gap-8 lg:grid-cols-2">
              
              {/* Branches */}
              <div className="rounded-[30px] border border-white/40 bg-white/70 p-7 shadow-xl backdrop-blur-xl">
                
                <h2 className="text-2xl font-bold text-slate-900">
                  Eligible Branches
                </h2>

                <div className="mt-6 flex flex-wrap gap-3">
                  {(job.allowedBranches || []).map((b) => (
                    <div
                      key={b}
                      className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-md"
                    >
                      {b}
                    </div>
                  ))}

                  {!job.allowedBranches?.length ? (
                    <div className="text-sm text-slate-500">
                      No restrictions
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Skills */}
              <div className="rounded-[30px] border border-white/40 bg-white/70 p-7 shadow-xl backdrop-blur-xl">
                
                <h2 className="text-2xl font-bold text-slate-900">
                  Skills Required
                </h2>

                <div className="mt-6 flex flex-wrap gap-3">
                  {(job.skillsRequired || [])
                    .slice(0, 12)
                    .map((s) => (
                      <div
                        key={s}
                        className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                      >
                        {s}
                      </div>
                    ))}

                  {!job.skillsRequired?.length ? (
                    <div className="text-sm text-slate-500">
                      No specific skills listed
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* COMPANY */}
            <div className="rounded-[30px] border border-white/40 bg-white/70 p-7 shadow-xl backdrop-blur-xl">
              
              <h2 className="text-2xl font-bold text-slate-900">
                Company Details
              </h2>

              <div className="mt-8 flex items-start gap-5">
                
                <div className="h-20 w-20 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
                  {companyLogo ? (
                    <img
                      src={companyLogo}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                      Logo
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {job.companyProfile?.companyName || '—'}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {job.companyProfile?.location ||
                      job.location}
                  </p>

                  {job.companyProfile?.description ? (
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                      {job.companyProfile.description}
                    </p>
                  ) : null}

                  {job.companyProfile?.website ? (
                    <a
                      href={job.companyProfile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-cyan-600"
                    >
                      Visit Website
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            
            <div className="rounded-[30px] border border-white/40 bg-white/70 p-7 shadow-xl backdrop-blur-xl">
              
              <h2 className="text-2xl font-bold text-slate-900">
                Application
              </h2>

              {existingApp ? (
                <div className="mt-6 space-y-5">
                  
                  <div className="rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-700">
                    You have already applied for this job.
                  </div>

                  <Badge
                    variant={applicationStatusVariant(
                      existingApp.status
                    )}
                    className="rounded-full px-4 py-1.5"
                  >
                    {existingApp.status}
                  </Badge>

                  <Button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/student/applications',
                        { replace: true }
                      )
                    }
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600"
                  >
                    View Applications
                  </Button>
                </div>
              ) : (
                <form
                  className="mt-6 space-y-5"
                  onSubmit={onApply}
                >
                  {!canApply ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                      {approvalHint}
                    </div>
                  ) : null}

                  <Textarea
                    label="Cover Letter (optional)"
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) =>
                      setCoverLetter(
                        e.target.value
                      )
                    }
                    placeholder="Write a short cover letter..."
                  />

                  <Button
                    type="submit"
                    loading={submitting}
                    disabled={
                      submitting || !canApply
                    }
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:from-blue-700 hover:to-cyan-600"
                  >
                    Apply Now
                  </Button>

                  <div className="text-center text-xs text-slate-500">
                    Eligibility is verified automatically.
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  </div>
)
}

