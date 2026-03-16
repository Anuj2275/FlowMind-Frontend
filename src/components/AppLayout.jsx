import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, CheckSquare, Calendar, Users, User,
  LogOut, Zap, Settings, ChevronRight, Bell, Search,
  TrendingUp, Flame
} from 'lucide-react'

const NAV = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/schedule', icon: Calendar, label: 'Schedule' },
  { path: '/rooms', icon: Users, label: 'Focus Rooms' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <Zap size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', lineHeight: 1 }}>FlowMind</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>v1.0 · beta</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          <div style={{ padding: '6px 16px 8px', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Workspace
          </div>
          {NAV.map(({ path, icon: Icon, label }) => (
            <div
              key={path}
              className={`sidebar-nav-item ${location.pathname === path ? 'active' : ''}`}
              onClick={() => navigate(path)}
            >
              <Icon size={16} />
              <span>{label}</span>
              {location.pathname === path && <ChevronRight size={12} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
            </div>
          ))}

          <div style={{ padding: '16px 16px 8px', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 8, borderTop: '1px solid var(--border)' }}>
            Quick Stats
          </div>

          {/* Streak */}
          <div style={{ margin: '4px 8px', padding: '10px 12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 'var(--radius-sm)' }}>
            <div className="flex items-center gap-2">
              <Flame size={14} color="var(--accent-amber)" style={{ animation: 'flame 1.5s ease-in-out infinite' }} />
              <span style={{ fontSize: 12, color: 'var(--accent-amber)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                {user?.streak} day streak
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Keep it going! 🔥</div>
          </div>

          {/* Mini stats */}
          <div style={{ margin: '8px 8px', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
            <div className="flex gap-3">
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent-cyan)' }}>{user?.stats?.tasksCompleted}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Tasks</div>
              </div>
              <div style={{ width: 1, background: 'var(--border)' }} />
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent-violet)' }}>{user?.stats?.focusHours}h</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Focus</div>
              </div>
              <div style={{ width: 1, background: 'var(--border)' }} />
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent-emerald)' }}>{user?.stats?.roomsJoined}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Rooms</div>
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '12px 8px' }}>
          <div
            className="sidebar-nav-item"
            onClick={() => navigate('/profile')}
            style={{ marginBottom: 4 }}
          >
            <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))' }}>
              {user?.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>View profile</div>
            </div>
          </div>
          <div className="sidebar-nav-item" onClick={logout}>
            <LogOut size={16} />
            <span>Sign out</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Top bar */}
        <header style={{
          padding: '14px 32px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 16,
          background: 'rgba(8,11,20,0.9)',
          backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 50
        }}>
          {/* Search */}
          <div style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              style={{ paddingLeft: 36, height: 36, fontSize: 13, background: 'var(--bg-card)' }}
              placeholder="Search tasks, rooms, schedules..."
            />
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Notif */}
            <button
              className="btn btn-ghost btn-icon"
              style={{ position: 'relative' }}
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <Bell size={16} />
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--accent-rose)',
                border: '1.5px solid var(--bg-primary)'
              }} />
            </button>
            <button className="btn btn-ghost btn-icon" onClick={() => navigate('/profile')}>
              <Settings size={16} />
            </button>
            <div
              className="avatar avatar-sm"
              style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', cursor: 'pointer' }}
              onClick={() => navigate('/profile')}
            >
              {user?.initials}
            </div>
          </div>
        </header>

        <div style={{ flex: 1, padding: '28px 32px', overflow: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
