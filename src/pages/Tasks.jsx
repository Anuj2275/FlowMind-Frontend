import { useState, useMemo } from 'react'
import {
  Plus, Search, Filter, CheckCircle2, Circle, Trash2, Edit3,
  Tag, Clock, AlertCircle, ChevronDown, X, Flag, Calendar, MoreHorizontal
} from 'lucide-react'

const INITIAL_TASKS = [
  { id: 1, title: 'Design the new authentication flow', description: 'Create wireframes and prototype for the new login/register screens', status: 'in-progress', priority: 'high', label: 'Design', due: '2025-03-20', done: false },
  { id: 2, title: 'Implement JWT refresh token logic', description: 'Add automatic token refresh in the Express middleware', status: 'todo', priority: 'high', label: 'Backend', due: '2025-03-18', done: false },
  { id: 3, title: 'Write API documentation', description: 'Document all endpoints using Swagger/OpenAPI spec', status: 'todo', priority: 'medium', label: 'Docs', due: '2025-03-25', done: false },
  { id: 4, title: 'Fix WebRTC signaling bug', description: 'ICE candidate exchange sometimes fails on Firefox', status: 'in-progress', priority: 'high', label: 'Bug', due: '2025-03-17', done: false },
  { id: 5, title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment', status: 'todo', priority: 'medium', label: 'DevOps', due: '2025-03-30', done: false },
  { id: 6, title: 'Add Socket.IO room events', description: 'Implement join/leave/kick events for focus rooms', status: 'done', priority: 'high', label: 'Backend', due: '2025-03-15', done: true },
  { id: 7, title: 'Create task management API', description: 'CRUD endpoints for user tasks with JWT protection', status: 'done', priority: 'medium', label: 'Backend', due: '2025-03-14', done: true },
  { id: 8, title: 'User profile page UI', description: 'Build profile settings with avatar upload', status: 'todo', priority: 'low', label: 'Frontend', due: '2025-04-01', done: false },
]

const LABELS = ['All', 'Design', 'Backend', 'Frontend', 'Docs', 'Bug', 'DevOps']
const PRIORITIES = ['all', 'high', 'medium', 'low']
const PRIORITY_COLOR = { high: 'var(--accent-rose)', medium: 'var(--accent-amber)', low: 'var(--accent-emerald)' }
const PRIORITY_BG = { high: 'rgba(244,63,94,0.12)', medium: 'rgba(245,158,11,0.12)', low: 'rgba(16,185,129,0.12)' }
const STATUS_MAP = { todo: { label: 'To Do', color: 'var(--text-muted)' }, 'in-progress': { label: 'In Progress', color: 'var(--accent-cyan)' }, done: { label: 'Done', color: 'var(--accent-emerald)' } }

function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(task || { title: '', description: '', priority: 'medium', label: 'Frontend', due: '', status: 'todo', done: false })

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 520 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Title *</label>
            <input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="What needs to be done?" />
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Description</label>
            <textarea className="input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Add more details..." rows={3} style={{ resize: 'vertical', lineHeight: 1.6 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Priority</label>
              <select className="input" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} style={{ cursor: 'pointer' }}>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Label</label>
              <select className="input" value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} style={{ cursor: 'pointer' }}>
                {LABELS.filter(l => l !== 'All').map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Due Date</label>
              <input type="date" className="input" value={form.due} onChange={e => setForm(p => ({ ...p, due: e.target.value }))} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Status</label>
            <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ cursor: 'pointer' }}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end" style={{ marginTop: 24 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => form.title.trim() && onSave({ ...form, id: task?.id || Date.now(), done: form.status === 'done' })}>
            {task ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Tasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [search, setSearch] = useState('')
  const [filterLabel, setFilterLabel] = useState('All')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modal, setModal] = useState(null) // null | 'new' | task object
  const [view, setView] = useState('list') // 'list' | 'kanban'

  const filtered = useMemo(() => tasks.filter(t =>
    (filterLabel === 'All' || t.label === filterLabel) &&
    (filterPriority === 'all' || t.priority === filterPriority) &&
    (filterStatus === 'all' || t.status === filterStatus) &&
    (search === '' || t.title.toLowerCase().includes(search.toLowerCase()))
  ), [tasks, filterLabel, filterPriority, filterStatus, search])

  const saveTask = (task) => {
    setTasks(prev => prev.some(t => t.id === task.id) ? prev.map(t => t.id === task.id ? task : t) : [...prev, task])
    setModal(null)
  }
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id))
  const toggleDone = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done, status: !t.done ? 'done' : 'todo' } : t))

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.done).length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    highPriority: tasks.filter(t => t.priority === 'high' && !t.done).length,
  }

  // Kanban columns
  const kanbanCols = ['todo', 'in-progress', 'done']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp 0.4s ease' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>Tasks</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>{stats.done}/{stats.total} completed · {stats.inProgress} in progress</p>
        </div>
        <div className="flex gap-2">
          {/* View toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 3, gap: 2 }}>
            {['list', 'kanban'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, transition: 'all 0.15s',
                background: view === v ? 'var(--bg-secondary)' : 'transparent',
                color: view === v ? 'var(--text-primary)' : 'var(--text-muted)',
                textTransform: 'capitalize'
              }}>{v}</button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setModal('new')}>
            <Plus size={14} /> New Task
          </button>
        </div>
      </div>

      {/* Stats mini */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Total', value: stats.total, color: 'var(--text-secondary)' },
          { label: 'Completed', value: stats.done, color: 'var(--accent-emerald)' },
          { label: 'In Progress', value: stats.inProgress, color: 'var(--accent-cyan)' },
          { label: 'High Priority', value: stats.highPriority, color: 'var(--accent-rose)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10,
            padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center" style={{ flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." style={{ paddingLeft: 32, height: 34, fontSize: 13 }} />
        </div>

        {/* Label filter */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {LABELS.map(l => (
            <button key={l} onClick={() => setFilterLabel(l)} style={{
              padding: '5px 12px', borderRadius: 99, border: '1px solid', cursor: 'pointer', fontSize: 12, fontWeight: 500, transition: 'all 0.15s',
              borderColor: filterLabel === l ? 'var(--accent-cyan)' : 'var(--border)',
              background: filterLabel === l ? 'var(--accent-cyan-dim)' : 'transparent',
              color: filterLabel === l ? 'var(--accent-cyan)' : 'var(--text-muted)',
            }}>{l}</button>
          ))}
        </div>

        <select className="input" value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ width: 'auto', height: 34, fontSize: 13, cursor: 'pointer' }}>
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select className="input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 'auto', height: 34, fontSize: 13, cursor: 'pointer' }}>
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Column headers */}
          <div className="flex items-center gap-3" style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div style={{ width: 20 }} />
            <div style={{ flex: 1, fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)' }}>Task</div>
            <div style={{ width: 80, fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', textAlign: 'center' }}>Label</div>
            <div style={{ width: 80, fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', textAlign: 'center' }}>Priority</div>
            <div style={{ width: 90, fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', textAlign: 'center' }}>Status</div>
            <div style={{ width: 90, fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', textAlign: 'center' }}>Due</div>
            <div style={{ width: 56 }} />
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              No tasks match your filters
            </div>
          )}

          {filtered.map(task => (
            <div key={task.id}
              className="flex items-center gap-3"
              style={{
                padding: '12px 20px',
                borderBottom: '1px solid var(--border)',
                transition: 'background 0.15s',
                opacity: task.done ? 0.55 : 1,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div className={`checkbox-custom ${task.done ? 'checked' : ''}`} onClick={() => toggleDone(task.id)} style={{ borderColor: task.done ? 'var(--accent-cyan)' : PRIORITY_COLOR[task.priority] + '80' }}>
                {task.done && <CheckCircle2 size={11} color="var(--bg-primary)" />}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, textDecoration: task.done ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: task.done ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                  {task.title}
                </div>
                {task.description && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {task.description}
                  </div>
                )}
              </div>

              <div style={{ width: 80, textAlign: 'center' }}>
                <span className="tag" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: 10 }}>{task.label}</span>
              </div>

              <div style={{ width: 80, textAlign: 'center' }}>
                <span style={{ fontSize: 11, color: PRIORITY_COLOR[task.priority], fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'capitalize' }}>
                  ● {task.priority}
                </span>
              </div>

              <div style={{ width: 90, textAlign: 'center' }}>
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 99, background: task.status === 'done' ? 'var(--accent-emerald-dim)' : task.status === 'in-progress' ? 'var(--accent-cyan-dim)' : 'var(--bg-secondary)', color: STATUS_MAP[task.status].color, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                  {STATUS_MAP[task.status].label}
                </span>
              </div>

              <div style={{ width: 90, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {task.due || '—'}
              </div>

              <div className="flex gap-1" style={{ width: 56 }}>
                <button className="btn btn-ghost btn-icon" style={{ width: 28, height: 28 }} onClick={() => setModal(task)}>
                  <Edit3 size={12} />
                </button>
                <button className="btn btn-ghost btn-icon" style={{ width: 28, height: 28, color: 'var(--accent-rose)' }} onClick={() => deleteTask(task.id)}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KANBAN VIEW */}
      {view === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, alignItems: 'start' }}>
          {kanbanCols.map(col => {
            const colTasks = filtered.filter(t => t.status === col)
            return (
              <div key={col} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div className="flex items-center justify-between" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_MAP[col].color }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, textTransform: 'capitalize' }}>
                      {STATUS_MAP[col].label}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 99, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{colTasks.length}</span>
                </div>
                <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 6, minHeight: 100 }}>
                  {colTasks.map(task => (
                    <div key={task.id} style={{
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderLeft: `3px solid ${PRIORITY_COLOR[task.priority]}`,
                      borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{task.title}</div>
                      {task.description && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{task.description}</div>}
                      <div className="flex items-center justify-between">
                        <span className="tag" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: 10 }}>{task.label}</span>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-icon" style={{ width: 24, height: 24 }} onClick={() => setModal(task)}><Edit3 size={10} /></button>
                          <button className="btn btn-ghost btn-icon" style={{ width: 24, height: 24, color: 'var(--accent-rose)' }} onClick={() => deleteTask(task.id)}><Trash2 size={10} /></button>
                        </div>
                      </div>
                      {task.due && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>Due: {task.due}</div>}
                    </div>
                  ))}
                  <button style={{ padding: '8px', borderRadius: 8, border: '1px dashed var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-cyan)'; e.currentTarget.style.color = 'var(--accent-cyan)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                    onClick={() => setModal({ status: col, priority: 'medium', label: 'Frontend' })}
                  >
                    <Plus size={12} /> Add task
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <TaskModal
          task={modal === 'new' ? null : modal}
          onSave={saveTask}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
