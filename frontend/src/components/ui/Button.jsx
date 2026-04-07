import React from 'react'
import Spinner from './Spinner.jsx'

const variants = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-700',
  secondary:
    'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 disabled:bg-slate-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-500 disabled:bg-rose-400',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  disabled = false,
  type = 'button',
  ...rest
}) {
  const isDisabled = disabled || loading
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        variants[variant] || variants.primary,
        'focus:outline-none focus:ring-2 focus:ring-slate-300',
        isDisabled ? 'cursor-not-allowed opacity-90' : '',
        className,
      ].join(' ')}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? <Spinner size={16} /> : null}
      {children}
    </button>
  )
}

