import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import { http } from '../../api/http'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Spinner from '../../components/ui/Spinner.jsx'

import {
  applicationStatusVariant,
  formatDate,
} from '../../utils/format.js'

import {
  BriefcaseBusiness,
  CalendarDays,
  ArrowRight,
  FileText,
  Sparkles,
} from 'lucide-react'

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

        const res = await http.get(
          '/api/students/my-applications'
        )

        const payload = res?.data?.data || []

        if (!mounted) return

        setApplications(payload)
      } catch (err) {
        if (!mounted) return

        setError(
          err?.message ||
            'Failed to load applications'
        )
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
    <div className="relative">
      
      {/* Background Blur */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        
        {/* HEADER */}
        <div className="overflow-hidden rounded-[34px] bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-2xl">
          
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur">
                <Sparkles size={16} />
                Applications Portal
              </div>

              <h1 className="mt-5 text-4xl font-bold">
                My Applications
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                Track all your submitted job applications,
                monitor statuses and stay updated with
                placement progress.
              </p>
            </div>

            {/* Total Count */}
            <div className="rounded-3xl border border-white/10 bg-white/10 px-6 py-5 backdrop-blur-xl">
              <div className="text-sm text-slate-300">
                Total Applications
              </div>

              <div className="mt-2 text-4xl font-bold">
                {applications.length}
              </div>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
              <Spinner size={28} />
            </div>
          </div>
        ) : error ? (
          <Card className="mt-10 rounded-[30px] border border-red-200 bg-red-50 p-8 shadow-lg">
            
            <div className="text-lg font-semibold text-red-700">
              Failed to Load Applications
            </div>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </Card>
        ) : applications.length === 0 ? (
          <div className="mt-10 rounded-[30px] border border-white/40 bg-white/70 p-10 shadow-xl backdrop-blur-xl">
            <EmptyState
              title="No applications yet"
              description="Apply to jobs to track your application status here."
              action={
                <Link to="/student/jobs">
                  <Button
                    type="button"
                    className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600"
                  >
                    Browse Jobs
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-10 space-y-5">
            
            {applications.map((a, index) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.05,
                }}
              >
                <div className="group overflow-hidden rounded-[30px] border border-white/40 bg-white/70 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    
                    {/* Left Content */}
                    <div className="flex items-start gap-5">
                      
                      {/* Icon */}
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
                        <BriefcaseBusiness size={30} />
                      </div>

                      {/* Details */}
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                          {a.job?.role || '—'}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          
                          <div className="flex items-center gap-2">
                            <FileText size={16} />
                            {a.job?.companyProfile
                              ?.companyName || '—'}
                          </div>

                          <div className="flex items-center gap-2">
                            <CalendarDays size={16} />
                            Applied on{' '}
                            {formatDate(a.createdAt)}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="mt-5">
                          <Badge
                            variant={applicationStatusVariant(
                              a.status
                            )}
                            className="rounded-full px-4 py-1.5 text-sm"
                          >
                            {a.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center">
                      {a.job?._id ? (
                        <Link
                          to={`/student/jobs/${a.job._id}`}
                        >
                          <Button
                            type="button"
                            className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-white shadow-lg hover:from-blue-700 hover:to-cyan-600"
                          >
                            View Job
                            
                            <ArrowRight
                              size={18}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </Button>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}