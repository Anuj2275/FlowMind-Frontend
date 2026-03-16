import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  User, Mail, Lock, Bell, Palette, Shield, Save,
  TrendingUp, CheckSquare, Clock, Users, Flame,
  Camera, Edit3, Star, Award, Zap, BarChart2, Calendar,
  Check, Eye, EyeOff, ChevronRight, Moon, Sun, Globe
} from 'lucide-react'

const TABS = [
  { key: 'overview', label: 'Overview', icon: User },
  { key: 'account', label: 'Account', icon: Shield },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'appearance', label: 'Appearance', icon: Palette },
]

const WEEK_ACTIVITY = [
  [0,1,0,1,1,0,1],
  [1,1,1,0,1,1,1],
  [0,0,1,1,0,1,0],
  [1,1,0,1,1,1,1],
  [1,1,1,1,0,1,1],
  [0,1,1,0,1,0,1],
  [1,1,0,1,1,1,1],
  [1,0,1,1,0,1,1],
  [0,1,1,1,1,0,1],
  [1,1,1,0,1,1,1],
  [0,0,1,1,1,1,0],
  [1,1,1,1,0,1,1],
]

const BADGES = [
  { icon: '🔥', name: '2-Week Streak', desc: 'Maintained 14-day streak', unlocked: true },
  { icon: '⚡', name: 'Speed Demon', desc: 'Completed 10 tasks in one day', unlocked: true },
  { icon: '🎯', name: 'Goal Crusher', desc: 'Hit daily goal 30 days', unlocked: true },
  { icon: '👥', name: 'Team Player', desc: 'Joined 25 focus rooms', unlocked: true },
  { icon: '🌙', name: 'Night Owl', desc: '50h late-night focus', unlocked: false },
  { icon: '🚀', name: 'Rocketeer', desc: 'Complete 500 tasks', unlocked: false },
]

export default function Profile() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('overview')
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [showPass, setShowPass] = useState(false)
  const [saved, setSaved] = useState(false)

  const [notifs, setNotifs] = useState({
    taskReminders: true, roomInvites: true, streakAlerts: true,
    weeklyReport: true, focusRoomStart: false
  })

  const [appearance, setAppearance] = useState({
    theme: 'dark', accentColor: 'cyan', compactMode: false, animationsOn: true
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const ACCENT_COLORS = [
    { key: 'cyan', value: '#00E5FF' },
    { key: 'violet', value: '#7C3AED' },
    { key: 'emerald', value: '#10B981' },
    { key: 'amber', value: '#F59E0B' },
    { key: 'rose', value: '#F43F5E' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeUp 0.4s ease' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>Profile</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile hero */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.07) 0%, rgba(124,58,237,0.07) 100%)', border: '1px solid var(--border-bright)', borderRadius: 'var(--radius-xl)', padding: '28px 28px', display: 'flex', alignItems: 'center', gap: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div className="avatar avatar-xl" style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', fontSize: 28, boxShadow: '0 0 40px rgba(0,229,255,0.3)' }}>
            {user?.initials}
          </div>
          <button style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 26, height: 26, borderRadius: '50%',
            background: 'var(--bg-card)', border: '2px solid var(--border-bright)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Camera size={12} color="var(--text-secondary)" />
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 3 }}>{user?.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{user?.email} · Member since Sep 2024</div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { v: user?.stats?.tasksCompleted, l: 'Tasks Done', color: 'var(--accent-cyan)' },
              { v: `${user?.stats?.focusHours}h`, l: 'Focus Time', color: 'var(--accent-violet)' },
              { v: user?.stats?.roomsJoined, l: 'Rooms Joined', color: 'var(--accent-emerald)' },
              { v: `${user?.streak}d`, l: 'Streak', color: 'var(--accent-amber)' },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: s.color }}>{s.v}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <span className="badge badge-cyan"><Flame size={10} /> {user?.streak}-Day Streak</span>
          <span className="badge badge-violet"><Award size={10} /> 4 Badges Earned</span>
        </div>
      </div>

      {/* Tab layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Tab nav */}
        <div className="stat-card" style={{ padding: 8 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === t.key ? 'var(--accent-cyan-dim)' : 'transparent',
              color: tab === t.key ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: tab === t.key ? 600 : 400,
              transition: 'all 0.15s', textAlign: 'left', marginBottom: 2
            }}>
              <t.icon size={15} />
              {t.label}
              {tab === t.key && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
            </button>
          ))}

          <div style={{ margin: '8px 0', height: 1, background: 'var(--border)' }} />

          <button onClick={logout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'var(--accent-rose)',
            fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 500,
            transition: 'all 0.15s', textAlign: 'left'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Sign out
          </button>
        </div>

        {/* Tab content */}
        <div>
          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Activity heatmap */}
              <div className="stat-card">
                <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
                  <BarChart2 size={15} color="var(--accent-cyan)" />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700 }}>Activity Heatmap</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>Last 12 weeks</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {WEEK_ACTIVITY.map((week, wi) => (
                    <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {week.map((active, di) => (
                        <div key={di} className="tooltip" data-tip={active ? 'Active' : 'No activity'} style={{
                          width: 12, height: 12, borderRadius: 3,
                          background: active ? (wi > 9 ? 'var(--accent-cyan)' : wi > 6 ? 'rgba(0,229,255,0.5)' : 'rgba(0,229,255,0.25)') : 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          cursor: 'pointer', transition: 'transform 0.1s'
                        }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 10 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Less</span>
                  {[0.15,0.3,0.5,0.7,1].map(o => (
                    <div key={o} style={{ width: 10, height: 10, borderRadius: 2, background: `rgba(0,229,255,${o})` }} />
                  ))}
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>More</span>
                </div>
              </div>

              {/* Badges */}
              <div className="stat-card">
                <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
                  <Award size={15} color="var(--accent-amber)" />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700 }}>Achievements</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {BADGES.map(b => (
                    <div key={b.name} style={{
                      padding: '12px', borderRadius: 12, border: '1px solid',
                      borderColor: b.unlocked ? 'var(--border-bright)' : 'var(--border)',
                      background: b.unlocked ? 'var(--bg-card-hover)' : 'var(--bg-secondary)',
                      textAlign: 'center', opacity: b.unlocked ? 1 : 0.4,
                      transition: 'all 0.2s', cursor: 'pointer'
                    }}
                      onMouseEnter={e => b.unlocked && (e.currentTarget.style.transform = 'translateY(-2px)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                    >
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{b.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 3 }}>{b.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4 }}>{b.desc}</div>
                      {!b.unlocked && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>🔒 Locked</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats breakdown */}
              <div className="cards-grid-3" style={{ gap: 12 }}>
                {[
                  { label: 'Avg tasks/day', value: '6.4', icon: CheckSquare, color: 'var(--accent-cyan)', trend: '+12%' },
                  { label: 'Avg focus/day', value: '2.8h', icon: Clock, color: 'var(--accent-violet)', trend: '+8%' },
                  { label: 'Rooms this month', value: '12', icon: Users, color: 'var(--accent-emerald)', trend: '+4' },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                      <s.icon size={14} color={s.color} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: 'var(--accent-emerald)', marginTop: 4 }}>↑ {s.trend} this week</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACCOUNT */}
          {tab === 'account' && (
            <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Account Settings</div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Display Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input className="input" value={name} onChange={e => setName(e.target.value)} style={{ paddingLeft: 34 }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 34 }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input className="input" type={showPass ? 'text' : 'password'} placeholder="Leave blank to keep current" style={{ paddingLeft: 34, paddingRight: 40 }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                    {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Bio</label>
                <textarea className="input" placeholder="Tell others about yourself..." rows={3} style={{ resize: 'none' }} />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Timezone</label>
                <div style={{ position: 'relative' }}>
                  <Globe size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <select className="input" style={{ paddingLeft: 34, cursor: 'pointer' }}>
                    <option>Asia/Kolkata (IST, UTC+5:30)</option>
                    <option>America/New_York (EST, UTC-5)</option>
                    <option>Europe/London (GMT, UTC+0)</option>
                    <option>Asia/Tokyo (JST, UTC+9)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={handleSave}>
                  {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {tab === 'notifications' && (
            <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Notification Preferences</div>
              {[
                { key: 'taskReminders', label: 'Task Reminders', desc: 'Get notified before tasks are due' },
                { key: 'roomInvites', label: 'Room Invites', desc: 'When someone invites you to a focus room' },
                { key: 'streakAlerts', label: 'Streak Alerts', desc: 'Daily reminders to maintain your streak' },
                { key: 'weeklyReport', label: 'Weekly Report', desc: 'Summary of your productivity each week' },
                { key: 'focusRoomStart', label: 'Room Start Notifications', desc: 'When a room you follow goes live' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between" style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{n.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{n.desc}</div>
                  </div>
                  <div onClick={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))} style={{
                    width: 44, height: 24, borderRadius: 99, cursor: 'pointer',
                    background: notifs[n.key] ? 'var(--accent-cyan)' : 'var(--border-bright)',
                    position: 'relative', transition: 'background 0.2s', flexShrink: 0
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', background: 'white',
                      position: 'absolute', top: 3, left: notifs[n.key] ? 23 : 3,
                      transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
                    }} />
                  </div>
                </div>
              ))}
              <div className="flex justify-end" style={{ marginTop: 16 }}>
                <button className="btn btn-primary" onClick={handleSave}>
                  {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Preferences</>}
                </button>
              </div>
            </div>
          )}

          {/* APPEARANCE */}
          {tab === 'appearance' && (
            <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Appearance</div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10, fontFamily: 'var(--font-display)' }}>Theme</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[{ k: 'dark', label: '🌙 Dark', icon: Moon }, { k: 'light', label: '☀️ Light', icon: Sun }].map(t => (
                    <div key={t.k} onClick={() => setAppearance(p => ({ ...p, theme: t.k }))} style={{
                      flex: 1, padding: '14px', borderRadius: 12, border: '2px solid',
                      borderColor: appearance.theme === t.k ? 'var(--accent-cyan)' : 'var(--border)',
                      background: appearance.theme === t.k ? 'var(--accent-cyan-dim)' : 'var(--bg-secondary)',
                      cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s'
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{t.k === 'dark' ? '🌙' : '☀️'}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: appearance.theme === t.k ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>{t.k === 'dark' ? 'Dark' : 'Light'}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10, fontFamily: 'var(--font-display)' }}>Accent Color</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {ACCENT_COLORS.map(c => (
                    <div key={c.key} onClick={() => setAppearance(p => ({ ...p, accentColor: c.key }))} style={{
                      width: 40, height: 40, borderRadius: 10, background: c.value,
                      cursor: 'pointer', transition: 'all 0.15s',
                      border: appearance.accentColor === c.key ? '3px solid white' : '3px solid transparent',
                      boxShadow: appearance.accentColor === c.key ? `0 0 0 2px ${c.value}` : 'none',
                      transform: appearance.accentColor === c.key ? 'scale(1.15)' : 'scale(1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {appearance.accentColor === c.key && <Check size={16} color="white" />}
                    </div>
                  ))}
                </div>
              </div>

              {[
                { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce padding and spacing throughout the app' },
                { key: 'animationsOn', label: 'Animations', desc: 'Enable smooth transitions and motion effects' },
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between" style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.desc}</div>
                  </div>
                  <div onClick={() => setAppearance(p => ({ ...p, [s.key]: !p[s.key] }))} style={{
                    width: 44, height: 24, borderRadius: 99, cursor: 'pointer',
                    background: appearance[s.key] ? 'var(--accent-cyan)' : 'var(--border-bright)',
                    position: 'relative', transition: 'background 0.2s', flexShrink: 0
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', background: 'white',
                      position: 'absolute', top: 3, left: appearance[s.key] ? 23 : 3,
                      transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
                    }} />
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={handleSave}>
                  {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Appearance</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
