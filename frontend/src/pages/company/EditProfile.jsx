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
import {
  Building2,
  UploadCloud,
  Users,
} from 'lucide-react'
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
            Edit Company Profile
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Update your company information and hiring details.
          </p>

          {approvalStatus &&
          approvalStatus !== 'Approved' ? (
            <div className="mt-4 inline-flex rounded-full bg-amber-400/20 px-4 py-2 text-xs font-semibold text-amber-700 backdrop-blur-xl">
              {approvalStatus}
            </div>
          ) : null}
        </div>

        {profile?.updatedAt ? (
          <div className="rounded-2xl border border-white/40 bg-white/70 px-5 py-3 text-sm font-medium text-slate-600 shadow-lg backdrop-blur-xl">
            Last updated:{' '}
            <span className="font-semibold text-slate-900">
              {formatDate(profile.updatedAt)}
            </span>
          </div>
        ) : null}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center pt-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/70 shadow-xl backdrop-blur-xl">
            <Spinner size={28} />
          </div>
        </div>
      ) : error ? (
        <Card className="rounded-[28px] border border-rose-200 bg-rose-50/80 p-6 shadow-lg backdrop-blur-xl">
          <div className="text-sm font-semibold text-rose-700">
            {error}
          </div>
        </Card>
      ) : (
        <form
          onSubmit={onSave}
          className="grid gap-6 lg:grid-cols-3"
        >

          {/* LEFT SIDE */}
          <div className="space-y-6 lg:col-span-2">

            {/* Company Info */}
            <div className="rounded-[32px] border border-white/40 bg-white/70 p-7 shadow-2xl backdrop-blur-xl">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
                  <Building2 size={22} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Company Information
                  </h3>

                  <p className="text-sm text-slate-500">
                    Basic company details and branding.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>

                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Company Name
                  </label>

                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) =>
                      setCompanyName(
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Website
                  </label>

                  <Input
                    id="website"
                    value={website}
                    onChange={(e) =>
                      setWebsite(e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Industry
                  </label>

                  <Input
                    id="industry"
                    value={industry}
                    onChange={(e) =>
                      setIndustry(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </label>

                <Input
                  id="location"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                />
              </div>

              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* HR Section */}
            <div className="rounded-[32px] border border-white/40 bg-white/70 p-7 shadow-2xl backdrop-blur-xl">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 text-white shadow-lg">
                  <Users size={22} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    HR Contact Details
                  </h3>

                  <p className="text-sm text-slate-500">
                    Recruitment contact information.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    HR Name
                  </label>

                  <Input
                    id="hrName"
                    value={hrName}
                    onChange={(e) =>
                      setHrName(e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    HR Email
                  </label>

                  <Input
                    id="hrEmail"
                    type="email"
                    value={hrEmail}
                    onChange={(e) =>
                      setHrEmail(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  HR Phone
                </label>

                <Input
                  id="hrPhone"
                  value={hrPhone}
                  onChange={(e) =>
                    setHrPhone(e.target.value)
                  }
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-70"
              >
                {saving
                  ? 'Saving Changes...'
                  : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* Logo Upload */}
            <div className="overflow-hidden rounded-[32px] border border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl">

              {/* Top Gradient */}
              <div className="h-28 bg-gradient-to-r from-slate-900 via-blue-950 to-cyan-600" />

              <div className="relative px-6 pb-6">

                {/* Logo */}
                <div className="-mt-12 flex justify-center">
                  <div className="h-28 w-28 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl">

                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Company Logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                        <Building2 size={34} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Name */}
                <div className="mt-5 text-center">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {companyName || 'Company'}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Upload your company branding
                  </p>
                </div>

                {/* Upload */}
                <div className="mt-6">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition-all hover:border-cyan-400 hover:bg-cyan-50">

                    <UploadCloud
                      size={32}
                      className="text-cyan-600"
                    />

                    <span className="mt-3 text-sm font-semibold text-slate-700">
                      Click to upload logo
                    </span>

                    <span className="mt-1 text-xs text-slate-500">
                      PNG, JPG or SVG supported
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        onUploadLogo(
                          e.target.files?.[0]
                        )
                      }
                      disabled={logoUploading}
                      className="hidden"
                    />
                  </label>

                  {logoUploading ? (
                    <div className="mt-4 flex justify-center">
                      <Spinner size={22} />
                    </div>
                  ) : null}
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

