import React from 'react'

export default function Table({ children, className = '' }) {
  return (
    <div className={className}>
      <div className="overflow-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          {children}
        </table>
      </div>
    </div>
  )
}

