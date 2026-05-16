import React, { useMemo, useState } from 'react'
import {
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import {
  motion,
  AnimatePresence,
} from 'framer-motion'

import {
  LayoutDashboard,
  UserCheck,
  Building2,
  BriefcaseBusiness,
  BarChart3,
  Bell,
  LogOut,
  Menu,
  ShieldCheck,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext.jsx'

export default function AdminLayout({
  children,
}) {
  const navigate = useNavigate()
  const location = useLocation()

  const { user, logout } = useAuth()

  const [mobileOpen, setMobileOpen] =
    useState(false)

  const navItems = useMemo(
    () => [
      {
        to: '/admin/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
      },
      {
        to: '/admin/pending-students',
        label: 'Approve Students',
        icon: UserCheck,
      },
      {
        to: '/admin/pending-companies',
        label: 'Approve Companies',
        icon: Building2,
      },
      {
        to: '/admin/pending-jobs',
        label: 'Approve Jobs',
        icon: BriefcaseBusiness,
      },
      {
        to: '/admin/placement-summary',
        label: 'Placement Summary',
        icon: BarChart3,
      },
      {
        to: '/admin/notifications',
        label: 'Notifications',
        icon: Bell,
      },
    ],
    []
  )

  async function onLogout() {
    await logout()
    setMobileOpen(false)
    navigate('/auth/login')
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* BACKGROUND BLUR */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 grid min-h-screen grid-cols-12">

        {/* SIDEBAR */}
        <aside className="col-span-12 hidden lg:col-span-3 lg:block p-5">

<div className="sticky top-5 flex h-[calc(100vh-40px)] flex-col overflow-y-auto rounded-[32px] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 text-white shadow-2xl">
            {/* Blur Effects */}
            <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">

              {/* LOGO */}
              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur">
                  <ShieldCheck size={28} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold">
                    PlaceX
                  </h1>

                  <p className="text-sm text-slate-300">
                    Admin Portal
                  </p>
                </div>
              </div>

              {/* ADMIN CARD */}
              <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <h2 className="text-lg font-semibold">
                      {user?.fullName ||
                        'Admin'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-300">
                      College Administrator
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                    Active
                  </span>
                </div>
              </div>

              {/* NAVIGATION */}
              <nav className="mt-8 flex-1 space-y-2">

                {navItems.map((item) => {
                  const Icon = item.icon

                  const active =
                    location.pathname ===
                    item.to

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`group flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                        active
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />

                      <span>
                        {item.label}
                      </span>
                    </Link>
                  )
                })}
              </nav>

              {/* LOGOUT */}
              <button
                onClick={onLogout}
                className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:border-red-500 hover:bg-red-500"
              >
                <LogOut size={18} />

                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="col-span-12 lg:col-span-9 p-4 lg:p-8">

          {/* MOBILE HEADER */}
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm backdrop-blur lg:hidden">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  PlaceX
                </h1>

                <p className="text-xs text-slate-500">
                  Admin Portal
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                setMobileOpen(true)
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* MOBILE SIDEBAR */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() =>
                  setMobileOpen(false)
                }
              >
                <motion.div
                  initial={{ x: -320 }}
                  animate={{ x: 0 }}
                  exit={{ x: -320 }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="h-full w-[290px] overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-5 text-white shadow-2xl"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >
                  <div className="flex h-full flex-col">

                    {/* USER */}
                    <div className="flex items-center gap-3">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                        <ShieldCheck size={28} />
                      </div>

                      <div>
                        <h2 className="font-semibold">
                          {user?.fullName ||
                            'Admin'}
                        </h2>

                        <p className="text-sm text-slate-300">
                          Admin Portal
                        </p>
                      </div>
                    </div>

                    {/* NAV */}
                    <nav className="mt-8 flex-1 space-y-2">

                      {navItems.map(
                        (item) => {
                          const Icon =
                            item.icon

                          const active =
                            location.pathname ===
                            item.to

                          return (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={() =>
                                setMobileOpen(
                                  false
                                )
                              }
                              className={`flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                                active
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <Icon
                                size={20}
                              />

                              {item.label}
                            </Link>
                          )
                        }
                      )}
                    </nav>

                    {/* LOGOUT */}
                    <button
                      onClick={onLogout}
                      className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white"
                    >
                      <LogOut size={18} />

                      Logout
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PAGE CONTENT */}
          <div className="rounded-[32px] border border-white/40 bg-white/70 p-5 shadow-xl backdrop-blur-xl lg:p-7">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}