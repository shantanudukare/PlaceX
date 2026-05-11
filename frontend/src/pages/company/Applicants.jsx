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
            Job Applicants
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            {jobInfo?.role
              ? `Applicants for ${jobInfo.role}`
              : `Job ID: ${jobId}`}
          </p>
        </div>

        <button
          onClick={() =>
            navigate('/company/jobs')
          }
          className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur-xl transition-all hover:border-cyan-400 hover:text-cyan-700"
        >
          ← Back to Jobs
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center pt-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/70 shadow-xl backdrop-blur-xl">
            <Spinner size={28} />
          </div>
        </div>
      ) : error ? (

        /* Error */
        <Card className="rounded-[28px] border border-rose-200 bg-rose-50/80 p-6 shadow-lg backdrop-blur-xl">
          <div className="text-sm font-semibold text-rose-700">
            {error}
          </div>
        </Card>
      ) : applicants.length === 0 ? (

        /* Empty */
        <div className="rounded-[32px] border border-white/40 bg-white/70 p-10 text-center shadow-2xl backdrop-blur-xl">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 text-3xl text-white shadow-xl">
            👨‍🎓
          </div>

          <h3 className="mt-6 text-2xl font-bold text-slate-900">
            No Applicants Yet
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            Students who apply for this role will appear here.
          </p>
        </div>
      ) : (

        /* Applicant Cards */
        <div className="grid gap-6 xl:grid-cols-2">

          {applicants.map((a) => {
            const student = a.student

            const resumeUrl = assetUrl(
              a.studentProfile?.resume?.url
            )

            const currentStatus =
              a.status

            return (
              <div
                key={a._id}
                className="group relative overflow-hidden rounded-[32px] border border-white/40 bg-white/70 p-7 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-100"
              >

                {/* Gradient Blur */}
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/20" />

                <div className="relative z-10">

                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-4">

                      {/* Avatar */}
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 text-xl font-bold text-white shadow-xl">
                        {student?.fullName
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          'S'}
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {student?.fullName ||
                            '—'}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {student?.email ||
                            ''}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <Badge
                      variant={statusBadgeVariant(
                        currentStatus
                      )}
                    >
                      {currentStatus}
                    </Badge>
                  </div>

                  {/* Info Grid */}
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">

                    {/* Branch */}
                    <div className="rounded-2xl bg-slate-50 p-4">

                      <div className="text-xs font-medium text-slate-500">
                        Branch
                      </div>

                      <div className="mt-1 text-sm font-semibold text-slate-900">
                        {a.studentProfile
                          ?.branch || '—'}
                      </div>
                    </div>

                    {/* CGPA */}
                    <div className="rounded-2xl bg-slate-50 p-4">

                      <div className="text-xs font-medium text-slate-500">
                        CGPA
                      </div>

                      <div className="mt-1 text-sm font-semibold text-slate-900">
                        {a.studentProfile
                          ?.cgpa ?? '—'}
                      </div>
                    </div>
                  </div>

                  {/* Resume */}
                  <div className="mt-5">

                    {resumeUrl ? (
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-cyan-400 hover:text-cyan-700"
                      >
                        📄 View Resume
                      </a>
                    ) : (
                      <div className="rounded-2xl bg-slate-100 px-5 py-3 text-center text-sm font-medium text-slate-500">
                        Resume Not Uploaded
                      </div>
                    )}
                  </div>

                  {/* Update Status */}
                  <div className="mt-6">

                    <div className="mb-2 text-sm font-semibold text-slate-700">
                      Update Application Status
                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                      <select
                        className="flex-1 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                        value={currentStatus}
                        onChange={(e) =>
                          onUpdateStatus(
                            a._id,
                            e.target.value
                          )
                        }
                        disabled={
                          savingId === a._id
                        }
                      >
                        {STATUSES.map((s) => (
                          <option
                            key={s}
                            value={s}
                          >
                            {s}
                          </option>
                        ))}
                      </select>

                      {savingId ===
                      a._id ? (
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg">
                          <Spinner
                            size={18}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  </div>
)
}


