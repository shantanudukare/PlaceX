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
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Jobs Listing
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Showing jobs you are eligible for.
          </p>
        </div>
        <div className="text-sm text-slate-600">
          {jobs.length} eligible job(s)
        </div>
      </div>

      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-5">
          <div className="md:col-span-2">
            <input
              value={roleQuery}
              onChange={(e) => setRoleQuery(e.target.value)}
              placeholder="Search by role"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
          </div>
          <div className="md:col-span-2">
            <input
              value={companyQuery}
              onChange={(e) => setCompanyQuery(e.target.value)}
              placeholder="Search by company"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
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
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
          </div>
          <div>
            <input
              value={maxCtc}
              onChange={(e) => setMaxCtc(e.target.value)}
              placeholder="Max CTC"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setRoleQuery('')
                setCompanyQuery('')
                setMode('All')
                setMinCtc('')
                setMaxCtc('')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="mt-10 flex justify-center">
          <Spinner size={24} />
        </div>
      ) : error ? (
        <Card className="p-5">
          <div className="text-sm font-medium text-rose-700">{error}</div>
        </Card>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title="No jobs match your filters"
          description="Try clearing filters or checking other roles."
          action={
            <Button variant="secondary" onClick={() => setRoleQuery('')}>
              Reset
            </Button>
          }
        />
      ) : (
        <Card className="p-0">
          <div className="overflow-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-600">
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">CTC</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Applicants</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((j) => (
                  <tr key={j._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {j.role}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {j.companyProfile?.companyName || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {j.location}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="neutral">{j.mode}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatMoney(j.ctc)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(j.deadline)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {j.applicantsCount ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/student/jobs/${j._id}`}>
                        <Button type="button" variant="secondary">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}


