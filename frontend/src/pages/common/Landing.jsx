import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Placement Management System
          </h1>
          <p className="mt-4 text-slate-600">
            A clean college/job portal for students, companies, and admin approvals.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/auth/login"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Login
            </Link>
            <Link
              to="/auth/signup"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Signup
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">What you can do</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>Students can browse eligible jobs and apply</li>
            <li>Companies can post jobs and manage applicants</li>
            <li>Admin approves students, companies, and job postings</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

