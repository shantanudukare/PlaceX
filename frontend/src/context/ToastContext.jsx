import React, { createContext, useContext, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ToastContext = createContext(null)

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const api = useMemo(
    () => ({
      pushToast,
      removeToast,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toasts]
  )

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  function pushToast({ type = 'info', message, duration = 3500 }) {
    const id = makeId()
    setToasts((prev) => [
      ...prev,
      { id, type, message, createdAt: Date.now(), duration },
    ])

    window.setTimeout(() => removeToast(id), duration)
  }

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[360px] flex-col gap-3">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto"
            >
              <div
                className={[
                  'rounded-2xl border bg-white px-4 py-3 shadow-sm',
                  t.type === 'success' && 'border-emerald-200',
                  t.type === 'error' && 'border-rose-200',
                  t.type === 'info' && 'border-slate-200',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-medium text-slate-900">
                    {t.type === 'success'
                      ? 'Success'
                      : t.type === 'error'
                        ? 'Error'
                        : 'Info'}
                  </div>
                  <button
                    onClick={() => removeToast(t.id)}
                    className="text-xs text-slate-500 hover:text-slate-700"
                    aria-label="Close toast"
                  >
                    Close
                  </button>
                </div>
                <div className="mt-1 text-sm text-slate-700">{t.message}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

