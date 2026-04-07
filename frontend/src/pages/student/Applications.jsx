import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { http } from '../../api/http'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { applicationStatusVariant, formatDate } from '../../utils/format.js'

export default function StudentApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await http.get('/api/students/my-applications')
        const payload = res?.data?.data || []
        if (!mounted) return
        setApplications(payload)
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load applications')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            My Applications
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Track your status updates for submitted jobs.
          </p>
        </div>
        <div className="text-sm text-slate-600">
          {applications.length} application(s)
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center pt-10">
          <Spinner size={24} />
        </div>
      ) : error ? (
        <Card className="p-5">
          <div className="text-sm font-medium text-rose-700">{error}</div>
        </Card>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Apply to a job to see your status here."
          action={
            <Link to="/student/jobs">
              <Button type="button" variant="secondary">
                Browse Jobs
              </Button>
            </Link>
          }
        />
      ) : (
        <Card className="p-0">
          <div className="overflow-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-600">
                  <th className="px-4 py-3">Job</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Applied</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr
                    key={a._id}
                    className="border-t border-slate-100 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">
                        {a.job?.role || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {a.job?.companyProfile?.companyName || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={applicationStatusVariant(a.status)}>
                        {a.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(a.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {a.job?._id ? (
                        <Link to={`/student/jobs/${a.job._id}`}>
                          <Button type="button" variant="secondary">
                            View Job
                          </Button>
                        </Link>
                      ) : null}
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

