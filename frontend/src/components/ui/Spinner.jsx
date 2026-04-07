import React from 'react'

export default function Spinner({ size = 18, className = '' }) {
  return (
    <span
      className={[
        'inline-block animate-spin rounded-full border-2 border-slate-200 border-t-slate-900',
        className,
      ].join(' ')}
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  )
}

