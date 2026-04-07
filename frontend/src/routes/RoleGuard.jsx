import React from 'react'
import ProtectedRoute from './ProtectedRoute.jsx'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Spinner from '../components/ui/Spinner.jsx'

export default function RoleGuard({ allowedRoles = [], children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={24} />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <ProtectedRoute>{children}</ProtectedRoute>
}

