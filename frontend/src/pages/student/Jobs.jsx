import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { formatDate, formatMoney } from '../../utils/format.js'

export default function StudentJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [roleQuery, setRoleQuery] = useState('')
  const [companyQuery, setCompanyQuery] = useState('')
  const [mode, setMode] = useState('All')
  const [minCtc, setMinCtc] = useState('')
  const [maxCtc, setMaxCtc] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await http.get('/api/students/eligible-jobs')
        const payload = res?.data?.data || []
        if (!mounted) return
        setJobs(payload)
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load jobs')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const filteredJobs = useMemo(() => {
    const roleQ = roleQuery.trim().toLowerCase()
    const companyQ = companyQuery.trim().toLowerCase()
    const min = minCtc !== '' ? Number(minCtc) : null
    const max = maxCtc !== '' ? Number(maxCtc) : null

    return jobs.filter((j) => {
      if (roleQ) {
        const role = j.role || ''
        if (!role.toLowerCase().includes(roleQ)) return false
      }

      if (companyQ) {
        const companyName = j.companyProfile?.companyName || j.companyProfile?.companyName
        if (!String(companyName).toLowerCase().includes(companyQ)) return false
      }

      if (mode !== 'All' && j.mode !== mode) return false

      if (min !== null && !Number.isNaN(min)) {
        if (Number(j.ctc) < min) return false
      }
      if (max !== null && !Number.isNaN(max)) {
        if (Number(j.ctc) > max) return false
      }

      return true
    })
  }, [jobs, roleQuery, companyQuery, mode, minCtc, maxCtc])

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
              Eligible Opportunities
            </div>

            <h1 className="mt-5 text-4xl font-bold">
              Jobs
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {' '}
                Listing
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
              Browse jobs that match your eligibility,
              skills and academic profile.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 px-6 py-5 backdrop-blur-xl">
            <div className="text-sm text-slate-300">
              Eligible Jobs
            </div>

            <div className="mt-2 text-4xl font-bold">
              {jobs.length}
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="rounded-[30px] border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Filters
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Search and filter opportunities
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          
          <div className="xl:col-span-2">
            <input
              value={roleQuery}
              onChange={(e) => setRoleQuery(e.target.value)}
              placeholder="Search by role"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="xl:col-span-2">
            <input
              value={companyQuery}
              onChange={(e) =>
                setCompanyQuery(e.target.value)
              }
              placeholder="Search by company"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <option value="All">Mode: All</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <input
              value={minCtc}
              onChange={(e) => setMinCtc(e.target.value)}
              placeholder="Min CTC"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <input
              value={maxCtc}
              onChange={(e) => setMaxCtc(e.target.value)}
              placeholder="Max CTC"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center justify-end xl:col-span-2">
            <Button
              type="button"
              onClick={() => {
                setRoleQuery('')
                setCompanyQuery('')
                setMode('All')
                setMinCtc('')
                setMaxCtc('')
              }}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-white shadow-lg hover:from-blue-700 hover:to-cyan-600"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
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
      ) : filteredJobs.length === 0 ? (
        <div className="rounded-[30px] border border-white/40 bg-white/70 p-10 shadow-xl backdrop-blur-xl">
          <EmptyState
            title="No jobs match your filters"
            description="Try clearing filters or searching different roles."
            action={
              <Button
                variant="secondary"
                onClick={() => setRoleQuery('')}
              >
                Reset Filters
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          
          {filteredJobs.map((j) => (
            <div
              key={j._id}
              className="group overflow-hidden rounded-[30px] border border-white/40 bg-white/70 p-7 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              
              {/* Top */}
              <div className="flex items-start justify-between gap-4">
                
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {j.role}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {j.companyProfile?.companyName || '—'}
                  </p>
                </div>

                <Badge
                  variant="neutral"
                  className="rounded-full px-4 py-1.5"
                >
                  {j.mode}
                </Badge>
              </div>

              {/* Details */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Location
                  </div>

                  <div className="mt-1 text-sm font-medium text-slate-900">
                    {j.location || '—'}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Package
                  </div>

                  <div className="mt-1 text-sm font-medium text-slate-900">
                    {formatMoney(j.ctc)}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Deadline
                  </div>

                  <div className="mt-1 text-sm font-medium text-slate-900">
                    {formatDate(j.deadline)}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Applicants
                  </div>

                  <div className="mt-1 text-sm font-medium text-slate-900">
                    {j.applicantsCount ?? 0}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex items-center justify-between">
                
                <div className="text-sm text-slate-500">
                  Apply before deadline
                </div>

                <Link to={`/student/jobs/${j._id}`}>
                  <Button
                    type="button"
                    className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-white shadow-lg hover:from-blue-700 hover:to-cyan-600"
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)
}


