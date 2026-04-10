// pages/auth/ResetPassword.jsx

import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match")
    }
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: form.password }),
        }
      )
      const data = await res.json()
      if (!res.ok) {
        setError(data.message)
        setLoading(false)
        return
      }
      setSuccess(true)
      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      setError("Something went wrong. Try again.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#09090e] flex items-center justify-center px-4">
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

        <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-8">
          {!success ? (
            <>
              <h1 className="text-white text-xl font-medium mb-1">Set new password</h1>
              <p className="text-white/40 text-sm mb-6">Choose a strong new password</p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs block mb-2">New password</label>
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
                  <label className="text-white/50 text-xs block mb-2">Confirm new password</label>
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
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7f77dd] hover:bg-[#6e66cc] text-white font-medium text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Resetting..." : "Reset password"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-[#1d9e75]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 20 20" fill="none" width="22" height="22">
                  <path d="M4 10l4 4 8-8" stroke="#1d9e75" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 className="text-white font-medium mb-2">Password reset!</h2>
              <p className="text-white/40 text-sm">Redirecting you to sign in...</p>
            </div>
          )}
        </div>

        {!success && (
          <p className="text-center text-white/30 text-sm mt-5">
            <Link to="/login" className="text-[#7f77dd] hover:text-[#afa9ec]">
              Back to sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}

export default ResetPassword