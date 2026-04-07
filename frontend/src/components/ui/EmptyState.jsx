import React from 'react'

export default function EmptyState({
  title = 'Nothing here',
  description = 'Try adjusting your filters or check back later.',
  action,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{description}</div>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

