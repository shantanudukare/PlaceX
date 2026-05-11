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
    <div className="min-h-screen bg-slate-100">

      {/* 🔥 FULL WIDTH */}
      <div className="grid grid-cols-12 min-h-screen">

        {/* Sidebar */}
<aside className="hidden lg:block lg:w-[300px] fixed top-0 left-0 h-screen p-5">  <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-md flex flex-col">

    {/* Company Info */}
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-lg font-semibold text-slate-900">
          {user?.fullName || companyName}
        </div>
        <div className="mt-1 text-base text-slate-500">
          {profile?.industry ? `Industry: ${profile.industry}` : ''}
        </div>
      </div>

      <span
        className={
          user?.approvalStatus === 'Approved'
            ? 'inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700'
            : 'inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700'
        }
      >
        {user?.approvalStatus || 'Pending'}
      </span>
    </div>

    {/* Navigation (scrollable if long) */}
    <nav className="mt-8 space-y-2 flex-1 overflow-y-auto">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="block rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 transition"
        >
          {item.label}
        </Link>
      ))}
    </nav>

    {/* Logout always fixed at bottom */}
    <button
      onClick={onLogout}
      className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-base font-medium text-white hover:bg-slate-800 transition"
    >
      Logout
    </button>

  </div>
</aside>

        {/* Content */}
<main className="col-span-12 lg:ml-[300px] p-6 lg:p-8">          {/* Mobile Header */}
          <div className="flex items-center justify-between lg:hidden mb-4">
            <div className="text-lg font-semibold text-slate-900">
              Company Portal
            </div>
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm"
            >
              Menu
            </button>
          </div>

          {/* Mobile Sidebar */}
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
                  className="h-full w-[260px] bg-white p-4 shadow-lg flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-base font-semibold text-slate-900">
                    {companyName}
                  </div>

                  <nav className="mt-4 space-y-2 flex-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <button
                    onClick={onLogout}
                    className="mt-4 w-full rounded-lg bg-slate-900 px-3 py-2 text-white"
                  >
                    Logout
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page Content */}
          <div className="mt-2">{children}</div>
        </main>

      </div>
    </div>
  )
}