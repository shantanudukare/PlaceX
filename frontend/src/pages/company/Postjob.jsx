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
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            {isEdit ? 'Edit Job' : 'Post a Job'}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {isEdit
              ? 'Changes will be sent for admin approval again.'
              : 'Create a job posting for admin approval.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/company/jobs">
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
      ) : (
        <Card className="p-5">
          <form onSubmit={onSubmit} className="space-y-4">
            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                {error}
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Job Role"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                required
              />
              <Input
                label="CTC (required)"
                id="ctc"
                value={ctc}
                onChange={(e) => setCtc(e.target.value)}
                placeholder="e.g. 800000"
                required
              />
            </div>

            <Textarea
              label="Job Description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe responsibilities and requirements..."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Location"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bangalore"
                required
              />
              <Input
                label="Minimum CGPA"
                id="minCgpa"
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                placeholder="e.g. 7.5"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Select
                label="Mode"
                id="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                options={MODES.map((m) => ({ value: m, label: m }))}
              />
              <Input
                label="Openings"
                id="openings"
                value={openings}
                onChange={(e) => setOpenings(e.target.value)}
                placeholder="e.g. 3"
              />
              <div className="flex items-end">
                <label className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
                  <span className="text-slate-800 font-medium">Active</span>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Allowed Branches (comma-separated)"
                id="branches"
                value={allowedBranchesText}
                onChange={(e) => setAllowedBranchesText(e.target.value)}
                placeholder="e.g. CSE, IT"
                required
              />
              <Input
                label="Skills Required (comma-separated, optional)"
                id="skills"
                value={skillsRequiredText}
                onChange={(e) => setSkillsRequiredText(e.target.value)}
                placeholder="e.g. React, Node, MongoDB"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Deadline"
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
              <div className="flex items-end">
                <div>
                  <div className="text-xs font-medium text-slate-600">
                    Preview
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="neutral">{mode}</Badge>
                    {allowedBranches.length ? (
                      <Badge variant="info">{allowedBranches.length} branches</Badge>
                    ) : null}
                    {skillsRequired.length ? (
                      <Badge variant="neutral">{skillsRequired.length} skills</Badge>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                disabled={saving}
                onClick={() => navigate('/company/jobs')}
              >
                Cancel
              </Button>
              <Button type="submit" loading={saving} disabled={saving}>
                {isEdit ? 'Save Changes' : 'Create Job'}
              </Button>
            </div>

            <div className="text-xs text-slate-500">
              Admin approval required before students can apply.
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}

