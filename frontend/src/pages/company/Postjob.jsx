import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Textarea from '../../components/ui/Textarea.jsx'
import Select from '../../components/ui/Select.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const MODES = ['Remote', 'On-site', 'Hybrid']

function parseCommaList(text) {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function numberOrUndefined(value) {
  if (value === '' || value === null || value === undefined) return undefined
  const n = Number(value)
  return Number.isNaN(n) ? undefined : n
}

export default function CompanyPostJob() {
  const toast = useToast()
  const navigate = useNavigate()
  const { jobId } = useParams()
  const isEdit = Boolean(jobId)

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [role, setRole] = useState('')
  const [description, setDescription] = useState('')
  const [ctc, setCtc] = useState('')
  const [location, setLocation] = useState('')
  const [mode, setMode] = useState('On-site')
  const [minCgpa, setMinCgpa] = useState('')
  const [allowedBranchesText, setAllowedBranchesText] = useState('')
  const [skillsRequiredText, setSkillsRequiredText] = useState('')
  const [deadline, setDeadline] = useState('')
  const [openings, setOpenings] = useState('1')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!isEdit) return
      try {
        setLoading(true)
        setError('')
        const res = await http.get(`/api/jobs/${jobId}`)
        const j = res?.data?.data
        if (!mounted) return
        setRole(j?.role || '')
        setDescription(j?.description || '')
        setCtc(j?.ctc ?? '')
        setLocation(j?.location || '')
        setMode(j?.mode || 'On-site')
        setMinCgpa(j?.minCgpa ?? '')
        setAllowedBranchesText((j?.allowedBranches || []).join(', '))
        setSkillsRequiredText((j?.skillsRequired || []).join(', '))
        setDeadline(j?.deadline ? String(j.deadline).slice(0, 10) : '')
        setOpenings(String(j?.openings ?? 1))
        setIsActive(j?.isActive ?? true)
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load job')
        toast.pushToast({
          type: 'error',
          message: err?.message || 'Failed to load job',
        })
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [isEdit, jobId])

  const allowedBranches = useMemo(
    () => parseCommaList(allowedBranchesText),
    [allowedBranchesText]
  )
  const skillsRequired = useMemo(
    () => parseCommaList(skillsRequiredText),
    [skillsRequiredText]
  )

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    const ctcNum = numberOrUndefined(ctc)
    const cgpaNum = numberOrUndefined(minCgpa)
    const openingsNum = numberOrUndefined(openings)

    if (!role.trim() || !description.trim()) {
      setError('Role and description are required')
      return
    }
    if (ctcNum === undefined) {
      setError('CTC is required')
      return
    }
    if (!location.trim()) {
      setError('Location is required')
      return
    }
    if (cgpaNum === undefined) {
      setError('Minimum CGPA is required')
      return
    }
    if (!deadline) {
      setError('Deadline is required')
      return
    }
    if (allowedBranches.length === 0) {
      setError('Allowed branches cannot be empty')
      return
    }

    setSaving(true)
    try {
      const payload = {
        role: role.trim(),
        description: description.trim(),
        ctc: ctcNum,
        location: location.trim(),
        mode,
        minCgpa: cgpaNum,
        allowedBranches,
        skillsRequired,
        deadline,
        openings: openingsNum ?? 1,
        isActive,
      }

      if (isEdit) {
        await http.put(`/api/jobs/${jobId}`, payload)
        toast.pushToast({ type: 'success', message: 'Job updated' })
      } else {
        // createJob ignores isActive, but sending it is harmless for backend update
        const { isActive: _ignored, ...createPayload } = payload
        await http.post('/api/jobs', createPayload)
        toast.pushToast({ type: 'success', message: 'Job posted' })
      }

      navigate('/company/jobs', { replace: true })
    } catch (err) {
      setError(err?.message || 'Failed to save job')
      toast.pushToast({
        type: 'error',
        message: err?.message || 'Failed to save job',
      })
    } finally {
      setSaving(false)
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
            {isEdit ? 'Edit Job' : 'Create New Job'}
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            {isEdit
              ? 'Update your job posting details.'
              : 'Create a professional job listing for students.'}
          </p>
        </div>

        <Link to="/company/jobs">
          <button className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur-xl transition-all hover:border-cyan-400 hover:text-cyan-700">
            ← Back to Jobs
          </button>
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center pt-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/70 shadow-xl backdrop-blur-xl">
            <Spinner size={28} />
          </div>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="grid gap-6 lg:grid-cols-3"
        >

          {/* LEFT SECTION */}
          <div className="space-y-6 lg:col-span-2">

            {/* Main Form */}
            <div className="rounded-[32px] border border-white/40 bg-white/70 p-7 shadow-2xl backdrop-blur-xl">

              <div className="mb-7 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
                  💼
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Job Information
                  </h3>

                  <p className="text-sm text-slate-500">
                    Fill out all required hiring details.
                  </p>
                </div>
              </div>

              {error ? (
                <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {error}
                </div>
              ) : null}

              {/* Role + CTC */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Job Role
                  </label>

                  <Input
                    id="role"
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value)
                    }
                    placeholder="Software Engineer"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    CTC
                  </label>

                  <Input
                    id="ctc"
                    value={ctc}
                    onChange={(e) =>
                      setCtc(e.target.value)
                    }
                    placeholder="800000"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Job Description
                </label>

                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Describe job responsibilities and requirements..."
                />
              </div>

              {/* Location + CGPA */}
              <div className="mt-5 grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Location
                  </label>

                  <Input
                    id="location"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    placeholder="Bangalore"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Minimum CGPA
                  </label>

                  <Input
                    id="minCgpa"
                    value={minCgpa}
                    onChange={(e) =>
                      setMinCgpa(
                        e.target.value
                      )
                    }
                    placeholder="7.5"
                    required
                  />
                </div>
              </div>

              {/* Mode + Openings */}
              <div className="mt-5 grid gap-5 md:grid-cols-3">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Work Mode
                  </label>

                  <Select
                    id="mode"
                    value={mode}
                    onChange={(e) =>
                      setMode(e.target.value)
                    }
                    options={MODES.map(
                      (m) => ({
                        value: m,
                        label: m,
                      })
                    )}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Openings
                  </label>

                  <Input
                    id="openings"
                    value={openings}
                    onChange={(e) =>
                      setOpenings(
                        e.target.value
                      )
                    }
                    placeholder="3"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-end">
                  <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4">

                    <div className="flex items-center justify-between">

                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          Active Job
                        </div>

                        <div className="text-xs text-slate-500">
                          Enable visibility
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) =>
                          setIsActive(
                            e.target.checked
                          )
                        }
                        className="h-5 w-5 accent-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Branches + Skills */}
              <div className="mt-5 grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Allowed Branches
                  </label>

                  <Input
                    id="branches"
                    value={
                      allowedBranchesText
                    }
                    onChange={(e) =>
                      setAllowedBranchesText(
                        e.target.value
                      )
                    }
                    placeholder="CSE, IT, AIDS"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Skills Required
                  </label>

                  <Input
                    id="skills"
                    value={
                      skillsRequiredText
                    }
                    onChange={(e) =>
                      setSkillsRequiredText(
                        e.target.value
                      )
                    }
                    placeholder="React, Node.js"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Application Deadline
                </label>

                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) =>
                    setDeadline(
                      e.target.value
                    )
                  }
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-4">

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  navigate('/company/jobs')
                }
                className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur-xl transition-all hover:border-slate-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-70"
              >
                {saving
                  ? isEdit
                    ? 'Saving Changes...'
                    : 'Creating Job...'
                  : isEdit
                  ? 'Save Changes'
                  : 'Create Job'}
              </button>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="space-y-6">

            {/* Preview Card */}
            <div className="overflow-hidden rounded-[32px] border border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl">

              {/* Top Gradient */}
              <div className="h-28 bg-gradient-to-r from-slate-900 via-blue-950 to-cyan-600" />

              <div className="relative px-6 pb-6">

                {/* Icon */}
                <div className="-mt-12 flex justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-white text-4xl shadow-xl">
                    🚀
                  </div>
                </div>

                {/* Title */}
                <div className="mt-5 text-center">

                  <h3 className="text-2xl font-bold text-slate-900">
                    {role || 'Job Role'}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {location ||
                      'Location'}
                  </p>
                </div>

                {/* Preview Stats */}
                <div className="mt-7 space-y-4">

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-medium text-slate-500">
                      Work Mode
                    </div>

                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {mode}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-medium text-slate-500">
                      Salary Package
                    </div>

                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {ctc
                        ? `₹ ${ctc}`
                        : 'Not specified'}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-medium text-slate-500">
                      Minimum CGPA
                    </div>

                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {minCgpa || '—'}
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="mt-6 flex flex-wrap gap-2">

                  <Badge variant="neutral">
                    {mode}
                  </Badge>

                  {allowedBranches.length ? (
                    <Badge variant="info">
                      {
                        allowedBranches.length
                      }{' '}
                      Branches
                    </Badge>
                  ) : null}

                  {skillsRequired.length ? (
                    <Badge variant="neutral">
                      {
                        skillsRequired.length
                      }{' '}
                      Skills
                    </Badge>
                  ) : null}
                </div>

                {/* Footer */}
                <div className="mt-6 rounded-2xl bg-blue-50 px-4 py-3 text-xs font-medium text-blue-700">
                  Admin approval required before students can apply.
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  </div>
)
}

