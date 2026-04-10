 // pages/auth/Register.jsx

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ROLES = ["Developer", "Designer", "Web3", "AI/ML", "Game Dev", "Motion", "Other"]

const Signup = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [selectedRoles, setSelectedRoles] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match")
    }
    if (selectedRoles.length === 0) {
      return setError("Please select at least one role")
    }
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          roles: selectedRoles,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message)
        setLoading(false)
        return
      }

      login(data, data.token)
      
    } catch (err) {
      setError("Something went wrong. Try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090e] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 bg-[#7f77dd] rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span className="text-white font-medium text-lg tracking-tight">
            Stack<span className="text-[#7f77dd]">Lab</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-8">
          <h1 className="text-white text-xl font-medium mb-1">Create your account</h1>
          <p className="text-white/40 text-sm mb-6">Join the StackLab community</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/50 text-xs block mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="yourhandle"
                required
                className="w-full bg-[#0d0d14] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/70 placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
              />
            </div>

            <div>
              <label className="text-white/50 text-xs block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-[#0d0d14] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/70 placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
              />
            </div>

            <div>
              <label className="text-white/50 text-xs block mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-[#0d0d14] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/70 placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
              />
            </div>

            <div>
              <label className="text-white/50 text-xs block mb-2">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-[#0d0d14] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/70 placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="text-white/50 text-xs block mb-2">
                Your role(s) <span className="text-[#7f77dd]/70">— select all that apply</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      selectedRoles.includes(role)
                        ? "bg-[#7f77dd]/15 border-[#7f77dd]/40 text-[#afa9ec]"
                        : "bg-transparent border-white/10 text-white/40 hover:border-white/20"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7f77dd] hover:bg-[#6e66cc] text-white font-medium text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-sm mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-[#7f77dd] hover:text-[#afa9ec]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup