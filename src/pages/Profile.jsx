// src/pages/Profile.jsx
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  User, Mail, Lock, Bell, Palette, Shield, Save,
  TrendingUp, CheckSquare, Clock, Users, Flame,
  Camera, Edit3, Star, Award, Zap, BarChart2, Calendar,
  Check, Eye, EyeOff, ChevronRight, Moon, Sun, Globe, AlertCircle,
} from 'lucide-react'

const TABS = [
  { key: 'overview',      label: 'Overview',       icon: User },
  { key: 'account',       label: 'Account',        icon: Shield },
  { key: 'notifications', label: 'Notifications',  icon: Bell },
  { key: 'appearance',    label: 'Appearance',     icon: Palette },
]

const WEEK_ACTIVITY = [
  [0,1,0,1,1,0,1], [1,1,1,0,1,1,1], [0,0,1,1,0,1,0],
  [1,1,0,1,1,1,1], [1,1,1,1,0,1,1], [0,1,1,0,1,0,1],
  [1,1,0,1,1,1,1], [1,0,1,1,0,1,1], [0,1,1,1,1,0,1],
  [1,1,1,0,1,1,1], [0,0,1,1,1,1,0], [1,1,1,1,0,1,1],
]

const BADGES = [
  { icon: '🔥', name: '2-Week Streak',  desc: 'Maintained 14-day streak',   unlocked: true },
  { icon: '⚡', name: 'Speed Demon',    desc: 'Completed 10 tasks in a day', unlocked: true },
  { icon: '🎯', name: 'Goal Crusher',   desc: 'Hit daily goal 30 days',      unlocked: true },
  { icon: '👥', name: 'Team Player',    desc: 'Joined 25 focus rooms',       unlocked: true },
  { icon: '🌙', name: 'Night Owl',      desc: '50h late-night focus',        unlocked: false },
  { icon: '🚀', name: 'Rocketeer',      desc: 'Complete 500 tasks',          unlocked: false },
]

const ACCENT_COLORS = [
  { key: 'cyan',    value: '#00E5FF' },
  { key: 'violet',  value: '#7C3AED' },
  { key: 'emerald', value: '#10B981' },
  { key: 'amber',   value: '#F59E0B' },
  { key: 'rose',    value: '#F43F5E' },
]

export default function Profile() {
  const { user, updateProfile, changePassword, logout } = useAuth()
  const [tab, setTab] = useState('overview')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Account form state
  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [timezone, setTimezone] = useState(user?.timezone || 'Asia/Kolkata')
  const [showPass, setShowPass] = useState(false)
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [passMsg, setPassMsg] = useState('')

  // Notification settings
  const [notifs, setNotifs] = useState({
    taskReminders:  user?.notificationSettings?.taskReminders  ?? true,
    roomInvites:    user?.notificationSettings?.roomInvites    ?? true,
    streakAlerts:   user?.notificationSettings?.streakAlerts   ?? true,
    weeklyReport:   user?.notificationSettings?.weeklyReport   ?? true,
    focusRoomStart: user?.notificationSettings?.focusRoomStart ?? false,
  })

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme:        user?.appearance?.theme        || 'dark',
    accentColor:  user?.appearance?.accentColor  || 'cyan',
    compactMode:  user?.appearance?.compactMode  ?? false,
    animationsOn: user?.appearance?.animationsOn ?? true,
  })

  const flashSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  // ── SAVE ACCOUNT ──────────────────────────────────────────────────────────
  const handleSaveAccount = async () => {
    setSaving(true); setSaveError('')
    const res = await updateProfile({ name, bio, timezone })
    setSaving(false)
    if (res.success) flashSaved()
    else setSaveError(res.message)
  }

  // ── CHANGE PASSWORD ───────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!currentPass || !newPass) return setPassMsg('Fill in both fields')
    if (newPass.length < 6) return setPassMsg('New password must be at least 6 characters')
    setSaving(true); setPassMsg('')
    const res = await changePassword(currentPass, newPass)
    setSaving(false)
    if (res.success) { setPassMsg('Password changed successfully!'); setCurrentPass(''); setNewPass('') }
    else setPassMsg(res.message)
  }

  // ── SAVE NOTIFICATIONS ────────────────────────────────────────────────────
  const handleSaveNotifs = async () => {
    setSaving(true); setSaveError('')
    const res = await updateProfile({ notificationSettings: notifs })
    setSaving(false)
    if (res.success) flashSaved()
    else setSaveError(res.message)
  }

  // ── SAVE APPEARANCE ───────────────────────────────────────────────────────
  const handleSaveAppearance = async () => {
    setSaving(true); setSaveError('')
    const res = await updateProfile({ appearance })
    setSaving(false)
    if (res.success) flashSaved()
    else setSaveError(res.message)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeUp 0.4s ease' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>Profile</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile hero */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.07) 0%, rgba(124,58,237,0.07) 100%)', border: '1px solid var(--border-bright)', borderRadius: 'var(--radius-xl)', padding: '28px', display: 'flex', alignItems: 'center', gap: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div className="avatar avatar-xl" style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', fontSize: 28, boxShadow: '0 0 40px rgba(0,229,255,0.3)' }}>
            {user?.initials}
          </div>
          <button style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--border-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Camera size={12} color="var(--text-secondary)" />
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 3 }}>{user?.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{user?.email}</div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { v: user?.stats?.tasksCompleted ?? 0, l: 'Tasks Done',   color: 'var(--accent-cyan)' },
              { v: `${user?.stats?.focusHours ?? 0}h`, l: 'Focus Time', color: 'var(--accent-violet)' },
              { v: user?.stats?.roomsJoined ?? 0, l: 'Rooms Joined',    color: 'var(--accent-emerald)' },
              { v: `${user?.streak ?? 0}d`, l: 'Streak',               color: 'var(--accent-amber)' },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: s.color }}>{s.v}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <span className="badge badge-cyan"><Flame size={10} /> {user?.streak ?? 0}-Day Streak</span>
          <span className="badge badge-violet"><Award size={10} /> {BADGES.filter(b => b.unlocked).length} Badges</span>
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
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
              marginBottom: 2, transition: 'all 0.15s', textAlign: 'left',
            }}>
              <t.icon size={15} />
              {t.label}
              {tab === t.key && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {saveError && (
            <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--accent-rose)', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
              <AlertCircle size={14} /> {saveError}
            </div>
          )}

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Activity heatmap */}
              <div className="stat-card">
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BarChart2 size={16} color="var(--accent-cyan)" /> Activity
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {WEEK_ACTIVITY.map((week, wi) => (
                    <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {week.map((active, di) => (
                        <div key={di} title={active ? 'Active' : 'Inactive'} style={{
                          width: 12, height: 12, borderRadius: 3,
                          background: active ? 'var(--accent-cyan)' : 'var(--border)',
                          opacity: active ? 0.7 + di * 0.04 : 1,
                          transition: 'opacity 0.15s', cursor: 'default',
                        }} />
                      ))}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
                  Last 12 weeks of activity
                </div>
              </div>

              {/* Badges */}
              <div className="stat-card">
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Award size={16} color="var(--accent-amber)" /> Badges
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                  {BADGES.map(badge => (
                    <div key={badge.name} style={{
                      padding: '14px', borderRadius: 12, border: '1px solid',
                      borderColor: badge.unlocked ? 'rgba(245,158,11,0.2)' : 'var(--border)',
                      background: badge.unlocked ? 'rgba(245,158,11,0.06)' : 'var(--bg-secondary)',
                      opacity: badge.unlocked ? 1 : 0.45, textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{badge.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{badge.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4 }}>{badge.desc}</div>
                      {badge.unlocked && <div style={{ marginTop: 6 }}><span className="badge badge-amber" style={{ fontSize: 9 }}>Earned</span></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ACCOUNT ── */}
          {tab === 'account' && (
            <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Account Settings</div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Display Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input className="input" value={name} onChange={e => setName(e.target.value)} style={{ paddingLeft: 34 }} placeholder="Your name" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input className="input" value={user?.email || ''} disabled style={{ paddingLeft: 34, opacity: 0.5, cursor: 'not-allowed' }} />
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Email cannot be changed</p>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Bio</label>
                <textarea className="input" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell others about yourself..." rows={3} style={{ resize: 'none' }} />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Timezone</label>
                <div style={{ position: 'relative' }}>
                  <Globe size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <select className="input" value={timezone} onChange={e => setTimezone(e.target.value)} style={{ paddingLeft: 34, cursor: 'pointer' }}>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
                    <option value="America/New_York">America/New_York (EST, UTC-5)</option>
                    <option value="Europe/London">Europe/London (GMT, UTC+0)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST, UTC+9)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST, UTC-8)</option>
                    <option value="Europe/Paris">Europe/Paris (CET, UTC+1)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={handleSaveAccount} disabled={saving}>
                  {saved ? <><Check size={16} /> Saved!</> : saving ? 'Saving…' : <><Save size={16} /> Save Changes</>}
                </button>
              </div>

              {/* Password change */}
              <div style={{ marginTop: 8, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Change Password</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ position: 'relative' }}>
                    <Lock size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input type="password" className="input" value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="Current password" style={{ paddingLeft: 34 }} />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input type={showPass ? 'text' : 'password'} className="input" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="New password (min 6 chars)" style={{ paddingLeft: 34, paddingRight: 40 }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                      {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  {passMsg && (
                    <p style={{ fontSize: 12, color: passMsg.includes('success') ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{passMsg}</p>
                  )}
                  <div className="flex justify-end">
                    <button className="btn btn-ghost btn-sm" onClick={handleChangePassword} disabled={saving}>
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger zone */}
              <div style={{ marginTop: 8, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--accent-rose)', marginBottom: 12 }}>Danger Zone</div>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.3)' }} onClick={logout}>
                  Sign out of all devices
                </button>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {tab === 'notifications' && (
            <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Notification Preferences</div>
              {[
                { key: 'taskReminders',  label: 'Task Reminders',          desc: 'Get notified before tasks are due' },
                { key: 'roomInvites',    label: 'Room Invites',             desc: 'When someone invites you to a focus room' },
                { key: 'streakAlerts',   label: 'Streak Alerts',            desc: 'Daily reminders to maintain your streak' },
                { key: 'weeklyReport',   label: 'Weekly Report',            desc: 'Summary of your productivity each week' },
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
                    position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                  }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: notifs[n.key] ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                  </div>
                </div>
              ))}
              <div className="flex justify-end" style={{ marginTop: 16 }}>
                <button className="btn btn-primary" onClick={handleSaveNotifs} disabled={saving}>
                  {saved ? <><Check size={14} /> Saved!</> : saving ? 'Saving…' : <><Save size={14} /> Save Preferences</>}
                </button>
              </div>
            </div>
          )}

          {/* ── APPEARANCE ── */}
          {tab === 'appearance' && (
            <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Appearance</div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10, fontFamily: 'var(--font-display)' }}>Theme</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[{ k: 'dark', label: 'Dark', emoji: '🌙' }, { k: 'light', label: 'Light', emoji: '☀️' }].map(t => (
                    <div key={t.k} onClick={() => setAppearance(p => ({ ...p, theme: t.k }))} style={{
                      flex: 1, padding: 14, borderRadius: 12, border: '2px solid',
                      borderColor: appearance.theme === t.k ? 'var(--accent-cyan)' : 'var(--border)',
                      background: appearance.theme === t.k ? 'var(--accent-cyan-dim)' : 'var(--bg-secondary)',
                      cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{t.emoji}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: appearance.theme === t.k ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>{t.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10, fontFamily: 'var(--font-display)' }}>Accent Color</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {ACCENT_COLORS.map(c => (
                    <div key={c.key} onClick={() => setAppearance(p => ({ ...p, accentColor: c.key }))} style={{
                      width: 40, height: 40, borderRadius: 10, background: c.value, cursor: 'pointer', transition: 'all 0.15s',
                      border: appearance.accentColor === c.key ? '3px solid white' : '3px solid transparent',
                      boxShadow: appearance.accentColor === c.key ? `0 0 0 2px ${c.value}` : 'none',
                      transform: appearance.accentColor === c.key ? 'scale(1.15)' : 'scale(1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {appearance.accentColor === c.key && <Check size={16} color="white" />}
                    </div>
                  ))}
                </div>
              </div>

              {[
                { key: 'compactMode',  label: 'Compact Mode', desc: 'Reduce padding and spacing throughout the app' },
                { key: 'animationsOn', label: 'Animations',   desc: 'Enable smooth transitions and motion effects' },
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between" style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.desc}</div>
                  </div>
                  <div onClick={() => setAppearance(p => ({ ...p, [s.key]: !p[s.key] }))} style={{
                    width: 44, height: 24, borderRadius: 99, cursor: 'pointer',
                    background: appearance[s.key] ? 'var(--accent-cyan)' : 'var(--border-bright)',
                    position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                  }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: appearance[s.key] ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={handleSaveAppearance} disabled={saving}>
                  {saved ? <><Check size={14} /> Saved!</> : saving ? 'Saving…' : <><Save size={14} /> Save Appearance</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}