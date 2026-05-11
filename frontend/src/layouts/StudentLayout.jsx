import React, { useMemo, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  User,
  BriefcaseBusiness,
  FileText,
  Bell,
  LogOut,
  Menu,
  GraduationCap,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext.jsx'

export default function StudentLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const { user, profile, logout } = useAuth()

  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = useMemo(
    () => [
      {
        to: '/student/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
      },
      {
        to: '/student/profile',
        label: 'My Profile',
        icon: User,
      },
      {
        to: '/student/jobs',
        label: 'Jobs Listing',
        icon: BriefcaseBusiness,
      },
      {
        to: '/student/applications',
        label: 'My Applications',
        icon: FileText,
      },
      {
        to: '/student/notifications',
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

  const fullName =
    profile?.user?.fullName ||
    user?.fullName ||
    user?.fullName

  return (
    <div className="min-h-screen bg-slate-100">
      
      {/* Background Blur */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 grid min-h-screen grid-cols-12">
        
        {/* SIDEBAR */}
        <aside className="col-span-12 hidden lg:col-span-3 lg:block p-5">
          
          <div className="sticky top-5 flex h-[calc(100vh-40px)] flex-col overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 text-white shadow-2xl">

            {/* Blur Effects */}
            <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">

              {/* Logo */}
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/10">
                  <GraduationCap size={28} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold">
                    PlaceX
                  </h1>

                  <p className="text-sm text-slate-300">
                    Student Portal
                  </p>
                </div>
              </div>

              {/* User Card */}
              <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {user?.fullName ||
                        fullName ||
                        'Student'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-300">
                      {profile?.branch
                        ? `Branch: ${profile.branch}`
                        : 'Student Account'}
                    </p>
                  </div>

                  <span
                    className={
                      user?.approvalStatus === 'Approved'
                        ? 'rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-300'
                        : 'rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-300'
                    }
                  >
                    {user?.approvalStatus || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="mt-8 flex-1 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon

                  const active =
                    location.pathname === item.to

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

                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-red-500 hover:border-red-500"
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
                <GraduationCap size={24} />
              </div>

              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  PlaceX
                </h1>

                <p className="text-xs text-slate-500">
                  Student Portal
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(true)}
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
                onClick={() => setMobileOpen(false)}
              >
                <motion.div
                  initial={{ x: -320 }}
                  animate={{ x: 0 }}
                  exit={{ x: -320 }}
                  transition={{ duration: 0.25 }}
                  className="h-full w-[290px] overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-5 text-white shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex h-full flex-col">

                    {/* User */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                        <GraduationCap size={28} />
                      </div>

                      <div>
                        <h2 className="font-semibold">
                          {user?.fullName ||
                            'Student'}
                        </h2>

                        <p className="text-sm text-slate-300">
                          Student Portal
                        </p>
                      </div>
                    </div>

                    {/* Nav */}
                    <nav className="mt-8 flex-1 space-y-2">
                      {navItems.map((item) => {
                        const Icon = item.icon

                        const active =
                          location.pathname === item.to

                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() =>
                              setMobileOpen(false)
                            }
                            className={`flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                              active
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <Icon size={20} />

                            {item.label}
                          </Link>
                        )
                      })}
                    </nav>

                    {/* Logout */}
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