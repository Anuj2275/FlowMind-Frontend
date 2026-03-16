import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
  Users, Settings, Maximize2, Minimize2, Send, ScreenShare,
  ScreenShareOff, Hand, Timer, Zap, ChevronDown, X,
  Music, Volume2, VolumeX, Copy, Check, Pin, MoreHorizontal,
  Smile, Paperclip, Hash, TrendingUp, Target, Coffee
} from 'lucide-react'

const MOCK_PARTICIPANTS = [
  { id: 'p1', name: 'Arjun Sharma', initials: 'AS', color: '#00E5FF', muted: false, videoOff: false, isHost: true, speaking: false },
  { id: 'p2', name: 'Marcus Lee', initials: 'ML', color: '#7C3AED', muted: true, videoOff: false, isHost: false, speaking: false },
  { id: 'p3', name: 'Zara Ahmed', initials: 'ZA', color: '#10B981', muted: false, videoOff: true, isHost: false, speaking: true },
  { id: 'p4', name: 'Priya Kumar', initials: 'PK', color: '#F59E0B', muted: true, videoOff: true, isHost: false, speaking: false },
]

const MOCK_MESSAGES = [
  { id: 1, user: 'Marcus Lee', initials: 'ML', color: '#7C3AED', text: 'Hey everyone, ready to grind? 💪', time: '2:01 PM', type: 'text' },
  { id: 2, user: 'Zara Ahmed', initials: 'ZA', color: '#10B981', text: 'Let\'s go! Working on the focus room UI today', time: '2:02 PM', type: 'text' },
  { id: 3, user: 'System', initials: '', color: '', text: 'Priya Kumar joined the room', time: '2:04 PM', type: 'system' },
  { id: 4, user: 'Priya Kumar', initials: 'PK', color: '#F59E0B', text: 'Hi all! Joining to work on my portfolio project', time: '2:05 PM', type: 'text' },
  { id: 5, user: 'Arjun Sharma', initials: 'AS', color: '#00E5FF', text: 'Nice! I\'m building out the backend socket events. Let\'s sync after 30min?', time: '2:06 PM', type: 'text' },
]

const AMBIENT_OPTIONS = [
  { label: '🌧 Rain', value: 'rain' },
  { label: '☕ Café', value: 'cafe' },
  { label: '🌊 Ocean', value: 'ocean' },
  { label: '🔥 Fireplace', value: 'fire' },
  { label: '🌿 Forest', value: 'forest' },
  { label: '🎵 Lo-fi', value: 'lofi' },
  { label: 'Silent', value: 'silent' },
]

function VideoTile({ participant, isLocal = false, large = false }) {
  const size = large ? { minHeight: 280 } : {}
  return (
    <div style={{
      background: '#070b18',
      border: `1.5px solid ${participant.speaking ? participant.color : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 12,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      aspectRatio: '16/9',
      ...size,
      transition: 'border-color 0.3s ease',
      boxShadow: participant.speaking ? `0 0 20px ${participant.color}30` : 'none',
    }}>
      {/* Fake video noise bg */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 30% 40%, ${participant.color}08 0%, transparent 60%)`,
      }} />

      {participant.videoOff ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: large ? 72 : 48, height: large ? 72 : 48, borderRadius: '50%',
            background: `${participant.color}25`, border: `2px solid ${participant.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: large ? 26 : 16, color: participant.color
          }}>
            {participant.initials}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Camera off</span>
        </div>
      ) : (
        // Simulated video - gradient animation
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${participant.color}10 0%, #0a0f1e 50%, ${participant.color}08 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            width: large ? 80 : 52, height: large ? 80 : 52, borderRadius: '50%',
            background: `linear-gradient(135deg, ${participant.color}40, ${participant.color}15)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: large ? 28 : 18, color: participant.color,
            border: `2px solid ${participant.color}50`
          }}>
            {participant.initials}
          </div>
        </div>
      )}

      {/* Name bar */}
      <div style={{
        position: 'absolute', bottom: 8, left: 8, right: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          borderRadius: 6, padding: '3px 8px',
          fontSize: 11, fontWeight: 600, color: 'white',
          display: 'flex', alignItems: 'center', gap: 5
        }}>
          {participant.speaking && <span style={{ width: 5, height: 5, borderRadius: '50%', background: participant.color, display: 'inline-block', animation: 'pulse-glow 0.8s infinite' }} />}
          {participant.name}{isLocal ? ' (You)' : ''}{participant.isHost ? ' 👑' : ''}
        </div>
        <div style={{
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          borderRadius: 6, padding: '3px 6px', display: 'flex', gap: 4, alignItems: 'center'
        }}>
          {participant.muted && <MicOff size={10} color="#F43F5E" />}
          {participant.videoOff && <VideoOff size={10} color="var(--text-muted)" />}
        </div>
      </div>
    </div>
  )
}

export default function FocusRoom() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [screenShare, setScreenShare] = useState(false)
  const [handRaised, setHandRaised] = useState(false)
  const [panel, setPanel] = useState('chat') // 'chat' | 'participants' | null
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [chatInput, setChatInput] = useState('')
  const [participants] = useState(MOCK_PARTICIPANTS)
  const [ambient, setAmbient] = useState('cafe')
  const [ambientOn, setAmbientOn] = useState(true)
  const [showAmbientPicker, setShowAmbientPicker] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60)
  const [timerTotal] = useState(25 * 60)
  const [copied, setCopied] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [layoutMode, setLayoutMode] = useState('grid') // 'grid' | 'spotlight'
  const chatEndRef = useRef(null)

  // Timer
  useEffect(() => {
    if (!timerRunning) return
    const id = setInterval(() => {
      setTimerSeconds(s => {
        if (s <= 1) { setTimerRunning(false); return 25 * 60 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [timerRunning])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!chatInput.trim()) return
    setMessages(prev => [...prev, {
      id: Date.now(), user: user?.name || 'You', initials: user?.initials || 'AS',
      color: '#00E5FF', text: chatInput.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    }])
    setChatInput('')
  }

  const copyInvite = () => {
    navigator.clipboard.writeText(`https://app.flowmind.io/rooms/${roomId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const timerPct = (timerSeconds / timerTotal) * 100
  const timerMin = Math.floor(timerSeconds / 60)
  const timerSec = timerSeconds % 60
  const RADIUS = 28
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const strokeOffset = CIRCUMFERENCE * (1 - timerPct / 100)

  const roomName = roomId === 'r1' ? 'Deep Work — Backend APIs' :
    roomId === 'r2' ? 'Design Sprint' :
    roomId === 'r3' ? 'Study Hall — Algorithms' : 'Focus Room'

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column', zIndex: 200,
      fontFamily: 'var(--font-body)'
    }}>
      {/* Top bar */}
      <div style={{
        height: 56, borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16,
        background: 'var(--bg-secondary)', flexShrink: 0
      }}>
        {/* Left */}
        <div className="flex items-center gap-3">
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, lineHeight: 1 }}>{roomName}</div>
            <div style={{ fontSize: 10, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block', animation: 'pulse-glow 1.5s infinite' }} />
              Live · {participants.length} participants
            </div>
          </div>
        </div>

        {/* Center: Pomodoro Timer */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '6px 14px', cursor: 'pointer'
          }}>
            <svg width={28} height={28} viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="var(--border)" strokeWidth="4" />
              <circle cx="32" cy="32" r={RADIUS} fill="none"
                stroke={timerRunning ? 'var(--accent-cyan)' : 'var(--border-bright)'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeOffset}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1, color: timerRunning ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                {String(timerMin).padStart(2,'0')}:{String(timerSec).padStart(2,'0')}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>Pomodoro</div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, background: timerRunning ? 'var(--accent-rose)' : 'var(--accent-cyan)', color: timerRunning ? 'white' : 'var(--bg-primary)', transition: 'all 0.15s' }}
              >
                {timerRunning ? 'Pause' : 'Start'}
              </button>
              <button onClick={() => { setTimerSeconds(25*60); setTimerRunning(false) }} style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer', background: 'transparent', fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↺</button>
            </div>
          </div>

          {/* Ambient sound */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAmbientPicker(!showAmbientPicker)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
                background: ambientOn ? 'rgba(16,185,129,0.12)' : 'var(--bg-card)',
                border: `1px solid ${ambientOn ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`,
                borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s', fontSize: 12, color: ambientOn ? 'var(--accent-emerald)' : 'var(--text-muted)'
              }}
            >
              {ambientOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>{AMBIENT_OPTIONS.find(a => a.value === ambient)?.label || 'Sound'}</span>
              <ChevronDown size={10} />
            </button>
            {showAmbientPicker && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: 8, zIndex: 50,
                background: 'var(--bg-card)', border: '1px solid var(--border-bright)',
                borderRadius: 12, padding: 8, minWidth: 140,
                boxShadow: '0 16px 48px rgba(0,0,0,0.5)'
              }}>
                <div style={{ padding: '4px 8px 6px', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ambient Sound</div>
                {AMBIENT_OPTIONS.map(opt => (
                  <div key={opt.value} onClick={() => { setAmbient(opt.value); setAmbientOn(true); setShowAmbientPicker(false) }}
                    style={{ padding: '7px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12, color: ambient === opt.value ? 'var(--accent-emerald)' : 'var(--text-secondary)', background: ambient === opt.value ? 'var(--accent-emerald-dim)' : 'transparent', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.1s' }}
                    onMouseEnter={e => { if (ambient !== opt.value) e.currentTarget.style.background = 'var(--bg-secondary)' }}
                    onMouseLeave={e => { if (ambient !== opt.value) e.currentTarget.style.background = 'transparent' }}
                  >
                    {ambient === opt.value && <Check size={11} />}
                    {opt.label}
                  </div>
                ))}
                <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
                <div onClick={() => { setAmbientOn(false); setShowAmbientPicker(false) }} style={{ padding: '7px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12, color: 'var(--accent-rose)', transition: 'all 0.1s' }}>
                  <VolumeX size={11} style={{ display: 'inline', marginRight: 6 }} /> Turn off
                </div>
              </div>
            )}
          </div>

          {/* Invite */}
          <button onClick={copyInvite} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {copied ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Invite'}
          </button>
        </div>

        {/* Right: Leave */}
        <button onClick={() => navigate('/rooms')} className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <PhoneOff size={13} /> Leave Room
        </button>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Video area */}
        <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden', position: 'relative' }}>
          {/* Layout toggle */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Layout:</div>
            {['grid', 'spotlight'].map(l => (
              <button key={l} onClick={() => setLayoutMode(l)} style={{
                padding: '4px 10px', borderRadius: 6, border: '1px solid', fontSize: 11, cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
                borderColor: layoutMode === l ? 'var(--accent-cyan)' : 'var(--border)',
                background: layoutMode === l ? 'var(--accent-cyan-dim)' : 'transparent',
                color: layoutMode === l ? 'var(--accent-cyan)' : 'var(--text-muted)'
              }}>{l}</button>
            ))}
            <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Hand size={11} color={handRaised ? 'var(--accent-amber)' : 'var(--text-muted)'} />
              {participants.filter(p => p.speaking).map(p => p.name).join(', ')} speaking
            </div>
          </div>

          {/* Grid layout */}
          {layoutMode === 'grid' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: participants.length <= 2 ? '1fr 1fr' : participants.length <= 4 ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
              gap: 12, flex: 1
            }}>
              {participants.map((p, i) => (
                <VideoTile key={p.id} participant={i === 0 ? { ...p, videoOff: !camOn, muted: !micOn } : p} isLocal={i === 0} />
              ))}
            </div>
          )}

          {/* Spotlight layout */}
          {layoutMode === 'spotlight' && (
            <div style={{ display: 'flex', gap: 12, flex: 1, overflow: 'hidden' }}>
              <div style={{ flex: 1 }}>
                <VideoTile participant={{ ...participants[2], speaking: true }} large={true} />
              </div>
              <div style={{ width: 160, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
                {participants.filter((_, i) => i !== 2).map((p, i) => (
                  <div key={p.id} style={{ flexShrink: 0 }}>
                    <VideoTile participant={i === 0 ? { ...p, videoOff: !camOn, muted: !micOn } : p} isLocal={i === 0} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controls bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '12px 20px',
            background: 'rgba(13,17,32,0.9)', backdropFilter: 'blur(12px)',
            borderRadius: 16, border: '1px solid var(--border-bright)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}>
            {/* Mic */}
            <button
              onClick={() => setMicOn(!micOn)}
              style={{
                width: 48, height: 48, borderRadius: 14, border: '1.5px solid',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
                background: micOn ? 'var(--bg-card)' : 'rgba(244,63,94,0.2)',
                borderColor: micOn ? 'var(--border-bright)' : 'var(--accent-rose)',
                color: micOn ? 'var(--text-primary)' : 'var(--accent-rose)'
              }}
              title={micOn ? 'Mute' : 'Unmute'}
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            {/* Cam */}
            <button
              onClick={() => setCamOn(!camOn)}
              style={{
                width: 48, height: 48, borderRadius: 14, border: '1.5px solid',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
                background: camOn ? 'var(--bg-card)' : 'rgba(244,63,94,0.2)',
                borderColor: camOn ? 'var(--border-bright)' : 'var(--accent-rose)',
                color: camOn ? 'var(--text-primary)' : 'var(--accent-rose)'
              }}
              title={camOn ? 'Stop Video' : 'Start Video'}
            >
              {camOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            {/* Screen share */}
            <button
              onClick={() => setScreenShare(!screenShare)}
              style={{
                width: 48, height: 48, borderRadius: 14, border: '1.5px solid',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
                background: screenShare ? 'var(--accent-emerald-dim)' : 'var(--bg-card)',
                borderColor: screenShare ? 'var(--accent-emerald)' : 'var(--border-bright)',
                color: screenShare ? 'var(--accent-emerald)' : 'var(--text-primary)'
              }}
            >
              {screenShare ? <ScreenShareOff size={20} /> : <ScreenShare size={20} />}
            </button>

            {/* Raise hand */}
            <button
              onClick={() => setHandRaised(!handRaised)}
              style={{
                width: 48, height: 48, borderRadius: 14, border: '1.5px solid',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
                background: handRaised ? 'rgba(245,158,11,0.2)' : 'var(--bg-card)',
                borderColor: handRaised ? 'var(--accent-amber)' : 'var(--border-bright)',
                color: handRaised ? 'var(--accent-amber)' : 'var(--text-primary)',
                animation: handRaised ? 'float 1.5s ease-in-out infinite' : 'none'
              }}
            >
              <Hand size={20} />
            </button>

            <div style={{ width: 1, height: 32, background: 'var(--border)', margin: '0 4px' }} />

            {/* Chat toggle */}
            <button
              onClick={() => setPanel(panel === 'chat' ? null : 'chat')}
              style={{
                width: 48, height: 48, borderRadius: 14, border: '1.5px solid',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
                background: panel === 'chat' ? 'var(--accent-violet-dim)' : 'var(--bg-card)',
                borderColor: panel === 'chat' ? 'var(--accent-violet)' : 'var(--border-bright)',
                color: panel === 'chat' ? '#A78BFA' : 'var(--text-primary)',
                position: 'relative'
              }}
            >
              <MessageSquare size={20} />
              {messages.length > 0 && (
                <span style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-violet)', border: '1.5px solid var(--bg-primary)' }} />
              )}
            </button>

            {/* Participants */}
            <button
              onClick={() => setPanel(panel === 'participants' ? null : 'participants')}
              style={{
                width: 48, height: 48, borderRadius: 14, border: '1.5px solid',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
                background: panel === 'participants' ? 'var(--accent-cyan-dim)' : 'var(--bg-card)',
                borderColor: panel === 'participants' ? 'var(--accent-cyan)' : 'var(--border-bright)',
                color: panel === 'participants' ? 'var(--accent-cyan)' : 'var(--text-primary)'
              }}
            >
              <Users size={20} />
            </button>

            <div style={{ width: 1, height: 32, background: 'var(--border)', margin: '0 4px' }} />

            {/* Leave */}
            <button
              onClick={() => navigate('/rooms')}
              style={{
                height: 48, padding: '0 20px', borderRadius: 14, border: 'none',
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, var(--accent-rose), #BE123C)',
                color: 'white', cursor: 'pointer', transition: 'all 0.2s',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
                boxShadow: '0 4px 16px rgba(244,63,94,0.3)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <PhoneOff size={16} /> Leave
            </button>
          </div>
        </div>

        {/* Side panel */}
        {panel && (
          <div style={{
            width: 320, borderLeft: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            display: 'flex', flexDirection: 'column',
            animation: 'fadeIn 0.2s ease'
          }}>
            {/* Panel tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              {[['chat', MessageSquare, 'Chat'], ['participants', Users, 'People']].map(([p, Icon, label]) => (
                <button key={p} onClick={() => setPanel(p)} style={{
                  flex: 1, padding: '13px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  background: panel === p ? 'var(--bg-card)' : 'transparent',
                  color: panel === p ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600,
                  borderBottom: `2px solid ${panel === p ? 'var(--accent-cyan)' : 'transparent'}`,
                  transition: 'all 0.15s'
                }}>
                  <Icon size={14} /> {label}
                  {p === 'participants' && <span style={{ fontSize: 11, background: 'var(--bg-secondary)', borderRadius: 99, padding: '1px 6px', border: '1px solid var(--border)' }}>{participants.length}</span>}
                </button>
              ))}
            </div>

            {/* CHAT */}
            {panel === 'chat' && (
              <>
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
                  {messages.map(msg => (
                    msg.type === 'system' ? (
                      <div key={msg.id} style={{ textAlign: 'center', padding: '6px 16px', fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        {msg.text}
                      </div>
                    ) : (
                      <div key={msg.id} className="chat-message" style={{ padding: '6px 14px', display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${msg.color}22`, color: msg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, fontFamily: 'var(--font-display)', flexShrink: 0, border: `1px solid ${msg.color}30` }}>
                          {msg.initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: msg.color }}>{msg.user}</span>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{msg.time}</span>
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, wordBreak: 'break-word' }}>{msg.text}</div>
                        </div>
                      </div>
                    )
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div style={{ padding: 12, borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, transition: 'border-color 0.2s' }}
                      onFocus={() => {}}
                    >
                      <textarea
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                        placeholder="Message the room..."
                        rows={1}
                        style={{
                          flex: 1, background: 'none', border: 'none', outline: 'none',
                          color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-body)',
                          resize: 'none', lineHeight: 1.5
                        }}
                      />
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, flexShrink: 0 }}>
                        <Smile size={15} />
                      </button>
                    </div>
                    <button
                      onClick={sendMessage}
                      style={{
                        width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer',
                        background: chatInput.trim() ? 'var(--accent-cyan)' : 'var(--border)',
                        color: chatInput.trim() ? 'var(--bg-primary)' : 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s', flexShrink: 0
                      }}
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* PARTICIPANTS */}
            {panel === 'participants' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, padding: '0 4px' }}>
                  In this room · {participants.length}
                </div>
                {participants.map((p, i) => (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                    borderRadius: 10, marginBottom: 4, transition: 'background 0.15s', cursor: 'pointer'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${p.color}20`, border: `1.5px solid ${p.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: p.color }}>
                        {i === 0 ? user?.initials || 'AS' : p.initials}
                      </div>
                      {p.speaking && <div style={{ position: 'absolute', inset: -2, borderRadius: '50%', border: `2px solid ${p.color}`, animation: 'pulse-glow 0.8s infinite' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}>
                        {i === 0 ? user?.name : p.name}
                        {p.isHost && <span style={{ fontSize: 10, color: 'var(--accent-amber)' }}>👑 Host</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.speaking ? '🎤 Speaking' : p.muted ? '🔇 Muted' : 'Active'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                      {p.muted && <MicOff size={12} color="var(--accent-rose)" />}
                      {p.videoOff && <VideoOff size={12} color="var(--text-muted)" />}
                    </div>
                  </div>
                ))}

                {/* Room stats */}
                <div style={{ marginTop: 16, padding: '12px', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Room Stats</div>
                  {[
                    { label: 'Time in room', value: '42 min', icon: Timer },
                    { label: 'Messages sent', value: messages.filter(m => m.type !== 'system').length, icon: MessageSquare },
                    { label: 'Room capacity', value: `${participants.length}/8`, icon: Users },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                      <div className="flex items-center gap-2">
                        <s.icon size={11} color="var(--text-muted)" />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
                      </div>
                      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
