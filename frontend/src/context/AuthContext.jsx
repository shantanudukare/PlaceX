import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { http } from '../api/http'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bootError, setBootError] = useState(null)

  const authValue = useMemo(
    () => ({
      user,
      profile,
      loading,
      bootError,
      isAuthenticated: Boolean(user),
      role: user?.role || null,
      approvalStatus: user?.approvalStatus || null,
      login,
      signupStudent,
      signupCompany,
      logout,
      refreshMe,
      hasRole,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, profile, loading, bootError]
  )

  async function refreshMe() {
    const res = await http.get('/api/auth/me')
    const payload = res?.data?.data || {}
    setUser(payload.user || null)
    setProfile(payload.profile || null)
    return payload
  }

  async function login({ email, password }) {
    const res = await http.post('/api/auth/login', { email, password })
    const payload = res?.data?.data || {}
    setUser(payload.user || null)
    setProfile(payload.profile || null)
    return payload
  }

  async function signupStudent(payload) {
    const res = await http.post('/api/auth/signup/student', payload)
    const data = res?.data?.data || {}
    setUser(data.user || null)
    setProfile(data.studentProfile || null)
    return data
  }

  async function signupCompany(payload) {
    const res = await http.post('/api/auth/signup/company', payload)
    const data = res?.data?.data || {}
    setUser(data.user || null)
    setProfile(data.companyProfile || null)
    return data
  }

  async function logout() {
    await http.post('/api/auth/logout')
    setUser(null)
    setProfile(null)
  }

  function hasRole(allowedRole) {
    return user?.role === allowedRole
  }

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        await http.get('/api/auth/me').then((res) => {
          if (!mounted) return
          const payload = res?.data?.data || {}
          setUser(payload.user || null)
          setProfile(payload.profile || null)
        })
      } catch (err) {
        if (!mounted) return
        setBootError(err?.message || 'Failed to load session')
        setUser(null)
        setProfile(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

