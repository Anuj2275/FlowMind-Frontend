import { useState, useMemo } from 'react'
import {
  ChevronLeft, ChevronRight, Plus, X, Clock, Tag,
  Calendar, Edit3, Trash2, RepeatIcon, Bell, Check
} from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameMonth, isSameDay, getDay, isToday, addDays } from 'date-fns'

const COLORS = [
  { key: 'cyan', label: 'Cyan', value: '#00E5FF', bg: 'rgba(0,229,255,0.12)' },
  { key: 'violet', label: 'Violet', value: '#7C3AED', bg: 'rgba(124,58,237,0.15)' },
  { key: 'emerald', label: 'Emerald', value: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  { key: 'amber', label: 'Amber', value: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  { key: 'rose', label: 'Rose', value: '#F43F5E', bg: 'rgba(244,63,94,0.12)' },
]

const INITIAL_EVENTS = [
  { id: 1, title: 'Team Standup', date: format(new Date(), 'yyyy-MM-dd'), time: '09:00', duration: 30, color: 'cyan', category: 'Meeting', notes: 'Daily sync with backend team', recurring: 'daily' },
  { id: 2, title: 'Deep Work — FlowMind UI', date: format(new Date(), 'yyyy-MM-dd'), time: '10:00', duration: 120, color: 'violet', category: 'Work', notes: 'Build the schedule and rooms pages', recurring: 'none' },
  { id: 3, title: 'Lunch Break', date: format(new Date(), 'yyyy-MM-dd'), time: '13:00', duration: 60, color: 'emerald', category: 'Personal', notes: '', recurring: 'daily' },
  { id: 4, title: 'DSA Practice', date: format(new Date(), 'yyyy-MM-dd'), time: '15:00', duration: 90, color: 'amber', category: 'Study', notes: 'LeetCode — trees and graphs', recurring: 'none' },
  { id: 5, title: 'Code Review Session', date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), time: '11:00', duration: 60, color: 'rose', category: 'Work', notes: 'Review auth module PRs', recurring: 'none' },
  { id: 6, title: 'Evening Run', date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), time: '18:00', duration: 45, color: 'emerald', category: 'Health', notes: '5km easy pace', recurring: 'daily' },
  { id: 7, title: 'System Design Study', date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), time: '14:00', duration: 90, color: 'violet', category: 'Study', notes: 'Distributed systems chapter', recurring: 'none' },
  { id: 8, title: 'Weekly Retrospective', date: format(addDays(new Date(), 3), 'yyyy-MM-dd'), time: '17:00', duration: 60, color: 'cyan', category: 'Meeting', notes: '', recurring: 'weekly' },
]

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7) // 7am–10pm
const CATEGORIES = ['Work', 'Study', 'Meeting', 'Personal', 'Health', 'Other']

function EventModal({ event, selectedDate, onSave, onClose }) {
  const [form, setForm] = useState(event || {
    title: '', date: format(selectedDate, 'yyyy-MM-dd'), time: '09:00',
    duration: 60, color: 'cyan', category: 'Work', notes: '', recurring: 'none'
  })

  const colorObj = COLORS.find(c => c.key === form.color) || COLORS[0]

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>
            {event ? 'Edit Event' : 'New Event'}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Event Title *</label>
            <input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="What's this event?" />
          </div>

          {/* Date + Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Date</label>
              <input type="date" className="input" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Start Time</label>
              <input type="time" className="input" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Duration (min)</label>
              <select className="input" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: +e.target.value }))} style={{ cursor: 'pointer' }}>
                {[15,30,45,60,90,120,180,240].map(d => <option key={d} value={d}>{d >= 60 ? `${d/60}h${d%60?` ${d%60}m`:''}` : `${d}m`}</option>)}
              </select>
            </div>
          </div>

          {/* Category + Recurring */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Category</label>
              <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ cursor: 'pointer' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Recurring</label>
              <select className="input" value={form.recurring} onChange={e => setForm(p => ({ ...p, recurring: e.target.value }))} style={{ cursor: 'pointer' }}>
                <option value="none">No repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8, fontFamily: 'var(--font-display)' }}>Color</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <div key={c.key} onClick={() => setForm(p => ({ ...p, color: c.key }))} style={{
                  width: 28, height: 28, borderRadius: '50%', background: c.value,
                  cursor: 'pointer', transition: 'all 0.15s',
                  border: form.color === c.key ? `3px solid white` : '3px solid transparent',
                  boxShadow: form.color === c.key ? `0 0 0 2px ${c.value}` : 'none',
                  transform: form.color === c.key ? 'scale(1.15)' : 'scale(1)',
                }} />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Notes</label>
            <textarea className="input" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes..." rows={2} style={{ resize: 'none' }} />
          </div>
        </div>

        <div className="flex gap-3 justify-end" style={{ marginTop: 22 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => form.title.trim() && onSave({ ...form, id: event?.id || Date.now() })}>
            {event ? 'Save changes' : 'Create event'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Schedule() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState(INITIAL_EVENTS)
  const [modal, setModal] = useState(null)
  const [view, setView] = useState('month') // 'month' | 'day'

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start, end })
    const startPad = getDay(start)
    const paddedStart = Array(startPad).fill(null)
    return [...paddedStart, ...days]
  }, [currentMonth])

  const eventsForDate = (date) => events.filter(e => e.date === format(date, 'yyyy-MM-dd'))
  const selectedEvents = eventsForDate(selectedDate).sort((a, b) => a.time.localeCompare(b.time))

  const saveEvent = (ev) => {
    setEvents(prev => prev.some(e => e.id === ev.id) ? prev.map(e => e.id === ev.id ? ev : e) : [...prev, ev])
    setModal(null)
  }
  const deleteEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id))

  const getColor = (key) => COLORS.find(c => c.key === key) || COLORS[0]

  // Day view: timeline
  const timeToMinutes = (t) => { const [h,m] = t.split(':').map(Number); return h * 60 + m }
  const TIMELINE_START = 7 * 60 // 7am
  const TIMELINE_PIXELS_PER_MINUTE = 1.2

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp 0.4s ease' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>Schedule</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>
            {format(selectedDate, 'EEEE, MMMM d')} · {selectedEvents.length} events
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 3, gap: 2 }}>
            {['month', 'day'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, transition: 'all 0.15s', textTransform: 'capitalize',
                background: view === v ? 'var(--bg-secondary)' : 'transparent',
                color: view === v ? 'var(--text-primary)' : 'var(--text-muted)',
              }}>{v}</button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setModal('new')}>
            <Plus size={14} /> Add Event
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: view === 'month' ? '1fr 320px' : '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* MAIN: Month calendar OR Day timeline */}
        <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Calendar header */}
          <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft size={16} />
            </button>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>
              {format(currentMonth, 'MMMM yyyy')}
            </div>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight size={16} />
            </button>
          </div>

          {view === 'month' && (
            <div style={{ padding: '12px 16px 16px' }}>
              {/* Day labels */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 8 }}>
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 0' }}>{d}</div>
                ))}
              </div>

              {/* Days grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
                {monthDays.map((day, i) => {
                  if (!day) return <div key={`empty-${i}`} />
                  const dayEvents = eventsForDate(day)
                  const isSelected = isSameDay(day, selectedDate)
                  const isCurrentMonth = isSameMonth(day, currentMonth)
                  const today = isToday(day)

                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => { setSelectedDate(day); setView('day') }}
                      style={{
                        padding: '6px 4px 4px',
                        borderRadius: 10,
                        cursor: 'pointer',
                        background: isSelected ? 'var(--accent-violet)' : today ? 'var(--accent-cyan-dim)' : 'transparent',
                        border: `1px solid ${isSelected ? 'var(--accent-violet)' : today ? 'rgba(0,229,255,0.2)' : 'transparent'}`,
                        opacity: isCurrentMonth ? 1 : 0.3,
                        transition: 'all 0.15s',
                        minHeight: 52,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-card-hover)' }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = today ? 'var(--accent-cyan-dim)' : 'transparent' }}
                    >
                      <span style={{
                        fontSize: 13, fontWeight: today || isSelected ? 700 : 400,
                        color: isSelected ? 'white' : today ? 'var(--accent-cyan)' : 'var(--text-primary)',
                        width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
                      }}>
                        {format(day, 'd')}
                      </span>
                      {/* Event dots */}
                      <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {dayEvents.slice(0, 3).map(ev => (
                          <div key={ev.id} style={{ width: 5, height: 5, borderRadius: '50%', background: getColor(ev.color).value }} />
                        ))}
                        {dayEvents.length > 3 && <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>+{dayEvents.length - 3}</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* DAY TIMELINE VIEW */}
          {view === 'day' && (
            <div style={{ padding: '12px 0', height: 600, overflowY: 'auto', position: 'relative' }}>
              <div style={{ padding: '0 0 0 56px', position: 'relative' }}>
                {HOURS.map(h => (
                  <div key={h} style={{ display: 'flex', alignItems: 'flex-start', height: 60, borderTop: '1px solid var(--border)', position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: -56, top: -9,
                      fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
                      width: 48, textAlign: 'right', paddingRight: 8
                    }}>
                      {h === 12 ? '12 PM' : h < 12 ? `${h} AM` : `${h-12} PM`}
                    </span>
                  </div>
                ))}

                {/* Events as blocks */}
                {selectedEvents.map(ev => {
                  const startMin = timeToMinutes(ev.time) - TIMELINE_START
                  const topPx = startMin * TIMELINE_PIXELS_PER_MINUTE * (60 / 60) + (startMin / 60) * 60
                  const heightPx = Math.max(ev.duration * TIMELINE_PIXELS_PER_MINUTE * (60/60), 28)
                  const col = getColor(ev.color)
                  return (
                    <div key={ev.id} style={{
                      position: 'absolute',
                      top: topPx,
                      left: 4,
                      right: 16,
                      height: heightPx,
                      background: col.bg,
                      border: `1px solid ${col.value}40`,
                      borderLeft: `3px solid ${col.value}`,
                      borderRadius: 8,
                      padding: '5px 10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      zIndex: 10,
                      overflow: 'hidden'
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scaleX(1.01)'; e.currentTarget.style.boxShadow = `0 4px 16px ${col.value}30` }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                      onClick={() => setModal(ev)}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: col.value, fontFamily: 'var(--font-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</div>
                      {heightPx > 36 && (
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                          {ev.time} · {ev.duration >= 60 ? `${Math.floor(ev.duration/60)}h${ev.duration%60 ? ` ${ev.duration%60}m` : ''}` : `${ev.duration}m`}
                          {ev.recurring !== 'none' && ' · 🔁'}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Current time indicator */}
                {isToday(selectedDate) && (() => {
                  const now = new Date()
                  const nowMin = now.getHours() * 60 + now.getMinutes() - TIMELINE_START
                  if (nowMin < 0) return null
                  const topPx = (nowMin / 60) * 60
                  return (
                    <div style={{ position: 'absolute', top: topPx, left: 0, right: 0, zIndex: 20, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-rose)', flexShrink: 0, marginLeft: -4 }} />
                      <div style={{ flex: 1, height: 1.5, background: 'var(--accent-rose)' }} />
                    </div>
                  )
                })()}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Selected day events */}
          <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="flex items-center justify-between" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700 }}>
                  {format(selectedDate, 'EEE, MMM d')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{selectedEvents.length} events</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal('new')}>
                <Plus size={12} />
              </button>
            </div>

            <div style={{ padding: '8px 0', maxHeight: 320, overflowY: 'auto' }}>
              {selectedEvents.length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  No events. Click + to add one.
                </div>
              ) : selectedEvents.map(ev => {
                const col = getColor(ev.color)
                return (
                  <div key={ev.id} style={{
                    padding: '10px 14px',
                    margin: '0 6px 6px',
                    borderRadius: 10,
                    background: col.bg,
                    border: `1px solid ${col.value}25`,
                    borderLeft: `3px solid ${col.value}`,
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: col.value, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={9} />
                          {ev.time} · {ev.duration >= 60 ? `${Math.floor(ev.duration/60)}h${ev.duration%60 ? ` ${ev.duration%60}m` : ''}` : `${ev.duration}m`}
                          {ev.recurring !== 'none' && <><RepeatIcon size={9} /> {ev.recurring}</>}
                        </div>
                        {ev.notes && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.notes}</div>}
                      </div>
                      <div className="flex gap-1">
                        <button className="btn btn-ghost btn-icon" style={{ width: 24, height: 24 }} onClick={e => { e.stopPropagation(); setModal(ev) }}><Edit3 size={10} /></button>
                        <button className="btn btn-ghost btn-icon" style={{ width: 24, height: 24, color: 'var(--accent-rose)' }} onClick={e => { e.stopPropagation(); deleteEvent(ev.id) }}><Trash2 size={10} /></button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming week mini */}
          <div className="stat-card">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={13} color="var(--accent-cyan)" /> Upcoming 7 Days
            </div>
            {Array.from({ length: 7 }, (_, i) => addDays(new Date(), i)).map(day => {
              const dayEvs = eventsForDate(day)
              if (dayEvs.length === 0 && i > 2) return null
              return (
                <div key={day.toISOString()} className="flex items-center gap-3" style={{ marginBottom: 8, cursor: 'pointer' }} onClick={() => { setSelectedDate(day); setView('day') }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: isToday(day) ? 'var(--accent-cyan-dim)' : 'var(--bg-secondary)',
                    border: `1px solid ${isToday(day) ? 'rgba(0,229,255,0.2)' : 'var(--border)'}`,
                    flexShrink: 0
                  }}>
                    <div style={{ fontSize: 8, fontFamily: 'var(--font-display)', fontWeight: 700, color: isToday(day) ? 'var(--accent-cyan)' : 'var(--text-muted)', textTransform: 'uppercase' }}>{format(day, 'EEE')}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: isToday(day) ? 'var(--accent-cyan)' : 'var(--text-primary)', lineHeight: 1 }}>{format(day, 'd')}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {dayEvs.length === 0 ? (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No events</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {dayEvs.slice(0, 2).map(ev => (
                          <div key={ev.id} className="flex items-center gap-2">
                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: getColor(ev.color).value, flexShrink: 0 }} />
                            <span style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{ev.title}</span>
                          </div>
                        ))}
                        {dayEvs.length > 2 && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{dayEvs.length - 2} more</div>}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Category breakdown */}
          <div className="stat-card">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Tag size={13} color="var(--accent-violet)" /> By Category
            </div>
            {CATEGORIES.map(cat => {
              const count = events.filter(e => e.category === cat).length
              if (count === 0) return null
              const pct = Math.round(count / events.length * 100)
              return (
                <div key={cat} style={{ marginBottom: 8 }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{cat}</span>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{count}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {modal && (
        <EventModal
          event={modal === 'new' ? null : modal}
          selectedDate={selectedDate}
          onSave={saveEvent}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
