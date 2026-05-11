import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'

export default function PublicLayout({ children }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-100">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        
        {/* Gradient Blur */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10" />

        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20">
              <GraduationCap size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wide text-white">
                PlaceX
              </h1>

              <p className="text-xs text-slate-400">
                Placement Portal
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-3">
            
            <Link
              to="/auth/login"
              className={`rounded-xl px-5 py-2 text-sm font-medium transition-all ${
                location.pathname === '/auth/login'
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              Login
            </Link>

            <Link
              to="/auth/signup"
              className={`rounded-xl px-5 py-2 text-sm font-medium transition-all ${
                location.pathname === '/auth/signup'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              Signup
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <motion.main
        className="relative"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background Effects */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-24 left-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative z-10">
          {children}
        </div>
      </motion.main>

      {/* FOOTER */}
      <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950">
        
        {/* Footer Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-cyan-500/5 to-blue-600/5" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-slate-400 md:flex-row lg:px-8">
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
              <GraduationCap size={18} />
            </div>

            <div>
              <p className="font-medium text-slate-200">
                PlaceX
              </p>

              <p className="text-xs text-slate-500">
                Placement Management System
              </p>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 md:text-right">
            © 2026 PlaceX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}