import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'

export default function CompanyLayout({ children }) {
  const navigate = useNavigate()
  const { user, profile, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = useMemo(
    () => [
      { to: '/company/dashboard', label: 'Dashboard' },
      { to: '/company/profile', label: 'Company Profile' },
      { to: '/company/jobs', label: 'My Jobs' },
      { to: '/company/jobs/new', label: 'Post Job' },
      { to: '/company/notifications', label: 'Notifications' },
    ],
    []
  )

  async function onLogout() {
    await logout()
    setMobileOpen(false)
    navigate('/auth/login')
  }

  const companyName = profile?.companyName || 'Company'

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-0 px-4 py-6">
        <aside className="col-span-12 hidden lg:block lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {user?.fullName || companyName}
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  {profile?.industry ? `Industry: ${profile.industry}` : ''}
                </div>
              </div>
              <div className="text-right">
                <span
                  className={
                    user?.approvalStatus === 'Approved'
                      ? 'inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700'
                      : 'inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700'
                  }
                >
                  {user?.approvalStatus || 'Pending'}
                </span>
              </div>
            </div>

            <nav className="mt-5 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              onClick={onLogout}
              className="mt-5 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-9">
          <div className="flex items-center justify-between lg:hidden">
            <div className="text-lg font-semibold text-slate-900">
              Company Portal
            </div>
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm"
            >
              Menu
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                className="fixed inset-0 z-50 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
              >
                <motion.div
                  initial={{ x: -260 }}
                  animate={{ x: 0 }}
                  exit={{ x: -260 }}
                  transition={{ duration: 0.2 }}
                  className="h-full w-[260px] bg-white p-4 shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {companyName}
                  </div>
                  <nav className="mt-4 space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <button
                    onClick={onLogout}
                    className="mt-5 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Logout
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5">{children}</div>
        </main>
      </div>
    </div>
  )
}

