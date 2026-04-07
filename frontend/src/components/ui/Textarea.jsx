import React from 'react'

export default function Textarea({
  label,
  id,
  hint,
  error,
  className = '',
  ...rest
}) {
  return (
    <div>
      {label ? (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-slate-900"
        >
          {label}
        </label>
      ) : null}
      <textarea
        id={id}
        className={[
          'min-h-[96px] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm',
          'focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100',
          error ? 'border-rose-300' : '',
          className,
        ].join(' ')}
        {...rest}
      />
      {error ? <div className="mt-1 text-xs text-rose-600">{error}</div> : null}
      {hint && !error ? (
        <div className="mt-1 text-xs text-slate-500">{hint}</div>
      ) : null}
    </div>
  )
}

