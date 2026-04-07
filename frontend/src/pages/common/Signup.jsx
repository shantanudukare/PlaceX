import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Textarea from '../../components/ui/Textarea.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

function parseCommaList(text) {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function Signup() {
  const navigate = useNavigate()
  const { signupStudent, signupCompany, loading } = useAuth()
  const toast = useToast()

  const [accountType, setAccountType] = useState('student') // 'student' | 'company'
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Student fields
  const [sFullName, setSFullName] = useState('')
  const [sEmail, setSEmail] = useState('')
  const [sPassword, setSPassword] = useState('')
  const [sBranch, setSBranch] = useState('')
  const [sCgpa, setSCgpa] = useState('')
  const [sPhone, setSPhone] = useState('')
  const [sSkills, setSSkills] = useState('')
  const [projects, setProjects] = useState([
    {
      title: '',
      description: '',
      techStack: '',
      githubLink: '',
      liveLink: '',
    },
  ])

  // Company fields
  const [cFullName, setCFullName] = useState('')
  const [cEmail, setCEmail] = useState('')
  const [cPassword, setCPassword] = useState('')
  const [cCompanyName, setCCompanyName] = useState('')
  const [cWebsite, setCWebsite] = useState('')
  const [cDescription, setCDescription] = useState('')
  const [cIndustry, setCIndustry] = useState('')
  const [cLocation, setCLocation] = useState('')
  const [cHrName, setCHrName] = useState('')
  const [cHrEmail, setCHrEmail] = useState('')
  const [cHrPhone, setCHrPhone] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    if (accountType === 'student') {
      if (!sFullName.trim() || !sEmail.trim() || !sPassword) {
        setError('Full name, email, and password are required')
        return
      }
      if (!sBranch.trim() || sCgpa === '') {
        setError('Branch and CGPA are required')
        return
      }

      const cgpaNum = Number(sCgpa)
      if (Number.isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        setError('CGPA must be a number between 0 and 10')
        return
      }

      const payload = {
        fullName: sFullName.trim(),
        email: sEmail.trim(),
        password: sPassword,
        branch: sBranch.trim(),
        cgpa: cgpaNum,
        phone: sPhone.trim() || undefined,
        skills: sSkills.trim() ? parseCommaList(sSkills) : [],
        projects: projects
          .map((p) => ({
            title: p.title.trim(),
            description: p.description.trim(),
            techStack: p.techStack.trim()
              ? parseCommaList(p.techStack)
              : [],
            githubLink: p.githubLink.trim(),
            liveLink: p.liveLink.trim(),
          }))
          .filter((p) => p.title || p.description || p.githubLink || p.liveLink),
      }

      setSubmitting(true)
      try {
        const res = await signupStudent(payload)
        toast.pushToast({
          type: 'success',
          message: 'Student account created successfully',
        })
        const role = res?.user?.role || 'student'
        navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard', { replace: true })
      } catch (err) {
        setError(err?.message || 'Signup failed')
        toast.pushToast({ type: 'error', message: err?.message || 'Signup failed' })
      } finally {
        setSubmitting(false)
      }
      return
    }

    // company
    if (!cFullName.trim() || !cEmail.trim() || !cPassword || !cCompanyName.trim()) {
      setError('Full name, email, password, and company name are required')
      return
    }

    const payload = {
      fullName: cFullName.trim(),
      email: cEmail.trim(),
      password: cPassword,
      companyName: cCompanyName.trim(),
      website: cWebsite.trim() || undefined,
      description: cDescription.trim() || undefined,
      industry: cIndustry.trim() || undefined,
      location: cLocation.trim() || undefined,
      hrName: cHrName.trim() || undefined,
      hrEmail: cHrEmail.trim() || undefined,
      hrPhone: cHrPhone.trim() || undefined,
    }

    setSubmitting(true)
    try {
      const res = await signupCompany(payload)
      toast.pushToast({
        type: 'success',
        message: 'Company account created successfully',
      })
      navigate('/company/dashboard', { replace: true })
    } catch (err) {
      setError(err?.message || 'Signup failed')
      toast.pushToast({ type: 'error', message: err?.message || 'Signup failed' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Signup
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Create your {accountType === 'student' ? 'student' : 'company'} account.
            </p>
          </div>
          {loading ? <Spinner /> : null}
        </div>

        <div className="mt-5 flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setAccountType('student')}
            className={[
              'flex-1 rounded-lg px-3 py-2 text-sm font-medium',
              accountType === 'student'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900',
            ].join(' ')}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setAccountType('company')}
            className={[
              'flex-1 rounded-lg px-3 py-2 text-sm font-medium',
              accountType === 'company'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900',
            ].join(' ')}
          >
            Company
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {/* Student */}
          {accountType === 'student' ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Full name"
                  id="sFullName"
                  value={sFullName}
                  onChange={(e) => setSFullName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
                <Input
                  label="Email"
                  id="sEmail"
                  type="email"
                  value={sEmail}
                  onChange={(e) => setSEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Password"
                  id="sPassword"
                  type="password"
                  value={sPassword}
                  onChange={(e) => setSPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  required
                />
                <Input
                  label="Phone (optional)"
                  id="sPhone"
                  value={sPhone}
                  onChange={(e) => setSPhone(e.target.value)}
                  placeholder="Phone number"
                  autoComplete="tel"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Branch"
                  id="sBranch"
                  value={sBranch}
                  onChange={(e) => setSBranch(e.target.value)}
                  placeholder="e.g. Computer Science"
                  required
                />
                <Input
                  label="CGPA"
                  id="sCgpa"
                  value={sCgpa}
                  onChange={(e) => setSCgpa(e.target.value)}
                  placeholder="0 - 10"
                  required
                />
              </div>

              <Input
                label="Skills (comma-separated, optional)"
                id="sSkills"
                value={sSkills}
                onChange={(e) => setSSkills(e.target.value)}
                placeholder="React, Node, MongoDB"
              />

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-900">
                    Projects (optional)
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setProjects((prev) => [
                        ...prev,
                        {
                          title: '',
                          description: '',
                          techStack: '',
                          githubLink: '',
                          liveLink: '',
                        },
                      ])
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Add Project
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {projects.map((p, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm font-semibold text-slate-900">
                          Project #{idx + 1}
                        </div>
                        {projects.length > 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setProjects((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="rounded-lg px-2 py-1 text-sm text-rose-700 hover:bg-rose-50"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-3 grid gap-4 md:grid-cols-2">
                        <Input
                          label="Title"
                          id={`proj-title-${idx}`}
                          value={p.title}
                          onChange={(e) => {
                            const v = e.target.value
                            setProjects((prev) =>
                              prev.map((x, i) =>
                                i === idx ? { ...x, title: v } : x
                              )
                            )
                          }}
                          placeholder="Project title"
                        />
                        <Input
                          label="Tech Stack (comma)"
                          id={`proj-tech-${idx}`}
                          value={p.techStack}
                          onChange={(e) => {
                            const v = e.target.value
                            setProjects((prev) =>
                              prev.map((x, i) =>
                                i === idx ? { ...x, techStack: v } : x
                              )
                            )
                          }}
                          placeholder="React, Express"
                        />
                      </div>

                      <Textarea
                        label="Description"
                        id={`proj-desc-${idx}`}
                        value={p.description}
                        onChange={(e) => {
                          const v = e.target.value
                          setProjects((prev) =>
                            prev.map((x, i) =>
                              i === idx
                                ? { ...x, description: v }
                                : x
                            )
                          )
                        }}
                        placeholder="What did you build?"
                      />

                      <div className="mt-2 grid gap-4 md:grid-cols-2">
                        <Input
                          label="GitHub link (optional)"
                          id={`proj-github-${idx}`}
                          value={p.githubLink}
                          onChange={(e) => {
                            const v = e.target.value
                            setProjects((prev) =>
                              prev.map((x, i) =>
                                i === idx ? { ...x, githubLink: v } : x
                              )
                            )
                          }}
                          placeholder="https://github.com/... "
                        />
                        <Input
                          label="Live link (optional)"
                          id={`proj-live-${idx}`}
                          value={p.liveLink}
                          onChange={(e) => {
                            const v = e.target.value
                            setProjects((prev) =>
                              prev.map((x, i) =>
                                i === idx ? { ...x, liveLink: v } : x
                              )
                            )
                          }}
                          placeholder="https://yourapp.com"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Company
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Full name"
                  id="cFullName"
                  value={cFullName}
                  onChange={(e) => setCFullName(e.target.value)}
                  placeholder="Authorized person name"
                  autoComplete="name"
                  required
                />
                <Input
                  label="Email"
                  id="cEmail"
                  type="email"
                  value={cEmail}
                  onChange={(e) => setCEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Password"
                  id="cPassword"
                  type="password"
                  value={cPassword}
                  onChange={(e) => setCPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  required
                />
                <Input
                  label="Company name"
                  id="cCompanyName"
                  value={cCompanyName}
                  onChange={(e) => setCCompanyName(e.target.value)}
                  placeholder="e.g. Google"
                  required
                />
              </div>

              <Input
                label="Website (optional)"
                id="cWebsite"
                value={cWebsite}
                onChange={(e) => setCWebsite(e.target.value)}
                placeholder="https://company.com"
              />

              <Textarea
                label="Description (optional)"
                id="cDescription"
                value={cDescription}
                onChange={(e) => setCDescription(e.target.value)}
                placeholder="Short overview"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Industry (optional)"
                  id="cIndustry"
                  value={cIndustry}
                  onChange={(e) => setCIndustry(e.target.value)}
                  placeholder="IT Services"
                />
                <Input
                  label="Location (optional)"
                  id="cLocation"
                  value={cLocation}
                  onChange={(e) => setCLocation(e.target.value)}
                  placeholder="City, Country"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="HR Name (optional)"
                  id="cHrName"
                  value={cHrName}
                  onChange={(e) => setCHrName(e.target.value)}
                />
                <Input
                  label="HR Email (optional)"
                  id="cHrEmail"
                  type="email"
                  value={cHrEmail}
                  onChange={(e) => setCHrEmail(e.target.value)}
                />
              </div>

              <Input
                label="HR Phone (optional)"
                id="cHrPhone"
                value={cHrPhone}
                onChange={(e) => setCHrPhone(e.target.value)}
                placeholder="Phone number"
                autoComplete="tel"
              />
            </>
          )}

          {error ? <div className="text-sm text-rose-600">{error}</div> : null}

          <Button
            type="submit"
            loading={submitting}
            disabled={submitting}
            className="w-full"
          >
            Create Account
          </Button>

          <div className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-slate-900 underline"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

