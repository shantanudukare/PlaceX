import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Page not found</h1>
          <p className="mt-3 text-slate-600">
            The page you are looking for does not exist.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

