import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Users, Plus, Search, Mic, Video, Lock, Globe, Zap,
  Music, Code, BookOpen, Palette, Dumbbell, Coffee, X,
  ArrowRight, Eye, Star, TrendingUp
} from 'lucide-react'

const CATEGORY_ICONS = {
  'Work': Code, 'Study': BookOpen, 'Design': Palette,
  'Health': Dumbbell, 'Music': Music, 'Social': Coffee,
}

const AMBIENT_SOUNDS = ['🌧 Rain', '☕ Café', '🌊 Ocean', '🔥 Fireplace', '🌿 Forest', '🎵 Lo-fi', 'Silent']

const MOCK_ROOMS = [
  { id: 'r1', name: 'Deep Work — Backend APIs', host: 'Arjun S.', hostInitials: 'AS', category: 'Work', members: 4, maxMembers: 8, description: 'Building Node.js microservices. All skill levels welcome.', isPrivate: false, ambient: '☕ Café', tags: ['Node.js', 'Express', 'MongoDB'], color: '#00E5FF', live: true, featured: true },
  { id: 'r2', name: 'Design Sprint — FlowMind UI', host: 'Zara A.', hostInitials: 'ZA', category: 'Design', members: 2, maxMembers: 4, description: 'Working on the new dashboard and focus room UI.', isPrivate: false, ambient: 'Silent', tags: ['Figma', 'UI/UX'], color: '#7C3AED', live: true, featured: false },
  { id: 'r3', name: 'Study Hall — Algorithms', host: 'Marcus L.', hostInitials: 'ML', category: 'Study', members: 7, maxMembers: 12, description: 'LeetCode, CLRS, and competitive programming.', isPrivate: false, ambient: '🌧 Rain', tags: ['DSA', 'Leetcode', 'Python'], color: '#10B981', live: true, featured: true },
  { id: 'r4', name: 'Morning Yoga Flow', host: 'Priya K.', hostInitials: 'PK', category: 'Health', members: 3, maxMembers: 6, description: 'Gentle morning yoga session, all levels welcome!', isPrivate: false, ambient: '🌿 Forest', tags: ['Yoga', 'Wellness'], color: '#F59E0B', live: true, featured: false },
  { id: 'r5', name: 'Lo-fi Beats Study Room', host: 'DJ Flow', hostInitials: 'DF', category: 'Music', members: 11, maxMembers: 20, description: 'Study with ambient lo-fi music. Camera optional.', isPrivate: false, ambient: '🎵 Lo-fi', tags: ['Music', 'Chill', 'Study'], color: '#F43F5E', live: true, featured: false },
  { id: 'r6', name: 'Private Dev Session', host: 'You', hostInitials: 'AS', category: 'Work', members: 1, maxMembers: 3, description: 'Invite-only coding session.', isPrivate: true, ambient: 'Silent', tags: ['Private'], color: '#6B7280', live: true, featured: false },
]

const CATEGORIES = ['All', 'Work', 'Study', 'Design', 'Health', 'Music', 'Social']

function CreateRoomModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: '', category: 'Work', description: '', maxMembers: 8,
    isPrivate: false, ambient: 'Silent', tags: ''
  })

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 520 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Create Focus Room</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Set up your collaborative workspace</p>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Room Name *</label>
            <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Deep Work — My Project" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Category</label>
              <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ cursor: 'pointer' }}>
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Max Members</label>
              <select className="input" value={form.maxMembers} onChange={e => setForm(p => ({ ...p, maxMembers: +e.target.value }))} style={{ cursor: 'pointer' }}>
                {[2,4,6,8,10,12,20].map(n => <option key={n} value={n}>{n} people</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Description</label>
            <textarea className="input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="What will you be working on?" rows={2} style={{ resize: 'none' }} />
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8, fontFamily: 'var(--font-display)' }}>Ambient Sound</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {AMBIENT_SOUNDS.map(s => (
                <button key={s} onClick={() => setForm(p => ({ ...p, ambient: s })) } style={{
                  padding: '5px 12px', borderRadius: 99, border: '1px solid', cursor: 'pointer',
                  fontSize: 12, transition: 'all 0.15s',
                  borderColor: form.ambient === s ? 'var(--accent-cyan)' : 'var(--border)',
                  background: form.ambient === s ? 'var(--accent-cyan-dim)' : 'transparent',
                  color: form.ambient === s ? 'var(--accent-cyan)' : 'var(--text-muted)',
                }}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Tags (comma-separated)</label>
            <input className="input" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="React, Node.js, Python..." />
          </div>

          <div className="flex items-center gap-3" style={{
            padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border)', cursor: 'pointer'
          }} onClick={() => setForm(p => ({ ...p, isPrivate: !p.isPrivate }))}>
            <div style={{
              width: 36, height: 20, borderRadius: 99,
              background: form.isPrivate ? 'var(--accent-cyan)' : 'var(--border-bright)',
              position: 'relative', transition: 'background 0.2s', flexShrink: 0
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 3,
                left: form.isPrivate ? 19 : 3,
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {form.isPrivate ? <Lock size={13} color="var(--accent-cyan)" /> : <Globe size={13} color="var(--text-muted)" />}
                <span style={{ fontSize: 13, fontWeight: 600 }}>{form.isPrivate ? 'Private Room' : 'Public Room'}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{form.isPrivate ? 'Only invited members can join' : 'Anyone can discover and join'}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end" style={{ marginTop: 22 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => form.name.trim() && onCreate({
              ...form,
              id: `r${Date.now()}`,
              members: 1, live: true,
              host: 'You', hostInitials: 'AS',
              color: '#00E5FF',
              tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
              featured: false
            })}
          >
            <Zap size={14} /> Create Room
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FocusRooms() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [rooms, setRooms] = useState(MOCK_ROOMS)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)

  const filtered = rooms.filter(r =>
    (category === 'All' || r.category === category) &&
    (search === '' || r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()))
  )

  const featured = rooms.filter(r => r.featured)
  const totalOnline = rooms.reduce((sum, r) => sum + r.members, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp 0.4s ease' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>Focus Rooms</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>● {totalOnline} people</span> in {rooms.filter(r => r.live).length} active rooms right now
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} /> Create Room
        </button>
      </div>

      {/* Featured rooms */}
      {featured.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Star size={11} color="var(--accent-amber)" fill="var(--accent-amber)" /> Featured
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
            {featured.map(room => {
              const Icon = CATEGORY_ICONS[room.category] || Users
              const occupancy = Math.round(room.members / room.maxMembers * 100)
              return (
                <div key={room.id}
                  style={{
                    background: `linear-gradient(135deg, ${room.color}12 0%, var(--bg-card) 60%)`,
                    border: `1px solid ${room.color}30`,
                    borderRadius: 'var(--radius-xl)',
                    padding: 22,
                    cursor: 'pointer', transition: 'all 0.25s',
                    position: 'relative', overflow: 'hidden'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${room.color}20` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                  onClick={() => navigate(`/rooms/${room.id}`)}
                >
                  {/* Glow orb */}
                  <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${room.color}25 0%, transparent 70%)`, pointerEvents: 'none' }} />

                  <div className="flex items-start justify-between" style={{ marginBottom: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: `${room.color}20`, border: `1px solid ${room.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color={room.color} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-emerald" style={{ animation: 'pulse-glow 2s infinite' }}>● Live</span>
                      {room.isPrivate && <Lock size={12} color="var(--text-muted)" />}
                    </div>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.01em' }}>{room.name}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{room.description}</p>

                  <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                    {room.tags.slice(0, 3).map(t => (
                      <span key={t} className="tag" style={{ background: `${room.color}15`, color: room.color, border: `1px solid ${room.color}25`, fontSize: 10 }}>{t}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div style={{ display: 'flex' }}>
                        {Array.from({ length: Math.min(room.members, 4) }).map((_, i) => (
                          <div key={i} style={{
                            width: 22, height: 22, borderRadius: '50%',
                            background: `hsl(${i * 60 + 180}, 70%, 55%)`,
                            border: '2px solid var(--bg-card)',
                            marginLeft: i > 0 ? -6 : 0, zIndex: 4 - i,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 8, fontWeight: 700, color: 'white'
                          }}>
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{room.members}/{room.maxMembers}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{room.ambient}</span>
                      <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/rooms/${room.id}`) }}>
                        Join <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Occupancy bar */}
                  <div className="progress-bar" style={{ marginTop: 12 }}>
                    <div style={{ height: '100%', width: `${occupancy}%`, borderRadius: 99, background: room.color, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 items-center" style={{ flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search rooms..." style={{ paddingLeft: 32, height: 34, fontSize: 13 }} />
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => {
            const Icon = CATEGORY_ICONS[c]
            return (
              <button key={c} onClick={() => setCategory(c)} style={{
                padding: '5px 12px', borderRadius: 99, border: '1px solid', cursor: 'pointer',
                fontSize: 12, fontWeight: 500, transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 5,
                borderColor: category === c ? 'var(--accent-cyan)' : 'var(--border)',
                background: category === c ? 'var(--accent-cyan-dim)' : 'transparent',
                color: category === c ? 'var(--accent-cyan)' : 'var(--text-muted)',
              }}>
                {Icon && <Icon size={11} />} {c}
              </button>
            )
          })}
        </div>
      </div>

      {/* All rooms grid */}
      <div>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
          All Rooms · {filtered.length}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {filtered.map(room => {
            const Icon = CATEGORY_ICONS[room.category] || Users
            const full = room.members >= room.maxMembers
            return (
              <div key={room.id}
                className="stat-card"
                style={{ cursor: full ? 'not-allowed' : 'pointer', opacity: full ? 0.6 : 1, transition: 'all 0.2s', padding: 18 }}
                onMouseEnter={e => { if (!full) { e.currentTarget.style.borderColor = room.color + '60'; e.currentTarget.style.transform = 'translateY(-2px)' } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
                onClick={() => !full && navigate(`/rooms/${room.id}`)}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${room.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={15} color={room.color} />
                    </div>
                    <span className="tag" style={{ fontSize: 10, background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>{room.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {room.isPrivate && <Lock size={11} color="var(--text-muted)" />}
                    {full ? <span style={{ fontSize: 10, color: 'var(--accent-rose)', fontWeight: 600 }}>Full</span> : <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'var(--accent-emerald)' }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }} />Live</span>}
                  </div>
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 5, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{room.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.5 }}>{room.description}</p>

                <div className="flex items-center justify-between">
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Users size={10} /> {room.members}/{room.maxMembers} · {room.ambient}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Host: {room.host}</span>
                </div>
              </div>
            )
          })}

          {/* Create new card */}
          <div
            className="stat-card"
            style={{ cursor: 'pointer', border: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32, transition: 'all 0.2s', minHeight: 140 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-cyan)'; e.currentTarget.style.background = 'var(--accent-cyan-dim)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)' }}
            onClick={() => setShowModal(true)}
          >
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
              <Plus size={18} color="var(--text-muted)" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Create a Room</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Start your own focus session</div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <CreateRoomModal
          onClose={() => setShowModal(false)}
          onCreate={(room) => { setRooms(prev => [room, ...prev]); setShowModal(false); navigate(`/rooms/${room.id}`) }}
        />
      )}
    </div>
  )
}
