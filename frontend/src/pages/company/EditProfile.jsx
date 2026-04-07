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

export default function CompanyEditProfile() {
  const toast = useToast()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [website, setWebsite] = useState('')
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('')
  const [location, setLocation] = useState('')
  const [hrName, setHrName] = useState('')
  const [hrEmail, setHrEmail] = useState('')
  const [hrPhone, setHrPhone] = useState('')

  const [logoUploading, setLogoUploading] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await http.get('/api/companies/me')
        const p = res?.data?.data || null
        if (!mounted) return
        setProfile(p)
        setFullName(p?.user?.fullName || '')
        setCompanyName(p?.companyName || '')
        setWebsite(p?.website || '')
        setDescription(p?.description || '')
        setIndustry(p?.industry || '')
        setLocation(p?.location || '')
        setHrName(p?.hrName || '')
        setHrEmail(p?.hrEmail || '')
        setHrPhone(p?.hrPhone || '')
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

  const logoUrl = useMemo(() => assetUrl(profile?.logo?.url), [profile])

  async function onSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (!fullName.trim() || !companyName.trim()) {
      setSaving(false)
      setError('Full name and company name are required')
      return
    }

    try {
      const payload = {
        fullName: fullName.trim(),
        companyName: companyName.trim(),
        website: website.trim() || undefined,
        description: description.trim() || undefined,
        industry: industry.trim() || undefined,
        location: location.trim() || undefined,
        hrName: hrName.trim() || undefined,
        hrEmail: hrEmail.trim() || undefined,
        hrPhone: hrPhone.trim() || undefined,
      }

      await http.put('/api/companies/me', payload)
      toast.pushToast({ type: 'success', message: 'Profile updated' })
      const refreshed = await http.get('/api/companies/me')
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

  async function onUploadLogo(file) {
    if (!file) return
    setLogoUploading(true)
    try {
      const formData = new FormData()
      formData.append('logo', file)
      await http.put('/api/companies/upload-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.pushToast({ type: 'success', message: 'Logo uploaded' })
      const refreshed = await http.get('/api/companies/me')
      setProfile(refreshed?.data?.data || null)
    } catch (err) {
      toast.pushToast({
        type: 'error',
        message: err?.message || 'Logo upload failed',
      })
    } finally {
      setLogoUploading(false)
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
        {profile?.updatedAt ? (
          <div className="text-sm text-slate-600">
            Last updated: {formatDate(profile.updatedAt)}
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
        <form onSubmit={onSave} className="grid gap-4 lg:grid-cols-3">
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
                  label="Company name"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input
                  label="Website (optional)"
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                <Input
                  label="Industry (optional)"
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input
                  label="Location (optional)"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <div />
              </div>

              <div className="mt-4">
                <Textarea
                  label="Description (optional)"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Input
                  label="HR Name (optional)"
                  id="hrName"
                  value={hrName}
                  onChange={(e) => setHrName(e.target.value)}
                />
                <Input
                  label="HR Email (optional)"
                  id="hrEmail"
                  type="email"
                  value={hrEmail}
                  onChange={(e) => setHrEmail(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <Input
                  label="HR Phone (optional)"
                  id="hrPhone"
                  value={hrPhone}
                  onChange={(e) => setHrPhone(e.target.value)}
                />
              </div>
            </Card>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button type="submit" loading={saving} disabled={saving}>
                Save Changes
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <div className="text-sm font-semibold text-slate-900">Logo</div>
              <div className="mt-3">
                <div className="h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {logoUrl ? (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <img
                      src={logoUrl}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                      No Logo
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onUploadLogo(e.target.files?.[0])}
                  disabled={logoUploading}
                  className="w-full text-sm"
                />
                <div className="mt-2 text-xs text-slate-600">
                  Upload will update your company logo.
                </div>
              </div>
            </Card>
          </div>
        </form>
      )}
    </div>
  )
}

