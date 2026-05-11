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
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur">
              Edit Student Profile
            </div>

            <h1 className="mt-5 text-4xl font-bold">
              Manage Your Profile
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
              Update your academic details, projects,
              skills, resume and profile information.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            
            {approvalStatus ? (
              <div
                className={`rounded-2xl border px-5 py-4 text-sm font-medium backdrop-blur ${
                  approvalStatus === 'Approved'
                    ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                    : 'border-amber-400/20 bg-amber-400/10 text-amber-100'
                }`}
              >
                <div className="text-xs uppercase tracking-wider opacity-80">
                  Approval Status
                </div>

                <div className="mt-1 text-lg font-semibold">
                  {approvalStatus}
                </div>
              </div>
            ) : null}

            {profile?.updatedAt ? (
              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-slate-300 backdrop-blur">
                Last updated:{' '}
                <span className="font-semibold text-white">
                  {formatDate(profile.updatedAt)}
                </span>
              </div>
            ) : null}
          </div>
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
      ) : (
        <form
          className="grid gap-8 xl:grid-cols-[1fr_340px]"
          onSubmit={onSave}
        >
          
          {/* LEFT SIDE */}
          <div className="space-y-8">

            {/* BASIC INFO */}
            <div className="rounded-[30px] border border-white/40 bg-white/70 p-7 shadow-xl backdrop-blur-xl">
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Basic Information
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Update your academic and personal details
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Full name"
                  id="fullName"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  required
                />

                <Input
                  label="Branch"
                  id="branch"
                  value={branch}
                  onChange={(e) =>
                    setBranch(e.target.value)
                  }
                  required
                />
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Input
                  label="CGPA (0-10)"
                  id="cgpa"
                  value={cgpa}
                  onChange={(e) =>
                    setCgpa(e.target.value)
                  }
                  required
                />

                <Input
                  label="Phone"
                  id="phone"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />
              </div>

              <div className="mt-5">
                <Input
                  label="Skills (comma-separated)"
                  id="skills"
                  value={skillsText}
                  onChange={(e) =>
                    setSkillsText(e.target.value)
                  }
                  placeholder="React, Node, MongoDB"
                />
              </div>
            </div>

            {/* PROJECTS */}
            <div className="rounded-[30px] border border-white/40 bg-white/70 p-7 shadow-xl backdrop-blur-xl">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Projects
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Showcase your best work and projects
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-cyan-600"
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

              <div className="mt-8 space-y-6">
                {projects.map((p, idx) => (
                  <div
                    key={idx}
                    className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    
                    <div className="flex items-center justify-between">
                      
                      <h3 className="text-lg font-semibold text-slate-900">
                        Project #{idx + 1}
                      </h3>

                      {projects.length > 1 ? (
                        <button
                          type="button"
                          className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                          onClick={() =>
                            setProjects((prev) =>
                              prev.filter(
                                (_, i) => i !== idx
                              )
                            )
                          }
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      
                      <Input
                        label="Title"
                        id={`pr-title-${idx}`}
                        value={p.title}
                        onChange={(e) => {
                          const v = e.target.value

                          setProjects((prev) =>
                            prev.map((x, i) =>
                              i === idx
                                ? { ...x, title: v }
                                : x
                            )
                          )
                        }}
                      />

                      <Input
                        label="Tech Stack"
                        id={`pr-tech-${idx}`}
                        value={p.techStack}
                        onChange={(e) => {
                          const v = e.target.value

                          setProjects((prev) =>
                            prev.map((x, i) =>
                              i === idx
                                ? {
                                    ...x,
                                    techStack: v,
                                  }
                                : x
                            )
                          )
                        }}
                      />
                    </div>

                    <div className="mt-5">
                      <Textarea
                        label="Description"
                        id={`pr-desc-${idx}`}
                        value={p.description}
                        onChange={(e) => {
                          const v = e.target.value

                          setProjects((prev) =>
                            prev.map((x, i) =>
                              i === idx
                                ? {
                                    ...x,
                                    description: v,
                                  }
                                : x
                            )
                          )
                        }}
                      />
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      
                      <Input
                        label="GitHub Link"
                        id={`pr-gh-${idx}`}
                        value={p.githubLink}
                        onChange={(e) => {
                          const v = e.target.value

                          setProjects((prev) =>
                            prev.map((x, i) =>
                              i === idx
                                ? {
                                    ...x,
                                    githubLink: v,
                                  }
                                : x
                            )
                          )
                        }}
                      />

                      <Input
                        label="Live Link"
                        id={`pr-live-${idx}`}
                        value={p.liveLink}
                        onChange={(e) => {
                          const v = e.target.value

                          setProjects((prev) =>
                            prev.map((x, i) =>
                              i === idx
                                ? {
                                    ...x,
                                    liveLink: v,
                                  }
                                : x
                            )
                          )
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* SAVE BUTTON */}
              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  loading={saving}
                  disabled={saving}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 text-white shadow-lg hover:from-blue-700 hover:to-cyan-600"
                >
                  Save Changes
                </Button>
              </div>

              {error ? (
                <div className="mt-4 text-sm text-red-600">
                  {error}
                </div>
              ) : null}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            
            {/* PHOTO */}
<div className="rounded-[30px] border border-white/40 bg-white/70 p-7 shadow-xl backdrop-blur-xl">              
              <h2 className="text-2xl font-bold text-slate-900">
                Profile Photo
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Upload your professional profile picture
              </p>

              <div className="mt-8 flex justify-center">
                
                <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-xl">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No Photo
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    onUploadPhoto(
                      e.target.files?.[0]
                    )
                  }
                  disabled={photoUploading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                />

                <p className="mt-2 text-xs text-slate-500">
                  JPG, PNG supported
                </p>
              </div>
            </div>

            {/* RESUME */}
            <div className="rounded-[30px] border border-white/40 bg-white/70 p-7 shadow-xl backdrop-blur-xl">
              
              <h2 className="text-2xl font-bold text-slate-900">
                Resume
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Upload your updated resume in PDF format
              </p>

              <div className="mt-6">
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-2xl border border-blue-100 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                  >
                    View Current Resume
                  </a>
                ) : (
                  <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-500">
                    Resume not uploaded yet.
                  </div>
                )}
              </div>

              <div className="mt-6">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    onUploadResume(
                      e.target.files?.[0]
                    )
                  }
                  disabled={resumeUploading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Only PDF files are allowed
                </p>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  </div>
)
}

