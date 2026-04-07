import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Landing from '../pages/common/Landing.jsx'
import Login from '../pages/common/Login.jsx'
import Signup from '../pages/common/Signup.jsx'
import Unauthorized from '../pages/common/Unauthorized.jsx'
import NotFound from '../pages/common/NotFound.jsx'

import PublicLayout from '../layouts/PublicLayout.jsx'
import StudentLayout from '../layouts/StudentLayout.jsx'
import CompanyLayout from '../layouts/CompanyLayout.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'

// Student placeholders (will be implemented with real UI + API integration)
import StudentDashboard from '../pages/student/Dashboard.jsx'
import StudentMyProfile from '../pages/student/MyProfile.jsx'
import StudentEditProfile from '../pages/student/EditProfile.jsx'
import StudentJobs from '../pages/student/Jobs.jsx'
import StudentJobDetails from '../pages/student/JobDetails.jsx'
import StudentApplications from '../pages/student/Applications.jsx'
import StudentNotifications from '../pages/student/Notifications.jsx'

// Company placeholders
import CompanyDashboard from '../pages/company/Dashboard.jsx'
import CompanyMyProfile from '../pages/company/MyProfile.jsx'
import CompanyEditProfile from '../pages/company/EditProfile.jsx'
import CompanyPostJob from '../pages/company/Postjob.jsx'
import CompanyManageJobs from '../pages/company/ManageJobs.jsx'
import CompanyApplicants from '../pages/company/Applicants.jsx'
import CompanyNotifications from '../pages/company/Notifications.jsx'

// Admin placeholders
import AdminDashboard from '../pages/admin/Dashboard.jsx'
import AdminStudents from '../pages/admin/Students.jsx'
import AdminCompanies from '../pages/admin/Companies.jsx'
import AdminJobs from '../pages/admin/Jobs.jsx'
import AdminPlacementSummary from '../pages/admin/Reports.jsx'
import AdminEligibility from '../pages/admin/Eligibility.jsx'
import AdminNotifications from '../pages/admin/Notifications.jsx'

import RoleGuard from './RoleGuard.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <Landing />
          </PublicLayout>
        }
      />

      <Route
        path="/auth/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <PublicLayout>
            <Signup />
          </PublicLayout>
        }
      />

      <Route
        path="/unauthorized"
        element={
          <PublicLayout>
            <Unauthorized />
          </PublicLayout>
        }
      />

      {/* Student */}
      <Route
        path="/student/dashboard"
        element={
          <RoleGuard allowedRoles="student">
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/student/profile"
        element={
          <RoleGuard allowedRoles="student">
            <StudentLayout>
              <StudentMyProfile />
            </StudentLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/student/profile/edit"
        element={
          <RoleGuard allowedRoles="student">
            <StudentLayout>
              <StudentEditProfile />
            </StudentLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/student/jobs"
        element={
          <RoleGuard allowedRoles="student">
            <StudentLayout>
              <StudentJobs />
            </StudentLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/student/jobs/:id"
        element={
          <RoleGuard allowedRoles="student">
            <StudentLayout>
              <StudentJobDetails />
            </StudentLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/student/applications"
        element={
          <RoleGuard allowedRoles="student">
            <StudentLayout>
              <StudentApplications />
            </StudentLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/student/notifications"
        element={
          <RoleGuard allowedRoles="student">
            <StudentLayout>
              <StudentNotifications />
            </StudentLayout>
          </RoleGuard>
        }
      />

      {/* Company */}
      <Route
        path="/company/dashboard"
        element={
          <RoleGuard allowedRoles="company">
            <CompanyLayout>
              <CompanyDashboard />
            </CompanyLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/company/profile"
        element={
          <RoleGuard allowedRoles="company">
            <CompanyLayout>
              <CompanyMyProfile />
            </CompanyLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/company/profile/edit"
        element={
          <RoleGuard allowedRoles="company">
            <CompanyLayout>
              <CompanyEditProfile />
            </CompanyLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/company/jobs"
        element={
          <RoleGuard allowedRoles="company">
            <CompanyLayout>
              <CompanyManageJobs />
            </CompanyLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/company/jobs/new"
        element={
          <RoleGuard allowedRoles="company">
            <CompanyLayout>
              <CompanyPostJob />
            </CompanyLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/company/jobs/:jobId/applicants"
        element={
          <RoleGuard allowedRoles="company">
            <CompanyLayout>
              <CompanyApplicants />
            </CompanyLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/company/jobs/:jobId"
        element={
          <RoleGuard allowedRoles="company">
            <CompanyLayout>
              <CompanyPostJob />
            </CompanyLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/company/notifications"
        element={
          <RoleGuard allowedRoles="company">
            <CompanyLayout>
              <CompanyNotifications />
            </CompanyLayout>
          </RoleGuard>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <RoleGuard allowedRoles="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/pending-students"
        element={
          <RoleGuard allowedRoles="admin">
            <AdminLayout>
              <AdminStudents />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/pending-companies"
        element={
          <RoleGuard allowedRoles="admin">
            <AdminLayout>
              <AdminCompanies />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/pending-jobs"
        element={
          <RoleGuard allowedRoles="admin">
            <AdminLayout>
              <AdminJobs />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/placement-summary"
        element={
          <RoleGuard allowedRoles="admin">
            <AdminLayout>
              <AdminPlacementSummary />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/eligibility"
        element={
          <RoleGuard allowedRoles="admin">
            <AdminLayout>
              <AdminEligibility />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <RoleGuard allowedRoles="admin">
            <AdminLayout>
              <AdminNotifications />
            </AdminLayout>
          </RoleGuard>
        }
      />

      {/* Convenience */}
      <Route path="/dashboard" element={<Navigate to="/" replace />} />

      {/* Not found */}
      <Route
        path="*"
        element={
          <PublicLayout>
            <NotFound />
          </PublicLayout>
        }
      />
    </Routes>
  )
}

