import React, { useEffect, useState } from 'react'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { formatDate } from '../../utils/format.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminCompanies() {
  const toast = useToast()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await http.get('/api/admin/pending-companies')
        const payload = res?.data?.data || []
        if (!mounted) return
        setCompanies(payload)
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load pending companies')
        toast.pushToast({
          type: 'error',
          message: err?.message || 'Failed to load pending companies',
        })
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  async function updateStatus(companyId, approvalStatus) {
    setProcessingId(companyId)
    try {
      await http.put(`/api/admin/company/${companyId}/status`, {
        approvalStatus,
      })
      toast.pushToast({
        type: 'success',
        message: `Company ${approvalStatus.toLowerCase()}`,
      })
      const refreshed = await http.get('/api/admin/pending-companies')
      setCompanies(refreshed?.data?.data || [])
    } catch (err) {
      toast.pushToast({
        type: 'error',
        message: err?.message || 'Update failed',
      })
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Approve Companies
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Review company accounts waiting for admin approval.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center pt-10">
          <Spinner size={24} />
        </div>
      ) : error ? (
        <Card className="p-5">
          <div className="text-sm font-medium text-rose-700">{error}</div>
        </Card>
      ) : companies.length === 0 ? (
        <EmptyState title="No pending companies" description="All good." />
      ) : (
        <Card className="p-0">
          <div className="overflow-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-600">
                  <th className="px-4 py-3">Company Admin</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr
                    key={c._id}
                    className="border-t border-slate-100 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {c.fullName}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{c.email}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="warning">{c.approvalStatus}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="primary"
                          disabled={processingId === c._id}
                          loading={processingId === c._id}
                          onClick={() => updateStatus(c._id, 'Approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          disabled={processingId === c._id}
                          loading={processingId === c._id}
                          onClick={() => updateStatus(c._id, 'Rejected')}
                        >
                          Reject
                        </Button>
                      </div>
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


