// src/pages/Tasks.jsx
import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Plus, Search, CheckCircle2, Circle, Trash2, Edit3,
  Tag, Clock, ChevronDown, X, Flag, Calendar, MoreHorizontal,
} from 'lucide-react'
import api from '../api'

const LABELS  = ['All', 'Design', 'Backend', 'Frontend', 'Docs', 'Bug', 'DevOps', 'Other']
const PRIORITIES = ['all', 'high', 'medium', 'low']
const PRIORITY_COLOR = { high: 'var(--accent-rose)', medium: 'var(--accent-amber)', low: 'var(--accent-emerald)' }
const PRIORITY_BG    = { high: 'rgba(244,63,94,0.12)', medium: 'rgba(245,158,11,0.12)', low: 'rgba(16,185,129,0.12)' }
const STATUS_MAP = {
  todo:        { label: 'To Do',       color: 'var(--text-muted)' },
  'in-progress':{ label: 'In Progress', color: 'var(--accent-cyan)' },
  done:        { label: 'Done',        color: 'var(--accent-emerald)' },
}

// ── TASK MODAL ────────────────────────────────────────────────────────────────
function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(task || {
    title: '', description: '', priority: 'medium',
    label: 'Frontend', due: '', status: 'todo', done: false,
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    await onSave({ ...form, done: form.status === 'done' })
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 520 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Title *</label>
            <input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="What needs to be done?" autoFocus />
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
              <input type="date" className="input" value={form.due || ''} onChange={e => setForm(p => ({ ...p, due: e.target.value }))} />
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
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.title.trim()}>
            {saving ? 'Saving…' : task ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [filterLabel, setFilterLabel] = useState('All')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modal, setModal] = useState(null)
  const [view, setView] = useState('list')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ── FETCH ──────────────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.get('/tasks')
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  // ── SAVE (create or update) ────────────────────────────────────────────────
  const saveTask = async (taskData) => {
    const isEdit = !!taskData._id
    try {
      if (isEdit) {
        const updated = await api.put(`/tasks/${taskData._id}`, taskData)
        setTasks(prev => prev.map(t => t._id === updated._id ? updated : t))
      } else {
        const created = await api.post('/tasks', taskData)
        setTasks(prev => [created, ...prev])
      }
      setModal(null)
    } catch (err) {
      alert('Error saving task: ' + err.message)
    }
  }

  // ── TOGGLE DONE ────────────────────────────────────────────────────────────
  const toggleDone = async (task) => {
    const newDone = !task.done
    const newStatus = newDone ? 'done' : 'todo'
    // Optimistic update
    setTasks(prev => prev.map(t => t._id === task._id ? { ...t, done: newDone, status: newStatus } : t))
    try {
      await api.put(`/tasks/${task._id}`, { done: newDone, status: newStatus })
    } catch {
      setTasks(prev => prev.map(t => t._id === task._id ? task : t)) // revert
    }
  }

  // ── DELETE ─────────────────────────────────────────────────────────────────
  const deleteTask = async (id) => {
    setTasks(prev => prev.filter(t => t._id !== id))
    try {
      await api.delete(`/tasks/${id}`)
    } catch (err) {
      alert('Error deleting task: ' + err.message)
      fetchTasks()
    }
  }

  // ── FILTER ─────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => tasks.filter(t =>
    (filterLabel === 'All' || t.label === filterLabel) &&
    (filterPriority === 'all' || t.priority === filterPriority) &&
    (filterStatus === 'all' || t.status === filterStatus) &&
    (search === '' || t.title.toLowerCase().includes(search.toLowerCase()))
  ), [tasks, filterLabel, filterPriority, filterStatus, search])

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.done).length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    highPriority: tasks.filter(t => t.priority === 'high' && !t.done).length,
  }

  const kanbanCols = ['todo', 'in-progress', 'done']

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp 0.4s ease' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>Tasks</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>
            {stats.done}/{stats.total} completed · {stats.inProgress} in progress
          </p>
        </div>
        <div className="flex gap-2">
          <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 3, gap: 2 }}>
            {['list', 'kanban'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, transition: 'all 0.15s',
                textTransform: 'capitalize',
                background: view === v ? 'var(--bg-secondary)' : 'transparent',
                color: view === v ? 'var(--text-primary)' : 'var(--text-muted)',
              }}>{v}</button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setModal('new')}>
            <Plus size={14} /> New Task
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="cards-grid-4" style={{ gap: 12 }}>
        {[
          { label: 'Total', value: stats.total, color: 'var(--text-primary)' },
          { label: 'Completed', value: stats.done, color: 'var(--accent-emerald)' },
          { label: 'In Progress', value: stats.inProgress, color: 'var(--accent-cyan)' },
          { label: 'High Priority', value: stats.highPriority, color: 'var(--accent-rose)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 260 }}>
          <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks…" style={{ paddingLeft: 32, height: 34, fontSize: 13 }} />
        </div>
        <select className="input" value={filterLabel} onChange={e => setFilterLabel(e.target.value)} style={{ width: 120, height: 34, fontSize: 12, cursor: 'pointer' }}>
          {LABELS.map(l => <option key={l}>{l}</option>)}
        </select>
        <select className="input" value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ width: 120, height: 34, fontSize: 12, cursor: 'pointer' }}>
          {PRIORITIES.map(p => <option key={p} value={p}>{p === 'all' ? 'All Priority' : p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>
        <select className="input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 130, height: 34, fontSize: 12, cursor: 'pointer' }}>
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        {(filterLabel !== 'All' || filterPriority !== 'all' || filterStatus !== 'all' || search) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setFilterLabel('All'); setFilterPriority('all'); setFilterStatus('all'); setSearch('') }}>
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Loading / Error */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
          <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite', margin: '0 auto 12px' }} />
          Loading tasks…
        </div>
      )}
      {error && !loading && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--accent-rose)' }}>
          <p style={{ marginBottom: 12 }}>Failed to load tasks: {error}</p>
          <button className="btn btn-ghost btn-sm" onClick={fetchTasks}>Retry</button>
        </div>
      )}

      {/* LIST VIEW */}
      {!loading && !error && view === 'list' && (
        <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Column headers */}
          <div className="flex items-center" style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div style={{ flex: 1, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Task</div>
            <div style={{ width: 90, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Priority</div>
            <div style={{ width: 110, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</div>
            <div style={{ width: 90, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Due</div>
            <div style={{ width: 56 }} />
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
              {tasks.length === 0 ? (
                <>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                  <p>No tasks yet. Create your first one!</p>
                </>
              ) : (
                <p>No tasks match your filters.</p>
              )}
            </div>
          )}

          {filtered.map(task => (
            <div key={task._id} className="flex items-center" style={{
              padding: '11px 20px', borderBottom: '1px solid var(--border)', transition: 'background 0.15s',
              opacity: task.done ? 0.55 : 1,
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Checkbox */}
              <div style={{ marginRight: 12, cursor: 'pointer', flexShrink: 0 }} onClick={() => toggleDone(task)}>
                {task.done
                  ? <CheckCircle2 size={18} color="var(--accent-cyan)" />
                  : <Circle size={18} color="var(--border-bright)" />}
              </div>

              {/* Title + label */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? 'var(--text-muted)' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {task.title}
                </div>
                {task.label && (
                  <span className="tag" style={{ fontSize: 10, background: 'var(--bg-secondary)', color: 'var(--text-muted)', marginTop: 2, display: 'inline-block' }}>{task.label}</span>
                )}
              </div>

              {/* Priority dot */}
              <div style={{ width: 90 }}>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: PRIORITY_BG[task.priority], color: PRIORITY_COLOR[task.priority], fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {task.priority}
                </span>
              </div>

              {/* Status */}
              <div style={{ width: 110 }}>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: task.status === 'in-progress' ? 'var(--accent-cyan-dim)' : 'var(--bg-secondary)', color: STATUS_MAP[task.status]?.color, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                  {STATUS_MAP[task.status]?.label}
                </span>
              </div>

              {/* Due date */}
              <div style={{ width: 90, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {task.due || '—'}
              </div>

              {/* Actions */}
              <div className="flex gap-1" style={{ width: 56 }}>
                <button className="btn btn-ghost btn-icon" style={{ width: 28, height: 28 }} onClick={() => setModal(task)}>
                  <Edit3 size={12} />
                </button>
                <button className="btn btn-ghost btn-icon" style={{ width: 28, height: 28, color: 'var(--accent-rose)' }} onClick={() => deleteTask(task._id)}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KANBAN VIEW */}
      {!loading && !error && view === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, alignItems: 'start' }}>
          {kanbanCols.map(col => {
            const colTasks = filtered.filter(t => t.status === col)
            return (
              <div key={col} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div className="flex items-center justify-between" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_MAP[col].color }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700 }}>{STATUS_MAP[col].label}</span>
                  </div>
                  <span style={{ fontSize: 11, background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 99, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{colTasks.length}</span>
                </div>
                <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 100 }}>
                  {colTasks.map(task => (
                    <div key={task._id} style={{
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderLeft: `3px solid ${PRIORITY_COLOR[task.priority]}`,
                      borderRadius: 10, padding: '12px 14px', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{task.title}</div>
                      {task.description && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{task.description}</div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="tag" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: 10 }}>{task.label}</span>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-icon" style={{ width: 24, height: 24 }} onClick={() => setModal(task)}><Edit3 size={10} /></button>
                          <button className="btn btn-ghost btn-icon" style={{ width: 24, height: 24, color: 'var(--accent-rose)' }} onClick={() => deleteTask(task._id)}><Trash2 size={10} /></button>
                        </div>
                      </div>
                      {task.due && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>Due: {task.due}</div>}
                    </div>
                  ))}
                  <button style={{
                    padding: 8, borderRadius: 8, border: '1px dashed var(--border)', background: 'transparent',
                    cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s',
                  }}
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