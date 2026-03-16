import { useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, CheckSquare, Users, Calendar, Shield, Star, ChevronRight, Play } from 'lucide-react'
import { useState, useEffect } from 'react'

const FEATURES = [
  {
    icon: CheckSquare,
    color: 'var(--accent-cyan)',
    title: 'Smart Task Engine',
    desc: 'Priority-based task management with deadlines, labels, and intelligent progress tracking.'
  },
  {
    icon: Calendar,
    color: 'var(--accent-violet)',
    title: 'Visual Schedule Builder',
    desc: 'Drag-and-drop calendar with time blocks, recurring events, and deadline alerts.'
  },
  {
    icon: Users,
    color: 'var(--accent-emerald)',
    title: 'Live Focus Rooms',
    desc: 'Join co-working rooms with real-time video, audio, chat and ambient soundscapes.'
  },
  {
    icon: Shield,
    color: 'var(--accent-amber)',
    title: 'Deep Work Analytics',
    desc: 'Track streaks, focus hours, and productivity patterns to optimize your workflow.'
  },
]

const STATS = [
  { value: '50K+', label: 'Active Users' },
  { value: '2.4M', label: 'Tasks Completed' },
  { value: '98K', label: 'Focus Hours' },
  { value: '4.9★', label: 'User Rating' },
]

const TESTIMONIALS = [
  { name: 'Priya K.', role: 'Software Engineer', text: 'FlowMind transformed how I manage deep work. The Focus Rooms alone are worth it.', initials: 'PK', color: '#00E5FF' },
  { name: 'Marcus L.', role: 'Grad Student', text: 'I went from chaotic to organised in one week. The schedule builder is brilliant.', initials: 'ML', color: '#7C3AED' },
  { name: 'Zara A.', role: 'Product Designer', text: 'Love the ambient rooms. Feels like working in a co-working space from home.', initials: 'ZA', color: '#10B981' },
]

export default function Landing() {
  const navigate = useNavigate()
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)

  useEffect(() => {
    const handler = (e) => {
      setMouseX(e.clientX / window.innerWidth)
      setMouseY(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          width: 800, height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
          left: `${10 + mouseX * 10}%`,
          top: `${-20 + mouseY * 10}%`,
          transition: 'left 2s ease, top 2s ease'
        }} />
        <div style={{
          position: 'absolute',
          width: 700, height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          right: `${5 + (1 - mouseX) * 10}%`,
          top: `${30 + mouseY * 5}%`,
          transition: 'right 2s ease, top 2s ease'
        }} />
        <div style={{
          position: 'absolute',
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
          left: '20%', bottom: '10%'
        }} />
        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        padding: '16px 48px',
        display: 'flex', alignItems: 'center',
        background: 'rgba(8,11,20,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        zIndex: 100
      }}>
        <div className="flex items-center gap-2">
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em' }}>FlowMind</span>
        </div>

        <div className="flex items-center gap-6" style={{ marginLeft: 48 }}>
          {['Features', 'How it works', 'Pricing', 'Blog'].map(item => (
            <a key={item} href="#" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
            >{item}</a>
          ))}
        </div>

        <div className="flex items-center gap-3" style={{ marginLeft: 'auto' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Sign in</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>
            Get started free <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 1,
        paddingTop: 160, paddingBottom: 120,
        textAlign: 'center',
        maxWidth: 900, margin: '0 auto',
        padding: '160px 24px 120px'
      }}>
        <div className="badge badge-cyan animate-fadeUp" style={{ marginBottom: 24, display: 'inline-flex' }}>
          <Zap size={10} /> Now in public beta — join free
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(48px, 7vw, 88px)',
          fontWeight: 800,
          lineHeight: 1.0,
          letterSpacing: '-0.04em',
          marginBottom: 24,
          animation: 'fadeUp 0.6s 0.1s both'
        }}>
          Focus deeper.<br />
          <span className="gradient-text">Ship faster.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: 'var(--text-secondary)',
          maxWidth: 560,
          margin: '0 auto 40px',
          lineHeight: 1.7,
          animation: 'fadeUp 0.6s 0.2s both'
        }}>
          FlowMind is the all-in-one productivity platform where deep work meets real-time collaboration. Manage tasks, schedule your day, and focus alongside others — live.
        </p>

        <div className="flex items-center justify-center gap-3" style={{ animation: 'fadeUp 0.6s 0.3s both', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/register')}
            style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}
          >
            Start for free <ArrowRight size={16} />
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate('/login')}>
            <Play size={14} fill="currentColor" /> Watch demo
          </button>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16, animation: 'fadeUp 0.6s 0.4s both' }}>
          No credit card required · Free forever plan available
        </div>

        {/* Mockup preview */}
        <div style={{
          marginTop: 72,
          position: 'relative',
          animation: 'float 6s ease-in-out infinite',
        }}>
          <div style={{
            background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
            border: '1px solid var(--border-bright)',
            borderRadius: 24,
            padding: '0 0 0',
            overflow: 'hidden',
            boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 60px rgba(0,229,255,0.08), 0 0 120px rgba(124,58,237,0.05)',
          }}>
            {/* Fake browser bar */}
            <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#F43F5E','#F59E0B','#10B981'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />)}
              </div>
              <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 6, padding: '4px 12px', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                app.flowmind.io/dashboard
              </div>
            </div>
            {/* Dashboard preview */}
            <DashboardPreview />
          </div>
          {/* Glow reflection */}
          <div style={{
            position: 'absolute', bottom: -40, left: '10%', right: '10%', height: 40,
            background: 'radial-gradient(ellipse, rgba(0,229,255,0.2) 0%, transparent 70%)',
            filter: 'blur(20px)'
          }} />
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 48px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, textAlign: 'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em' }} className="gradient-text">{s.value}</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge badge-violet" style={{ marginBottom: 16, display: 'inline-flex' }}>Features</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em' }}>
            Everything you need to <span className="gradient-text">do your best work</span>
          </h2>
        </div>
        <div className="cards-grid-2" style={{ gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="glass-card" style={{
              padding: 28, cursor: 'pointer', transition: 'all 0.3s ease',
              borderColor: 'var(--border)'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.3)` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}18`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <f.icon size={22} color={f.color} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.desc}</p>
              <div className="flex items-center gap-1" style={{ marginTop: 16, color: f.color, fontSize: 13, fontWeight: 600 }}>
                Learn more <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 48px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em' }}>Loved by focused people</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="stat-card">
                <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="var(--accent-amber)" color="var(--accent-amber)" />)}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="avatar avatar-sm" style={{ background: `${t.color}22`, color: t.color, border: `1px solid ${t.color}40` }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '120px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 16 }}>
            Ready to enter <span className="gradient-text">flow state?</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Join thousands of focused individuals and teams using FlowMind to do their best work.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
            Create your free account <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '28px 48px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-2">
          <Zap size={14} color="var(--accent-cyan)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>FlowMind</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>© 2025 All rights reserved.</span>
        </div>
        <div className="flex gap-6">
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}

// Mini dashboard preview widget
function DashboardPreview() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', height: 360, background: 'var(--bg-primary)' }}>
      {/* Mini sidebar */}
      <div style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', padding: '12px 0' }}>
        {[
          { icon: '⊞', label: 'Dashboard', active: true },
          { icon: '✓', label: 'Tasks', active: false },
          { icon: '📅', label: 'Schedule', active: false },
          { icon: '👥', label: 'Focus Rooms', active: false },
        ].map(n => (
          <div key={n.label} style={{
            padding: '7px 12px',
            margin: '2px 6px',
            borderRadius: 6,
            fontSize: 11,
            background: n.active ? 'var(--accent-cyan-dim)' : 'transparent',
            color: n.active ? 'var(--accent-cyan)' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: 7
          }}>
            <span style={{ fontSize: 10 }}>{n.icon}</span>{n.label}
          </div>
        ))}
      </div>
      {/* Mini content */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[
            { label: 'Tasks Today', value: '8', color: 'var(--accent-cyan)' },
            { label: 'Focus Time', value: '2h 40m', color: 'var(--accent-violet)' },
            { label: 'Completed', value: '5/8', color: 'var(--accent-emerald)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-card)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-display)', fontWeight: 600 }}>TODAY'S TASKS</div>
          {[
            { text: 'Review PR #142', done: true, priority: 'high' },
            { text: 'Update API docs', done: true, priority: 'medium' },
            { text: 'Design dashboard v2', done: false, priority: 'high' },
            { text: 'Write unit tests', done: false, priority: 'low' },
          ].map(t => (
            <div key={t.text} className="flex items-center gap-2" style={{ marginBottom: 5, opacity: t.done ? 0.5 : 1 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, border: '1.5px solid', borderColor: t.done ? 'var(--accent-emerald)' : 'var(--border-bright)', background: t.done ? 'var(--accent-emerald)' : 'transparent', flexShrink: 0 }} />
              <span style={{ fontSize: 11, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--text-muted)' : 'var(--text-secondary)', flex: 1 }}>{t.text}</span>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: t.priority === 'high' ? 'var(--accent-rose)' : t.priority === 'medium' ? 'var(--accent-amber)' : 'var(--accent-emerald)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
