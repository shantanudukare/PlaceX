import React from 'react'

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-12 text-slate-800">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Unauthorized</h1>
          <p className="mt-3 text-slate-600">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    </div>
  )
}

