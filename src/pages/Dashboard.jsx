import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  CheckSquare, Clock, Zap, TrendingUp, ArrowRight, Plus, Users,
  Calendar, Target, Flame, BarChart2, Circle, CheckCircle2, AlertCircle
} from 'lucide-react'

const TODAY_TASKS = [
  { id: 1, title: 'Review pull request #142', done: true, priority: 'high', time: '9:00 AM' },
  { id: 2, title: 'Update API documentation', done: true, priority: 'medium', time: '10:30 AM' },
  { id: 3, title: 'Design dashboard v2 wireframes', done: false, priority: 'high', time: '2:00 PM' },
  { id: 4, title: 'Write unit tests for auth module', done: false, priority: 'medium', time: '4:00 PM' },
  { id: 5, title: 'Team standup meeting', done: false, priority: 'low', time: '5:30 PM' },
]

const ACTIVE_ROOMS = [
  { id: 'r1', name: 'Deep Work — Backend', members: 4, topic: 'Node.js', color: '#00E5FF' },
  { id: 'r2', name: 'Design Sprint', members: 2, topic: 'UI/UX', color: '#7C3AED' },
  { id: 'r3', name: 'Study Hall', members: 7, topic: 'General', color: '#10B981' },
]

const WEEK_DATA = [40, 65, 52, 80, 71, 45, 60]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const PRIORITY_COLOR = { high: 'var(--accent-rose)', medium: 'var(--accent-amber)', low: 'var(--accent-emerald)' }

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState(TODAY_TASKS)

  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const done = tasks.filter(t => t.done).length
  const pct = Math.round(done / tasks.length * 100)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeUp 0.4s ease' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · You have {tasks.filter(t => !t.done).length} tasks remaining
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/schedule')}>
            <Calendar size={14} /> Schedule
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/rooms')}>
            <Zap size={14} /> Join Room
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="cards-grid-4" style={{ gap: 14 }}>
        {[
          { label: 'Tasks Today', value: `${done}/${tasks.length}`, sub: `${pct}% complete`, icon: CheckSquare, color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-dim)' },
          { label: 'Focus Time', value: '2h 40m', sub: '+18% vs yesterday', icon: Clock, color: 'var(--accent-violet)', bg: 'var(--accent-violet-dim)' },
          { label: 'Current Streak', value: `${user?.streak} days`, sub: 'Personal best!', icon: Flame, color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.12)' },
          { label: 'Productivity', value: '84%', sub: '↑ Trending up', icon: TrendingUp, color: 'var(--accent-emerald)', bg: 'var(--accent-emerald-dim)' },
        ].map(stat => (
          <div key={stat.label} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={15} color={stat.color} />
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Today's tasks */}
          <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="flex items-center justify-between" style={{ padding: '18px 20px 16px', borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2">
                <CheckSquare size={16} color="var(--accent-cyan)" />
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Today's Tasks</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="progress-bar" style={{ width: 80 }}>
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{pct}%</span>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tasks')}>
                  <Plus size={12} /> Add
                </button>
              </div>
            </div>
            <div style={{ padding: '8px 0' }}>
              {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3" style={{
                  padding: '10px 20px',
                  transition: 'background 0.15s',
                  opacity: task.done ? 0.5 : 1,
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => toggleTask(task.id)}
                >
                  <div className={`checkbox-custom ${task.done ? 'checked' : ''}`} style={{ borderColor: task.done ? 'var(--accent-cyan)' : 'var(--border-bright)' }}>
                    {task.done && <CheckCircle2 size={12} color="var(--bg-primary)" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? 'var(--text-muted)' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {task.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{task.time}</span>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: PRIORITY_COLOR[task.priority], flexShrink: 0 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'center' }} onClick={() => navigate('/tasks')}>
                View all tasks <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* Weekly activity chart */}
          <div className="stat-card">
            <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
              <div className="flex items-center gap-2">
                <BarChart2 size={16} color="var(--accent-violet)" />
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Weekly Focus</h2>
              </div>
              <span className="badge badge-violet">This week</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 100 }}>
              {WEEK_DATA.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{v}m</div>
                  <div style={{
                    width: '100%',
                    height: `${v}%`,
                    borderRadius: '4px 4px 0 0',
                    background: i === 3 ? 'linear-gradient(180deg, var(--accent-cyan), var(--accent-violet))' : 'var(--bg-secondary)',
                    border: i === 3 ? 'none' : '1px solid var(--border)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    minHeight: 4,
                  }}
                    onMouseEnter={e => { if (i !== 3) e.currentTarget.style.background = 'var(--border-bright)' }}
                    onMouseLeave={e => { if (i !== 3) e.currentTarget.style.background = 'var(--bg-secondary)' }}
                  />
                  <div style={{ fontSize: 10, color: i === new Date().getDay() - 1 ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>{DAYS[i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Daily goal */}
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.08) 0%, rgba(124,58,237,0.08) 100%)', borderColor: 'rgba(0,229,255,0.15)' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
              <Target size={15} color="var(--accent-cyan)" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700 }}>Daily Goal</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
              <span style={{ color: 'var(--accent-cyan)' }}>{done}</span>
              <span style={{ color: 'var(--text-muted)' }}>/{tasks.length} tasks</span>
            </div>
            <div className="progress-bar" style={{ height: 6, marginBottom: 8 }}>
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {tasks.length - done} more to hit your goal! 🎯
            </div>
          </div>

          {/* Active Rooms */}
          <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="flex items-center justify-between" style={{ padding: '16px 18px 14px', borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2">
                <Users size={15} color="var(--accent-emerald)" />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700 }}>Live Rooms</span>
              </div>
              <span className="badge badge-emerald">{ACTIVE_ROOMS.length} active</span>
            </div>
            <div style={{ padding: '8px 0' }}>
              {ACTIVE_ROOMS.map(room => (
                <div key={room.id}
                  className="flex items-center gap-3"
                  style={{ padding: '10px 18px', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => navigate(`/rooms/${room.id}`)}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: room.color, boxShadow: `0 0 6px ${room.color}`, flexShrink: 0, animation: 'pulse-glow 2s infinite' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{room.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{room.members} members · {room.topic}</div>
                  </div>
                  <ArrowRight size={12} color="var(--text-muted)" />
                </div>
              ))}
            </div>
            <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-primary btn-sm w-full" style={{ justifyContent: 'center' }} onClick={() => navigate('/rooms')}>
                Browse all rooms
              </button>
            </div>
          </div>

          {/* Quick schedule */}
          <div className="stat-card">
            <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
              <Calendar size={15} color="var(--accent-violet)" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700 }}>Upcoming</span>
            </div>
            {[
              { title: 'Team Standup', time: '5:30 PM', tag: 'Meeting' },
              { title: 'DSA Practice', time: '7:00 PM', tag: 'Study' },
              { title: 'Code Review', time: 'Tomorrow 10 AM', tag: 'Work' },
            ].map(ev => (
              <div key={ev.title} className="flex items-center gap-3" style={{ marginBottom: 10 }}>
                <div style={{ width: 3, height: 36, borderRadius: 2, background: 'var(--accent-violet)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{ev.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ev.time}</div>
                </div>
                <span className="tag" style={{ background: 'var(--accent-violet-dim)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.2)' }}>{ev.tag}</span>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'center', marginTop: 4 }} onClick={() => navigate('/schedule')}>
              Open schedule <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
