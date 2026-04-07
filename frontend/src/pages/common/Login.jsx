import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { user, loading, login } = useAuth()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const roleRedirect = useMemo(() => {
    if (!user) return '/'
    if (user.role === 'student') return '/student/dashboard'
    if (user.role === 'company') return '/company/dashboard'
    if (user.role === 'admin') return '/admin/dashboard'
    return '/'
  }, [user])

  useEffect(() => {
    if (loading) return
    if (user) navigate(roleRedirect, { replace: true })
  }, [loading, user, roleRedirect, navigate])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Email and password are required')
      return
    }

    setSubmitting(true)
    try {
      const payload = await login({ email: email.trim(), password })
      const role = payload?.user?.role
      toast.pushToast({ type: 'success', message: 'Login successful' })

      if (role === 'student') navigate('/student/dashboard', { replace: true })
      else if (role === 'company')
        navigate('/company/dashboard', { replace: true })
      else if (role === 'admin') navigate('/admin/dashboard', { replace: true })
      else navigate('/', { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed')
      toast.pushToast({ type: 'error', message: err?.message || 'Login failed' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
          {loading ? <Spinner /> : null}
        </div>

        <p className="mt-2 text-sm text-slate-600">
          Sign in using your registered email and password.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error ? <div className="text-sm text-rose-600">{error}</div> : null}

          <Button
            type="submit"
            loading={submitting}
            disabled={submitting}
            className="w-full"
          >
            Login
          </Button>

          <div className="text-center text-sm text-slate-600">
            New here?{' '}
            <Link to="/auth/signup" className="font-medium text-slate-900 underline">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

