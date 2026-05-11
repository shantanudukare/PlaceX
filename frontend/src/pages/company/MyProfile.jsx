import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Pencil,
  ShieldCheck,
} from 'lucide-react'

import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000'

function assetUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}${path}`
}

export default function CompanyMyProfile() {
  const toast = useToast()
  const { user } = useAuth()

  const [profile, setProfile] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        setLoading(true)
        setError('')

        const res = await http.get(
          '/api/companies/me'
        )

        const payload =
          res?.data?.data || null

        if (!mounted) return

        setProfile(payload)
      } catch (err) {
        if (!mounted) return

        setError(
          err?.message ||
            'Failed to load profile'
        )

        toast.pushToast({
          type: 'error',
          message:
            err?.message ||
            'Failed to load profile',
        })
      } finally {
        if (mounted)
          setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const approvalStatus =
    user?.approvalStatus

  const logoUrl = assetUrl(
    profile?.logo?.url
  )

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
              Company Profile
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Manage and review your
              company information.
            </p>

            {approvalStatus &&
            approvalStatus !==
              'Approved' ? (
              <div className="mt-4">
                <span className="rounded-full bg-amber-400/20 px-4 py-2 text-xs font-semibold text-amber-700 backdrop-blur-xl">
                  {approvalStatus}
                </span>
              </div>
            ) : null}
          </div>

          <Link to="/company/profile/edit">
            <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              <Pencil size={16} />
              Edit Profile
            </button>
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="mt-16 flex justify-center">
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
        ) : !profile ? (
          <Card className="rounded-[28px] border border-white/40 bg-white/70 p-6 shadow-lg backdrop-blur-xl">
            <div className="text-sm text-slate-600">
              Profile not found.
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">

            {/* LEFT SECTION */}
            <div className="space-y-6 lg:col-span-1">

              {/* Profile Card */}
              <div className="overflow-hidden rounded-[32px] border border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl">

                {/* Top Gradient */}
                <div className="h-28 bg-gradient-to-r from-slate-900 via-blue-950 to-cyan-600" />

                <div className="relative px-6 pb-6">

                  {/* Logo */}
                  <div className="-mt-12 flex justify-center">
                    <div className="h-24 w-24 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl">

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

                  {/* Company Info */}
                  <div className="mt-5 text-center">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {profile.companyName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {profile.user?.email ||
                        ''}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="mt-6 space-y-4">

                    {profile.industry ? (
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                          <Building2
                            size={20}
                          />
                        </div>

                        <div>
                          <div className="text-xs font-medium text-slate-500">
                            Industry
                          </div>

                          <div className="text-sm font-semibold text-slate-900">
                            {
                              profile.industry
                            }
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {profile.location ? (
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                          <MapPin
                            size={20}
                          />
                        </div>

                        <div>
                          <div className="text-xs font-medium text-slate-500">
                            Location
                          </div>

                          <div className="text-sm font-semibold text-slate-900">
                            {
                              profile.location
                            }
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {profile.website ? (
                      <a
                        href={
                          profile.website
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <Globe
                            size={20}
                          />
                        </div>

                        <div>
                          <div className="text-xs font-medium text-slate-500">
                            Website
                          </div>

                          <div className="text-sm font-semibold text-blue-700">
                            Visit Website
                          </div>
                        </div>
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="space-y-6 lg:col-span-2">

              {/* About */}
              <div className="rounded-[32px] border border-white/40 bg-white/70 p-7 shadow-2xl backdrop-blur-xl">

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                    <ShieldCheck size={22} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      About Company
                    </h3>

                    <p className="text-sm text-slate-500">
                      Company overview and
                      description.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700 whitespace-pre-wrap">
                  {profile.description ||
                    '—'}
                </div>
              </div>

              {/* HR Contact */}
              <div className="rounded-[32px] border border-white/40 bg-white/70 p-7 shadow-2xl backdrop-blur-xl">

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 text-white">
                    <Mail size={22} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      HR Contact
                    </h3>

                    <p className="text-sm text-slate-500">
                      Human resources contact
                      information.
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">

                  {/* HR Name */}
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        <Building2
                          size={18}
                        />
                      </div>

                      <div>
                        <div className="text-xs font-medium text-slate-500">
                          HR Name
                        </div>

                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {profile.hrName ||
                            '—'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* HR Email */}
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                        <Mail size={18} />
                      </div>

                      <div>
                        <div className="text-xs font-medium text-slate-500">
                          HR Email
                        </div>

                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {profile.hrEmail ||
                            '—'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* HR Phone */}
                  {profile.hrPhone ? (
                    <div className="rounded-2xl bg-slate-50 p-5 sm:col-span-2">
                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <Phone
                            size={18}
                          />
                        </div>

                        <div>
                          <div className="text-xs font-medium text-slate-500">
                            Phone Number
                          </div>

                          <div className="mt-1 text-sm font-semibold text-slate-900">
                            {
                              profile.hrPhone
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}