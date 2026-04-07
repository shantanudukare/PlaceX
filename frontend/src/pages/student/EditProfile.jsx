import React, { useEffect, useMemo, useState } from 'react'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Textarea from '../../components/ui/Textarea.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { formatDate } from '../../utils/format.js'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function assetUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}${path}`
}

function parseCommaList(text) {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function buildProjectsPayload(projects) {
  return projects
    .map((p) => ({
      title: p.title.trim(),
      description: p.description.trim(),
      techStack: p.techStack.trim() ? parseCommaList(p.techStack) : [],
      githubLink: p.githubLink.trim(),
      liveLink: p.liveLink.trim(),
    }))
    .filter((p) => p.title || p.description || p.githubLink || p.liveLink)
}

export default function EditProfile() {
  const toast = useToast()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [fullName, setFullName] = useState('')
  const [branch, setBranch] = useState('')
  const [cgpa, setCgpa] = useState('')
  const [phone, setPhone] = useState('')
  const [skillsText, setSkillsText] = useState('')
  const [projects, setProjects] = useState([
    {
      title: '',
      description: '',
      techStack: '',
      githubLink: '',
      liveLink: '',
    },
  ])

  const [photoUploading, setPhotoUploading] = useState(false)
  const [resumeUploading, setResumeUploading] = useState(false)

  const [profile, setProfile] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await http.get('/api/students/me')
        const p = res?.data?.data
        if (!mounted) return
        setProfile(p || null)
        setFullName(p?.user?.fullName || '')
        setBranch(p?.branch || '')
        setCgpa(p?.cgpa ?? '')
        setPhone(p?.phone || '')
        setSkillsText(Array.isArray(p?.skills) ? p.skills.join(', ') : '')
        setProjects(
          Array.isArray(p?.projects) && p.projects.length
            ? p.projects.map((pr) => ({
                title: pr.title || '',
                description: pr.description || '',
                techStack: Array.isArray(pr.techStack)
                  ? pr.techStack.join(', ')
                  : '',
                githubLink: pr.githubLink || '',
                liveLink: pr.liveLink || '',
              }))
            : [
                {
                  title: '',
                  description: '',
                  techStack: '',
                  githubLink: '',
                  liveLink: '',
                },
              ]
        )
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load profile')
        toast.pushToast({
          type: 'error',
          message: err?.message || 'Failed to load profile',
        })
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const photoUrl = useMemo(() => assetUrl(profile?.photo?.url), [profile])
  const resumeUrl = useMemo(
    () => assetUrl(profile?.resume?.url),
    [profile]
  )

  async function onSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const cgpaNum = Number(cgpa)
    if (!fullName.trim() || !branch.trim() || Number.isNaN(cgpaNum)) {
      setSaving(false)
      setError('Please provide valid profile fields')
      return
    }

    try {
      const payload = {
        fullName: fullName.trim(),
        branch: branch.trim(),
        cgpa: cgpaNum,
        phone: phone.trim() || undefined,
        skills: skillsText.trim() ? parseCommaList(skillsText) : [],
        projects: buildProjectsPayload(projects),
      }

      await http.put('/api/students/me', payload)
      toast.pushToast({ type: 'success', message: 'Profile updated' })

      const refreshed = await http.get('/api/students/me')
      setProfile(refreshed?.data?.data || null)
    } catch (err) {
      setError(err?.message || 'Failed to update profile')
      toast.pushToast({
        type: 'error',
        message: err?.message || 'Failed to update profile',
      })
    } finally {
      setSaving(false)
    }
  }

  async function onUploadPhoto(file) {
    if (!file) return
    setPhotoUploading(true)
    try {
      const formData = new FormData()
      formData.append('photo', file)
      await http.put('/api/students/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.pushToast({ type: 'success', message: 'Photo uploaded' })
      const refreshed = await http.get('/api/students/me')
      setProfile(refreshed?.data?.data || null)
    } catch (err) {
      toast.pushToast({ type: 'error', message: err?.message || 'Upload failed' })
    } finally {
      setPhotoUploading(false)
    }
  }

  async function onUploadResume(file) {
    if (!file) return
    setResumeUploading(true)
    try {
      const formData = new FormData()
      formData.append('resume', file)
      await http.put('/api/students/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.pushToast({ type: 'success', message: 'Resume uploaded' })
      const refreshed = await http.get('/api/students/me')
      setProfile(refreshed?.data?.data || null)
    } catch (err) {
      toast.pushToast({ type: 'error', message: err?.message || 'Upload failed' })
    } finally {
      setResumeUploading(false)
    }
  }

  const approvalStatus = user?.approvalStatus

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Edit Profile
          </h2>
          {approvalStatus && approvalStatus !== 'Approved' ? (
            <div className="mt-2">
              <Badge variant="warning">{approvalStatus}</Badge>
            </div>
          ) : null}
        </div>
        {photoUrl || resumeUrl ? (
          <div className="text-sm text-slate-600">
            Last updated:{' '}
            {profile?.updatedAt ? formatDate(profile.updatedAt) : '—'}
          </div>
        ) : null}
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
        <form className="grid gap-4 lg:grid-cols-3" onSubmit={onSave}>
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Full name"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Branch"
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input
                  label="CGPA (0-10)"
                  id="cgpa"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  required
                />
                <Input
                  label="Phone (optional)"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Skills (comma-separated)"
                  id="skills"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="React, Node, MongoDB"
                />
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-900">
                    Projects
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() =>
                      setProjects((prev) => [
                        ...prev,
                        {
                          title: '',
                          description: '',
                          techStack: '',
                          githubLink: '',
                          liveLink: '',
                        },
                      ])
                    }
                  >
                    Add Project
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {projects.map((p, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm font-semibold text-slate-900">
                          Project #{idx + 1}
                        </div>
                        {projects.length > 1 ? (
                          <button
                            type="button"
                            className="rounded-lg px-2 py-1 text-sm text-rose-700 hover:bg-rose-50"
                            onClick={() =>
                              setProjects((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-3 grid gap-4 md:grid-cols-2">
                        <Input
                          label="Title"
                          id={`pr-title-${idx}`}
                          value={p.title}
                          onChange={(e) => {
                            const v = e.target.value
                            setProjects((prev) =>
                              prev.map((x, i) =>
                                i === idx ? { ...x, title: v } : x
                              )
                            )
                          }}
                        />
                        <Input
                          label="Tech Stack (comma)"
                          id={`pr-tech-${idx}`}
                          value={p.techStack}
                          onChange={(e) => {
                            const v = e.target.value
                            setProjects((prev) =>
                              prev.map((x, i) =>
                                i === idx ? { ...x, techStack: v } : x
                              )
                            )
                          }}
                        />
                      </div>

                      <div className="mt-3">
                        <Textarea
                          label="Description"
                          id={`pr-desc-${idx}`}
                          value={p.description}
                          onChange={(e) => {
                            const v = e.target.value
                            setProjects((prev) =>
                              prev.map((x, i) =>
                                i === idx ? { ...x, description: v } : x
                              )
                            )
                          }}
                        />
                      </div>

                      <div className="mt-3 grid gap-4 md:grid-cols-2">
                        <Input
                          label="GitHub link"
                          id={`pr-gh-${idx}`}
                          value={p.githubLink}
                          onChange={(e) => {
                            const v = e.target.value
                            setProjects((prev) =>
                              prev.map((x, i) =>
                                i === idx
                                  ? { ...x, githubLink: v }
                                  : x
                              )
                            )
                          }}
                        />
                        <Input
                          label="Live link"
                          id={`pr-live-${idx}`}
                          value={p.liveLink}
                          onChange={(e) => {
                            const v = e.target.value
                            setProjects((prev) =>
                              prev.map((x, i) =>
                                i === idx
                                  ? { ...x, liveLink: v }
                                  : x
                              )
                            )
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button type="submit" loading={saving} disabled={saving}>
                Save Changes
              </Button>
            </div>

            {error ? <div className="text-sm text-rose-600">{error}</div> : null}
          </div>

          {/* Uploads */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="text-sm font-semibold text-slate-900">
                Upload Photo
              </div>
              <div className="mt-3">
                <div className="h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {photoUrl ? (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <img
                      src={photoUrl}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                      No photo
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onUploadPhoto(e.target.files?.[0])}
                  disabled={photoUploading}
                  className="w-full text-sm"
                />
                <div className="mt-2 text-xs text-slate-600">
                  Upload will update your student photo.
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="text-sm font-semibold text-slate-900">
                Upload Resume (PDF)
              </div>
              <div className="mt-3">
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                  >
                    View current resume
                  </a>
                ) : (
                  <div className="text-sm text-slate-600">
                    Resume not uploaded yet.
                  </div>
                )}
              </div>

              <div className="mt-4">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => onUploadResume(e.target.files?.[0])}
                  disabled={resumeUploading}
                  className="w-full text-sm"
                />
                <div className="mt-2 text-xs text-slate-600">
                  Only PDF files are allowed.
                </div>
              </div>
            </Card>
          </div>
        </form>
      )}
    </div>
  )
}

