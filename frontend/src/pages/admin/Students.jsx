import React, { useEffect, useState } from 'react'
import { http } from '../../api/http'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { formatDate } from '../../utils/format.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminStudents() {
  const toast = useToast()

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await http.get('/api/admin/pending-students')
        const payload = res?.data?.data || []
        if (!mounted) return
        setStudents(payload)
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load pending students')
        toast.pushToast({
          type: 'error',
          message: err?.message || 'Failed to load pending students',
        })
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  async function updateStatus(studentId, approvalStatus) {
    setProcessingId(studentId)
    try {
      await http.put(`/api/admin/student/${studentId}/status`, {
        approvalStatus,
      })
      toast.pushToast({
        type: 'success',
        message: `Student ${approvalStatus.toLowerCase()}`,
      })
      const refreshed = await http.get('/api/admin/pending-students')
      setStudents(refreshed?.data?.data || [])
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
          Approve Students
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Review student accounts waiting for admin approval.
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
      ) : students.length === 0 ? (
        <EmptyState title="No pending students" description="Everything is up to date." />
      ) : (
        <Card className="p-0">
          <div className="overflow-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-600">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr
                    key={s._id}
                    className="border-t border-slate-100 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {s.fullName}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{s.email}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(s.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="warning">{s.approvalStatus}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="primary"
                          disabled={processingId === s._id}
                          loading={processingId === s._id}
                          onClick={() => updateStatus(s._id, 'Approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          disabled={processingId === s._id}
                          loading={processingId === s._id}
                          onClick={() => updateStatus(s._id, 'Rejected')}
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


