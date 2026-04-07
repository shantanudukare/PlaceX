import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

export default function CompanyMyProfile() {
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
        setError('')
        const res = await http.get('/api/companies/me')
        const payload = res?.data?.data || null
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
  const logoUrl = assetUrl(profile?.logo?.url)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Company Profile
          </h2>
          {approvalStatus && approvalStatus !== 'Approved' ? (
            <div className="mt-2">
              <Badge variant="warning">{approvalStatus}</Badge>
            </div>
          ) : null}
        </div>

        <div>
          <Link to="/company/profile/edit">
            <Button variant="secondary">Edit Profile</Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center">
          <Spinner size={24} />
        </div>
      ) : error ? (
        <Card className="p-5">
          <div className="text-sm font-medium text-rose-700">{error}</div>
        </Card>
      ) : !profile ? (
        <Card className="p-5">
          <div className="text-sm text-slate-600">Profile not found.</div>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {logoUrl ? (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <img
                      src={logoUrl}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      Logo
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-900">
                    {profile.companyName}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {profile.user?.email || ''}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-700">
                {profile.industry ? (
                  <div>
                    <span className="font-medium text-slate-900">
                      Industry:
                    </span>{' '}
                    {profile.industry}
                  </div>
                ) : null}
                {profile.location ? (
                  <div>
                    <span className="font-medium text-slate-900">Location:</span>{' '}
                    {profile.location}
                  </div>
                ) : null}
                {profile.website ? (
                  <div>
                    <span className="font-medium text-slate-900">Website:</span>{' '}
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-900 underline hover:text-slate-700"
                    >
                      {profile.website}
                    </a>
                  </div>
                ) : null}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5">
              <div className="text-sm font-semibold text-slate-900">
                About
              </div>
              <div className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
                {profile.description || '—'}
              </div>
            </Card>

            <Card className="p-5">
              <div className="text-sm font-semibold text-slate-900">
                HR Contact
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="text-sm">
                  <div className="text-xs font-medium text-slate-600">
                    Name
                  </div>
                  <div className="mt-1 font-medium text-slate-900">
                    {profile.hrName || '—'}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-xs font-medium text-slate-600">
                    Email
                  </div>
                  <div className="mt-1 font-medium text-slate-900">
                    {profile.hrEmail || '—'}
                  </div>
                </div>
              </div>
              {profile.hrPhone ? (
                <div className="mt-3 text-sm">
                  <div className="text-xs font-medium text-slate-600">
                    Phone
                  </div>
                  <div className="mt-1 font-medium text-slate-900">
                    {profile.hrPhone}
                  </div>
                </div>
              ) : null}
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

