import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Building2,
  Plus,
} from 'lucide-react'

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

  const [accountType, setAccountType] = useState('student')
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
          .filter(
            (p) =>
              p.title ||
              p.description ||
              p.githubLink ||
              p.liveLink
          ),
      }

      setSubmitting(true)

      try {
        const res = await signupStudent(payload)

        toast.pushToast({
          type: 'success',
          message: 'Student account created successfully',
        })

        const role = res?.user?.role || 'student'

        navigate(
          role === 'admin'
            ? '/admin/dashboard'
            : '/student/dashboard',
          { replace: true }
        )
      } catch (err) {
        setError(err?.message || 'Signup failed')

        toast.pushToast({
          type: 'error',
          message: err?.message || 'Signup failed',
        })
      } finally {
        setSubmitting(false)
      }

      return
    }

    // company

    if (
      !cFullName.trim() ||
      !cEmail.trim() ||
      !cPassword ||
      !cCompanyName.trim()
    ) {
      setError(
        'Full name, email, password, and company name are required'
      )
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
      await signupCompany(payload)

      toast.pushToast({
        type: 'success',
        message: 'Company account created successfully',
      })

      navigate('/company/dashboard', {
        replace: true,
      })
    } catch (err) {
      setError(err?.message || 'Signup failed')

      toast.pushToast({
        type: 'error',
        message: err?.message || 'Signup failed',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[430px_1fr]">
        
        
       {/* LEFT SIDE */}
<div className="relative hidden lg:block">
  <div className="sticky top-0 flex h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-10 text-white">
    
    <div className="absolute -top-16 -left-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
    <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

    <div className="relative z-10 flex h-full flex-col justify-between">
      
      <div>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur">
            <GraduationCap size={32} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Student Portal
            </h1>

            <p className="text-sm text-slate-300">
              Placement & Career Platform
            </p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-5xl font-bold leading-tight">
            Build Your
            <br />
            Career Journey.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Register yourself to connect with recruiters,
            explore opportunities and manage your academic profile.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
          <h3 className="text-3xl font-bold">500+</h3>
          <p className="mt-2 text-sm text-slate-300">
            Students
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
          <h3 className="text-3xl font-bold">150+</h3>
          <p className="mt-2 text-sm text-slate-300">
            Companies
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-5xl rounded-[36px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/40 lg:p-10">

            {/* HEADER */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
                  Secure Registration
                </div>

                <h1 className="mt-4 text-4xl font-bold text-slate-900">
                  Create Account
                </h1>

                <p className="mt-2 text-slate-500">
                  Register as student or company
                </p>
              </div>

              {loading ? <Spinner /> : null}
            </div>

            {/* TOGGLE */}
            <div className="mt-8 flex rounded-2xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setAccountType('student')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  accountType === 'student'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-600'
                }`}
              >
                <GraduationCap size={18} />
                Student
              </button>

              <button
                type="button"
                onClick={() => setAccountType('company')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  accountType === 'company'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-600'
                }`}
              >
                <Building2 size={18} />
                Company
              </button>
            </div>

            {/* FORM */}
            <form
              className="mt-8 space-y-6"
              onSubmit={onSubmit}
            >
              {accountType === 'student' ? (
                <>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Full Name"
                      id="sFullName"
                      value={sFullName}
                      onChange={(e) =>
                        setSFullName(e.target.value)
                      }
                      placeholder="Your name"
                      required
                    />

                    <Input
                      label="Email"
                      id="sEmail"
                      type="email"
                      value={sEmail}
                      onChange={(e) =>
                        setSEmail(e.target.value)
                      }
                      placeholder="name@example.com"
                      required
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Password"
                      id="sPassword"
                      type="password"
                      value={sPassword}
                      onChange={(e) =>
                        setSPassword(e.target.value)
                      }
                      placeholder="Minimum 6 characters"
                      required
                    />

                    <Input
                      label="Phone"
                      id="sPhone"
                      value={sPhone}
                      onChange={(e) =>
                        setSPhone(e.target.value)
                      }
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Branch"
                      id="sBranch"
                      value={sBranch}
                      onChange={(e) =>
                        setSBranch(e.target.value)
                      }
                      placeholder="Computer Science"
                      required
                    />

                    <Input
                      label="CGPA"
                      id="sCgpa"
                      value={sCgpa}
                      onChange={(e) =>
                        setSCgpa(e.target.value)
                      }
                      placeholder="0 - 10"
                      required
                    />
                  </div>

                  <Input
                    label="Skills"
                    id="sSkills"
                    value={sSkills}
                    onChange={(e) =>
                      setSSkills(e.target.value)
                    }
                    placeholder="React, Node.js, MongoDB"
                  />

                  {/* PROJECTS */}
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Projects
                      </h3>

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
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white"
                      >
                        <Plus size={16} />
                        Add Project
                      </button>
                    </div>

                    <div className="mt-5 space-y-5">
                      {projects.map((p, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-slate-200 bg-white p-5"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-900">
                              Project #{idx + 1}
                            </h4>

                            {projects.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setProjects((prev) =>
                                    prev.filter(
                                      (_, i) => i !== idx
                                    )
                                  )
                                }
                                className="text-sm font-medium text-red-500"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="mt-4 grid gap-5 md:grid-cols-2">
                            <Input
                              label="Title"
                              id={`proj-title-${idx}`}
                              value={p.title}
                              onChange={(e) => {
                                const v = e.target.value
                                setProjects((prev) =>
                                  prev.map((x, i) =>
                                    i === idx
                                      ? { ...x, title: v }
                                      : x
                                  )
                                )
                              }}
                              placeholder="Project title"
                            />

                            <Input
                              label="Tech Stack"
                              id={`proj-tech-${idx}`}
                              value={p.techStack}
                              onChange={(e) => {
                                const v = e.target.value
                                setProjects((prev) =>
                                  prev.map((x, i) =>
                                    i === idx
                                      ? {
                                          ...x,
                                          techStack: v,
                                        }
                                      : x
                                  )
                                )
                              }}
                              placeholder="React, Express"
                            />
                          </div>

                          <div className="mt-5">
                            <Textarea
                              label="Description"
                              id={`proj-desc-${idx}`}
                              value={p.description}
                              onChange={(e) => {
                                const v = e.target.value
                                setProjects((prev) =>
                                  prev.map((x, i) =>
                                    i === idx
                                      ? {
                                          ...x,
                                          description: v,
                                        }
                                      : x
                                  )
                                )
                              }}
                              placeholder="Describe your project"
                            />
                          </div>

                          <div className="mt-5 grid gap-5 md:grid-cols-2">
                            <Input
                              label="GitHub Link"
                              id={`proj-github-${idx}`}
                              value={p.githubLink}
                              onChange={(e) => {
                                const v = e.target.value
                                setProjects((prev) =>
                                  prev.map((x, i) =>
                                    i === idx
                                      ? {
                                          ...x,
                                          githubLink: v,
                                        }
                                      : x
                                  )
                                )
                              }}
                              placeholder="https://github.com/"
                            />

                            <Input
                              label="Live Link"
                              id={`proj-live-${idx}`}
                              value={p.liveLink}
                              onChange={(e) => {
                                const v = e.target.value
                                setProjects((prev) =>
                                  prev.map((x, i) =>
                                    i === idx
                                      ? {
                                          ...x,
                                          liveLink: v,
                                        }
                                      : x
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
                <>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Full Name"
                      id="cFullName"
                      value={cFullName}
                      onChange={(e) =>
                        setCFullName(e.target.value)
                      }
                      placeholder="Authorized person"
                      required
                    />

                    <Input
                      label="Email"
                      id="cEmail"
                      type="email"
                      value={cEmail}
                      onChange={(e) =>
                        setCEmail(e.target.value)
                      }
                      placeholder="name@example.com"
                      required
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Password"
                      id="cPassword"
                      type="password"
                      value={cPassword}
                      onChange={(e) =>
                        setCPassword(e.target.value)
                      }
                      placeholder="Minimum 6 characters"
                      required
                    />

                    <Input
                      label="Company Name"
                      id="cCompanyName"
                      value={cCompanyName}
                      onChange={(e) =>
                        setCCompanyName(e.target.value)
                      }
                      placeholder="Google"
                      required
                    />
                  </div>

                  <Input
                    label="Website"
                    id="cWebsite"
                    value={cWebsite}
                    onChange={(e) =>
                      setCWebsite(e.target.value)
                    }
                    placeholder="https://company.com"
                  />

                  <Textarea
                    label="Description"
                    id="cDescription"
                    value={cDescription}
                    onChange={(e) =>
                      setCDescription(e.target.value)
                    }
                    placeholder="Company overview"
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Industry"
                      id="cIndustry"
                      value={cIndustry}
                      onChange={(e) =>
                        setCIndustry(e.target.value)
                      }
                      placeholder="IT Services"
                    />

                    <Input
                      label="Location"
                      id="cLocation"
                      value={cLocation}
                      onChange={(e) =>
                        setCLocation(e.target.value)
                      }
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="HR Name"
                      id="cHrName"
                      value={cHrName}
                      onChange={(e) =>
                        setCHrName(e.target.value)
                      }
                    />

                    <Input
                      label="HR Email"
                      id="cHrEmail"
                      type="email"
                      value={cHrEmail}
                      onChange={(e) =>
                        setCHrEmail(e.target.value)
                      }
                    />
                  </div>

                  <Input
                    label="HR Phone"
                    id="cHrPhone"
                    value={cHrPhone}
                    onChange={(e) =>
                      setCHrPhone(e.target.value)
                    }
                    placeholder="Phone number"
                  />
                </>
              )}

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              ) : null}

              <Button
                type="submit"
                loading={submitting}
                disabled={submitting}
                className="h-14 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-base font-semibold text-white shadow-lg hover:from-blue-700 hover:to-cyan-600"
              >
                Create Account
              </Button>

              <div className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="font-semibold text-blue-700 hover:underline"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}