import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, GraduationCap, ShieldCheck } from 'lucide-react'

import Button from '../../components/ui/Button.jsx'
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
      const payload = await login({
        email: email.trim(),
        password,
      })

      const role = payload?.user?.role

      toast.pushToast({
        type: 'success',
        message: 'Login successful',
      })

      if (role === 'student')
        navigate('/student/dashboard', { replace: true })
      else if (role === 'company')
        navigate('/company/dashboard', { replace: true })
      else if (role === 'admin')
        navigate('/admin/dashboard', { replace: true })
      else navigate('/', { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed')

      toast.pushToast({
        type: 'error',
        message: err?.message || 'Login failed',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        
        {/* Left Section */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 lg:flex items-center justify-center p-14">
          
          {/* Background Blur */}
          <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

          {/* Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:32px_32px]" />
          </div>

          <div className="relative z-10 max-w-xl text-white">
            
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-md border border-white/20">
                <GraduationCap size={34} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-wide">
                  Placement Portal
                </h1>
                <p className="text-sm text-slate-300">
                  Official Placement & Career Platform
                </p>
              </div>
            </div>

            <h2 className="text-5xl font-bold leading-tight">
              Shape Your
              <br />
              Future Career.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Connect with recruiters, apply for opportunities,
              manage your academic profile and stay updated with
              placement activities from one centralized portal.
            </p>

            {/* Feature Cards */}
            <div className="mt-14 grid grid-cols-2 gap-5">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                <h3 className="text-3xl font-bold">150+</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Hiring Companies
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                <h3 className="text-3xl font-bold">24/7</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Secure Access
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center bg-slate-100 px-6 py-10">
          <div className="w-full max-w-md">
            
            {/* Mobile Header */}
            <div className="mb-8 flex items-center gap-4 lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
                <GraduationCap size={28} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Student Portal
                </h1>
                <p className="text-sm text-slate-500">
                  Official Login
                </p>
              </div>
            </div>

            {/* Login Card */}
            <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/40">
              
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
                    <ShieldCheck size={16} />
                    Secure Login
                  </div>

                  <h2 className="text-4xl font-bold text-slate-900">
                    Welcome Back
                  </h2>

                  <p className="mt-2 text-slate-500">
                    Sign in to continue to your dashboard
                  </p>
                </div>

                {loading ? <Spinner /> : null}
              </div>

              <form
                className="mt-10 space-y-6"
                onSubmit={onSubmit}
              >
                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-md">
                    <Mail size={20} className="text-slate-500" />

                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-md">
                    <Lock size={20} className="text-slate-500" />

                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  loading={submitting}
                  disabled={submitting}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-base font-semibold text-white shadow-lg transition-all hover:scale-[1.01] hover:from-blue-700 hover:to-cyan-600"
                >
                  Login
                </Button>

                <div className="text-center text-sm text-slate-500">
                  New here?{' '}
                  <Link
                    to="/auth/signup"
                    className="font-semibold text-blue-700 hover:underline"
                  >
                    Create an account
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}