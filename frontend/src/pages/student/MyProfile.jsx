import React, { useEffect, useState } from 'react'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function assetUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}${path}`
}

function ProjectCard({ project }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">
            {project.title || 'Untitled Project'}
          </div>
          {project.description ? (
            <div className="mt-1 text-sm text-slate-600">
              {project.description}
            </div>
          ) : null}
        </div>
      </div>
      {Array.isArray(project.techStack) && project.techStack.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {project.techStack.map((t) => (
            <Badge key={t} variant="neutral">
              {t}
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-3">
        {project.githubLink ? (
          <a
            className="text-sm font-medium text-slate-900 underline hover:text-slate-700"
            href={project.githubLink}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        ) : null}
        {project.liveLink ? (
          <a
            className="text-sm font-medium text-slate-900 underline hover:text-slate-700"
            href={project.liveLink}
            target="_blank"
            rel="noreferrer"
          >
            Live
          </a>
        ) : null}
      </div>
    </Card>
  )
}

export default function MyProfile() {
  const toast = useToast()
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const res = await http.get('/api/students/me')
        const payload = res?.data?.data
        if (!mounted) return
        setProfile(payload)
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load profile')
        toast.pushToast({
          type: 'error',
          message: err?.message || 'Failed to load profile',
        })
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const approvalStatus = user?.approvalStatus
  const photoUrl = assetUrl(profile?.photo?.url)
  const resumeUrl = assetUrl(profile?.resume?.url)

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
              Student Profile
            </div>

            <h1 className="mt-5 text-4xl font-bold">
              My
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {' '}
                Profile
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
              View your academic profile, projects,
              resume and personal information.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() =>
              (window.location.href =
                '/student/profile/edit')
            }
            className="rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-white backdrop-blur hover:bg-white/20"
          >
            Edit Profile
          </Button>
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
      ) : !profile ? (
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-lg">
          <div className="text-sm font-medium text-slate-700">
            Profile not found.
          </div>
        </div>
      ) : (
        <div className="grid gap-8 xl:grid-cols-[340px_1fr]">
          
          {/* LEFT SIDE */}
          <div className="space-y-6">
            
            {/* PROFILE CARD */}
            <div className="overflow-hidden rounded-[30px] border border-white/40 bg-white/70 shadow-xl backdrop-blur-xl">
              
              {/* Top Gradient */}
              <div className="h-24 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600" />

              <div className="relative px-7 pb-7">
                
                {/* Photo */}
                <div className="-mt-14 flex justify-center">
                  
                  <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-400">
                        No Photo
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className="mt-5 text-center">
                  
                  <h2 className="text-2xl font-bold text-slate-900">
                    {profile.user?.fullName ||
                      profile.fullName ||
                      'Student'}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {profile.user?.email || ''}
                  </p>

                  {approvalStatus &&
                  approvalStatus !== 'Approved' ? (
                    <div className="mt-4">
                      <Badge variant="warning">
                        {approvalStatus}
                      </Badge>
                    </div>
                  ) : (
                    <div className="mt-4 inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700">
                      Approved
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="mt-8 space-y-4">
                  
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Branch
                    </div>

                    <div className="mt-1 text-sm font-medium text-slate-900">
                      {profile.branch || '—'}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      CGPA
                    </div>

                    <div className="mt-1 text-sm font-medium text-slate-900">
                      {profile.cgpa || '—'}
                    </div>
                  </div>

                  {profile.phone ? (
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Phone
                      </div>

                      <div className="mt-1 text-sm font-medium text-slate-900">
                        {profile.phone}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Resume */}
                <div className="mt-8">
                  {resumeUrl ? (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-cyan-600"
                    >
                      View Resume
                    </a>
                  ) : (
                    <div className="rounded-2xl bg-slate-100 p-4 text-center text-sm text-slate-500">
                      Resume not uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8">
            
            {/* SKILLS */}
            <div className="rounded-[30px] border border-white/40 bg-white/70 p-7 shadow-xl backdrop-blur-xl">
              
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Skills
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Technologies and tools added to your profile
                </p>
              </div>

              {Array.isArray(profile.skills) &&
              profile.skills.length ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {profile.skills.map((s) => (
                    <div
                      key={s}
                      className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-md"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm text-slate-500">
                  No skills added yet.
                </div>
              )}
            </div>

            {/* PROJECTS */}
            <div className="rounded-[30px] border border-white/40 bg-white/70 p-7 shadow-xl backdrop-blur-xl">
              
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Projects
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Showcase of your academic and personal work
                </p>
              </div>

              {Array.isArray(profile.projects) &&
              profile.projects.length ? (
                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  {profile.projects.map((p, i) => (
                    <div
                      key={i}
                      className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      
                      <h3 className="text-xl font-bold text-slate-900">
                        {p.title ||
                          'Untitled Project'}
                      </h3>

                      {p.description ? (
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {p.description}
                        </p>
                      ) : null}

                      {Array.isArray(p.techStack) &&
                      p.techStack.length ? (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {p.techStack.map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-6 flex flex-wrap gap-3">
                        
                        {p.githubLink ? (
                          <a
                            href={p.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                          >
                            GitHub
                          </a>
                        ) : null}

                        {p.liveLink ? (
                          <a
                            href={p.liveLink}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:from-blue-700 hover:to-cyan-600"
                          >
                            Live Demo
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm text-slate-500">
                  No projects added yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)
}

