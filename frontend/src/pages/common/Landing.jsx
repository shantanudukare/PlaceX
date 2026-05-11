import React from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          
          {/* LEFT SIDE */}
          <div>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <ShieldCheck size={16} />
              Smart Placement Platform
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900 lg:text-6xl">
              Placement
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {' '}
                Management
              </span>
              <br />
              System
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A modern college placement portal for students,
              recruiters, and administrators to streamline hiring,
              applications, and placement activities.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              
              <Link
                to="/auth/login"
                className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-cyan-600"
              >
                Login
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/auth/signup"
                className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50"
              >
                Create Account
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-14 grid grid-cols-3 gap-4">
              
              <div className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-lg backdrop-blur">
                <h3 className="text-3xl font-bold text-slate-900">
                  500+
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Students
                </p>
              </div>

              <div className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-lg backdrop-blur">
                <h3 className="text-3xl font-bold text-slate-900">
                  150+
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Companies
                </p>
              </div>

              <div className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-lg backdrop-blur">
                <h3 className="text-3xl font-bold text-slate-900">
                  24/7
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Access
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative">
            
            {/* Main Card */}
            <div className="relative overflow-hidden rounded-[36px] border border-white/40 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50" />

              <div className="relative z-10">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      What You Can Do
                    </h2>

                    <p className="mt-2 text-slate-500">
                      Everything needed for placements in one portal.
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
                    <GraduationCap size={28} />
                  </div>
                </div>

                {/* Features */}
                <div className="mt-10 space-y-5">
                  
                  <div className="flex gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <GraduationCap size={26} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Students
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Browse eligible jobs, manage profiles,
                        upload projects and apply for opportunities.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                      <Building2 size={26} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Companies
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Post jobs, manage applicants and connect
                        with talented students directly.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <ShieldCheck size={26} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Administration
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Verify students, approve companies and
                        maintain the placement workflow efficiently.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  )
}