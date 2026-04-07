import React from 'react'

const styles = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  info: 'bg-slate-100 text-slate-700 border-slate-200',
}

export default function Badge({
  children,
  variant = 'neutral',
  className = '',
}) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        styles[variant] || styles.neutral,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}

