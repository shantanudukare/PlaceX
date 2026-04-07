import React from 'react'

export default function CompanyProfile() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Company Profile
      </h1>
      <p className="mt-2 text-slate-600">
        Company profile view/edit will be wired to <code>/api/companies/me</code>.
      </p>
    </div>
  )
}

