import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function PublicLayout({ children }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            PlaceX
          </Link>

          <nav className="flex items-center gap-4 text-sm text-slate-700">
            <Link
              to="/auth/login"
              className={
                location.pathname === '/auth/login'
                  ? 'font-medium text-slate-900'
                  : 'hover:text-slate-900'
              }
            >
              Login
            </Link>
            <Link
              to="/auth/signup"
              className={
                location.pathname === '/auth/signup'
                  ? 'font-medium text-slate-900'
                  : 'hover:text-slate-900'
              }
            >
              Signup
            </Link>
          </nav>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-600">
          Placement Management System
        </div>
      </footer>
    </div>
  )
}

