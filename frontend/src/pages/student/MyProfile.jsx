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
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">My Profile</h2>
          {approvalStatus && approvalStatus !== 'Approved' ? (
            <div className="mt-2">
              <Badge variant="warning">{approvalStatus}</Badge>
            </div>
          ) : null}
        </div>

        <div>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = '/student/profile/edit')}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 flex justify-center">
          <Spinner size={24} />
        </div>
      ) : error ? (
        <Card className="p-5">
          <div className="text-sm font-medium text-rose-700">{error}</div>
        </Card>
      ) : !profile ? (
        <Card className="p-5">
          <div className="text-sm font-medium text-slate-700">
            Profile not found.
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {photoUrl ? (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <img src={photoUrl} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      No Photo
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-900">
                    {profile.user?.fullName || profile.fullName || 'Student'}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {profile.user?.email || ''}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <div>
                  <span className="font-medium text-slate-900">Branch:</span>{' '}
                  {profile.branch}
                </div>
                <div>
                  <span className="font-medium text-slate-900">CGPA:</span>{' '}
                  {profile.cgpa}
                </div>
                {profile.phone ? (
                  <div>
                    <span className="font-medium text-slate-900">Phone:</span>{' '}
                    {profile.phone}
                  </div>
                ) : null}
              </div>

              <div className="mt-4">
                {resumeUrl ? (
                  <a
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Resume
                  </a>
                ) : (
                  <div className="text-sm text-slate-600">
                    Resume not uploaded.
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5">
              <div className="text-sm font-semibold text-slate-900">
                Skills
              </div>
              {Array.isArray(profile.skills) && profile.skills.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <Badge key={s} variant="neutral">
                      {s}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="mt-2 text-sm text-slate-600">
                  No skills added yet.
                </div>
              )}
            </Card>

            <div className="space-y-3">
              <div className="text-sm font-semibold text-slate-900">
                Projects
              </div>
              {Array.isArray(profile.projects) && profile.projects.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {profile.projects.map((p, i) => (
                    <ProjectCard key={i} project={p} />
                  ))}
                </div>
              ) : (
                <Card className="p-5">
                  <div className="text-sm text-slate-600">
                    No projects added yet.
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

