// src/pages/Register.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Mail, Lock, User, ArrowRight, Eye, EyeOff, Check } from 'lucide-react'

const PASSWORD_CHECKS = [
  { label: 'At least 8 characters', test: p => p.length >= 8 },
  { label: 'One uppercase letter',  test: p => /[A-Z]/.test(p) },
  { label: 'One number',            test: p => /[0-9]/.test(p) },
]

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) return setError('Please fill in all fields')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true); setError('')

    const res = await register(name, email, password)
    setLoading(false)

    if (res.success) {
      setSuccess('Account created! Redirecting to sign in…')
      setTimeout(() => navigate('/login'), 1500)
    } else {
      setError(res.message || 'Registration failed')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* BG blobs */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center" style={{ marginBottom: 36, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={22} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.03em' }}>FlowMind</span>
        </div>

        <div className="glass-card" style={{ padding: 36, borderColor: 'var(--border-bright)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>Start your productivity journey today</p>

          {error && (
            <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--accent-rose)', marginBottom: 20 }}>{error}</div>
          )}
          {success && (
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--accent-emerald)', marginBottom: 20 }}>{success}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Name */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Arjun Sharma" style={{ paddingLeft: 36 }} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ paddingLeft: 36 }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input type={showPass ? 'text' : 'password'} className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a strong password" style={{ paddingLeft: 36, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {password && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {PASSWORD_CHECKS.map(c => (
                    <div key={c.label} className="flex items-center gap-2">
                      <div style={{ width: 14, height: 14, borderRadius: '50%', background: c.test(password) ? 'var(--accent-emerald)' : 'var(--border-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', flexShrink: 0 }}>
                        {c.test(password) && <Check size={8} color="var(--bg-primary)" />}
                      </div>
                      <span style={{ fontSize: 11, color: c.test(password) ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 8, height: 44, justifyContent: 'center', fontSize: 15 }} disabled={loading || !name || !email || !password}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: 'rgba(0,0,0,0.8)', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite', display: 'inline-block' }} />
                  Creating account…
                </span>
              ) : (
                <><span>Create account</span> <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            By signing up you agree to our <a href="#" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>Terms</a> and <a href="#" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>Privacy Policy</a>
          </p>
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}