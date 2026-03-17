// src/pages/FocusRoom.jsx
// Full real-time focus room: Socket.IO (JWT-authenticated), WebRTC peer connections,
// real mic/camera toggle, screen share, working chat, Pomodoro timer sync
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users,
  Maximize2, Minimize2, Send, ScreenShare, ScreenShareOff, Hand,
  Timer, Zap, ChevronDown, X, Volume2, VolumeX, Copy, Check,
  Edit3, Smile, Hash,
} from 'lucide-react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

const AMBIENT_OPTIONS = [
  { label: '🌧 Rain', value: 'rain' },
  { label: '☕ Café', value: 'cafe' },
  { label: '🌊 Ocean', value: 'ocean' },
  { label: '🔥 Fireplace', value: 'fire' },
  { label: '🌿 Forest', value: 'forest' },
  { label: '🎵 Lo-fi', value: 'lofi' },
  { label: 'Silent', value: 'silent' },
]

// ── VIDEO TILE ────────────────────────────────────────────────────────────────
function VideoTile({ participant, stream, isLocal = false, large = false }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const color = participant.color || '#00E5FF'
  const size = large ? { minHeight: 280 } : {}

  return (
    <div style={{
      background: '#070b18', border: `1.5px solid ${participant.speaking ? color : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 12, position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      aspectRatio: '16/9', ...size, transition: 'border-color 0.3s ease',
      boxShadow: participant.speaking ? `0 0 20px ${color}30` : 'none',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 40%, ${color}08 0%, transparent 60%)` }} />

      {/* Real video element */}
      {stream && !participant.videoOff ? (
        <video ref={videoRef} autoPlay playsInline muted={isLocal}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: isLocal ? 'scaleX(-1)' : 'none' }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: large ? 72 : 48, height: large ? 72 : 48, borderRadius: '50%',
            background: `${color}25`, border: `2px solid ${color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: large ? 26 : 16, color,
          }}>
            {participant.initials}
          </div>
          {participant.videoOff && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Camera off</span>}
        </div>
      )}

      {/* Name bar */}
      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: 5 }}>
          {participant.speaking && <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block', animation: 'pulse-glow 0.8s infinite' }} />}
          {participant.name}{isLocal ? ' (You)' : ''}{participant.isHost ? ' 👑' : ''}
        </div>
        <div style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', borderRadius: 6, padding: '3px 6px', display: 'flex', gap: 4, alignItems: 'center' }}>
          {participant.muted && <MicOff size={10} color="#F43F5E" />}
          {participant.videoOff && <VideoOff size={10} color="var(--text-muted)" />}
        </div>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function FocusRoom() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Media state
  const [micOn, setMicOn] = useState(false)
  const [camOn, setCamOn] = useState(false)
  const [screenShare, setScreenShare] = useState(false)
  const [handRaised, setHandRaised] = useState(false)
  const [mediaError, setMediaError] = useState('')

  // Room state
  const [room, setRoom] = useState(null)
  const [participants, setParticipants] = useState([])
  const [messages, setMessages] = useState([])
  const [panel, setPanel] = useState('chat')
  const [chatInput, setChatInput] = useState('')
  const [roomLoading, setRoomLoading] = useState(true)

  // Timer
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60)
  const [timerTotal] = useState(25 * 60)

  // UI
  const [ambient, setAmbient] = useState('silent')
  const [ambientOn, setAmbientOn] = useState(false)
  const [showAmbientPicker, setShowAmbientPicker] = useState(false)
  const [copied, setCopied] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [layoutMode, setLayoutMode] = useState('grid')

  // Refs
  const socketRef = useRef(null)
  const localStreamRef = useRef(null)
  const screenStreamRef = useRef(null)
  const peersRef = useRef({})   // socketId → RTCPeerConnection
  const peerStreamsRef = useRef({}) // socketId → MediaStream
  const [peerStreams, setPeerStreams] = useState({})
  const chatEndRef = useRef(null)

  // ── POMODORO TIMER ─────────────────────────────────────────────────────────
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

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // ── LOCAL MEDIA ────────────────────────────────────────────────────────────
  const getLocalStream = useCallback(async (video = false, audio = false) => {
    if (!video && !audio) {
      localStreamRef.current?.getTracks().forEach(t => t.stop())
      localStreamRef.current = null
      return null
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video, audio })
      localStreamRef.current = stream
      setMediaError('')
      return stream
    } catch (err) {
      console.error('Media error:', err)
      if (err.name === 'NotFoundError') {
        setMediaError(`${video ? 'Camera' : 'Microphone'} not found. Check your device.`)
      } else if (err.name === 'NotAllowedError') {
        setMediaError('Permission denied. Please allow camera/microphone access in your browser.')
      } else {
        setMediaError(`Media error: ${err.message}`)
      }
      return null
    }
  }, [])

  // ── TOGGLE MIC ─────────────────────────────────────────────────────────────
  const toggleMic = async () => {
    if (!micOn) {
      // Turn on mic
      try {
        let stream = localStreamRef.current
        if (!stream) {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: camOn })
          localStreamRef.current = stream
          setMediaError('')
        }
        // Unmute audio tracks
        stream.getAudioTracks().forEach(t => { t.enabled = true })
        setMicOn(true)
        socketRef.current?.emit('toggle-media', { roomId, muted: false, videoOff: !camOn })
      } catch (err) {
        if (err.name === 'NotAllowedError') setMediaError('Microphone permission denied.')
        else if (err.name === 'NotFoundError') setMediaError('No microphone found.')
        else setMediaError(`Mic error: ${err.message}`)
      }
    } else {
      // Turn off mic
      localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = false })
      setMicOn(false)
      socketRef.current?.emit('toggle-media', { roomId, muted: true, videoOff: !camOn })
    }
  }

  // ── TOGGLE CAMERA ──────────────────────────────────────────────────────────
  const toggleCam = async () => {
    if (!camOn) {
      try {
        let stream = localStreamRef.current
        if (!stream) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: micOn })
          localStreamRef.current = stream
          setMediaError('')
        } else {
          // Add video track if needed
          const videoTracks = stream.getVideoTracks()
          if (videoTracks.length === 0) {
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
            videoStream.getVideoTracks().forEach(t => stream.addTrack(t))
          } else {
            videoTracks.forEach(t => { t.enabled = true })
          }
        }
        setCamOn(true)
        socketRef.current?.emit('toggle-media', { roomId, muted: !micOn, videoOff: false })
      } catch (err) {
        if (err.name === 'NotAllowedError') setMediaError('Camera permission denied.')
        else if (err.name === 'NotFoundError') setMediaError('No camera found.')
        else setMediaError(`Camera error: ${err.message}`)
      }
    } else {
      localStreamRef.current?.getVideoTracks().forEach(t => { t.enabled = false })
      setCamOn(false)
      socketRef.current?.emit('toggle-media', { roomId, muted: !micOn, videoOff: true })
    }
  }

  // ── SCREEN SHARE ───────────────────────────────────────────────────────────
  const toggleScreenShare = async () => {
    if (!screenShare) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        screenStreamRef.current = stream
        setScreenShare(true)
        // When user stops via browser UI
        stream.getVideoTracks()[0].onended = () => {
          setScreenShare(false)
          screenStreamRef.current = null
        }
        // Replace video track in peer connections
        Object.values(peersRef.current).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video')
          if (sender) sender.replaceTrack(stream.getVideoTracks()[0])
        })
      } catch (err) {
        if (err.name !== 'NotAllowedError') setMediaError('Screen share error: ' + err.message)
      }
    } else {
      screenStreamRef.current?.getTracks().forEach(t => t.stop())
      screenStreamRef.current = null
      setScreenShare(false)
      // Restore camera if on
      if (camOn && localStreamRef.current) {
        const camTrack = localStreamRef.current.getVideoTracks()[0]
        Object.values(peersRef.current).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video')
          if (sender && camTrack) sender.replaceTrack(camTrack)
        })
      }
    }
  }

  // ── WEBRTC PEER ────────────────────────────────────────────────────────────
  const createPeer = useCallback((targetSocketId, polite = false) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    })

    // Add local tracks
    const stream = localStreamRef.current
    if (stream) {
      stream.getTracks().forEach(track => pc.addTrack(track, stream))
    }

    // ICE candidates → send via socket
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socketRef.current?.emit('webrtc-ice', { roomId, to: targetSocketId, candidate })
      }
    }

    // Remote stream → store and trigger re-render
    pc.ontrack = ({ streams }) => {
      if (streams[0]) {
        peerStreamsRef.current[targetSocketId] = streams[0]
        setPeerStreams(prev => ({ ...prev, [targetSocketId]: streams[0] }))
      }
    }

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        delete peersRef.current[targetSocketId]
        delete peerStreamsRef.current[targetSocketId]
        setPeerStreams(prev => { const n = { ...prev }; delete n[targetSocketId]; return n })
      }
    }

    peersRef.current[targetSocketId] = pc
    return pc
  }, [roomId])

  // ── SOCKET ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem('fm_token')

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join-room', { roomId })
    })

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message)
      setRoomLoading(false)
    })

    // Full room state on join
    socket.on('room-state', ({ room: roomData, participants: parts, messages: msgs }) => {
      setRoom(roomData)
      setParticipants(parts || [])
      setMessages((msgs || []).map((m, i) => ({ ...m, id: m._id || i })))
      setRoomLoading(false)
    })

    // New participant
    socket.on('participant-joined', ({ participant }) => {
      setParticipants(prev => {
        if (prev.some(p => p.userId === participant.userId)) return prev
        return [...prev, participant]
      })
      // Initiate WebRTC offer to new participant
      setTimeout(async () => {
        const pc = createPeer(participant.socketId, false)
        try {
          const offer = await pc.createOffer()
          await pc.setLocalDescription(offer)
          socket.emit('webrtc-offer', { roomId, to: participant.socketId, offer })
        } catch (err) {
          console.error('WebRTC offer error:', err)
        }
      }, 500)
    })

    // Participant left
    socket.on('participant-left', ({ userId }) => {
      setParticipants(prev => prev.filter(p => p.userId?.toString() !== userId?.toString()))
    })

    // New chat message
    socket.on('new-message', ({ message }) => {
      setMessages(prev => {
        if (prev.some(m => m._id && m._id === message._id)) return prev
        return [...prev, { ...message, id: message._id || Date.now() }]
      })
    })

    // Media updated
    socket.on('media-updated', ({ userId, muted, videoOff }) => {
      setParticipants(prev => prev.map(p =>
        p.userId?.toString() === userId?.toString() ? { ...p, muted, videoOff } : p
      ))
    })

    // Hand raised/lowered
    socket.on('hand-raised', ({ userId, name }) => {
      setMessages(prev => [...prev, {
        id: Date.now(), user: 'System', type: 'system',
        text: `✋ ${name} raised their hand`, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      }])
    })

    // Timer sync from host
    socket.on('timer-started', ({ duration, startedAt }) => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      setTimerSeconds(Math.max(0, duration - elapsed))
      setTimerRunning(true)
    })
    socket.on('timer-stopped', () => setTimerRunning(false))

    // Kicked
    socket.on('kicked', () => {
      alert('You have been removed from this room.')
      navigate('/rooms')
    })

    // ── WebRTC signaling ───────────────────────────────────────────────────
    socket.on('webrtc-offer', async ({ from, offer }) => {
      let pc = peersRef.current[from]
      if (!pc) pc = createPeer(from, true)
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        socket.emit('webrtc-answer', { roomId, to: from, answer })
      } catch (err) {
        console.error('WebRTC answer error:', err)
      }
    })

    socket.on('webrtc-answer', async ({ from, answer }) => {
      const pc = peersRef.current[from]
      if (pc && pc.signalingState !== 'stable') {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer))
        } catch (err) {
          console.error('Set remote desc error:', err)
        }
      }
    })

    socket.on('webrtc-ice', async ({ from, candidate }) => {
      const pc = peersRef.current[from]
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate))
        } catch (err) {
          console.error('ICE candidate error:', err)
        }
      }
    })

    return () => {
      socket.emit('leave-room', { roomId })
      socket.disconnect()
      // Clean up media
      localStreamRef.current?.getTracks().forEach(t => t.stop())
      screenStreamRef.current?.getTracks().forEach(t => t.stop())
      Object.values(peersRef.current).forEach(pc => pc.close())
    }
  }, [roomId, user, createPeer, navigate])

  // ── SEND MESSAGE ───────────────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    if (!chatInput.trim() || !socketRef.current) return
    socketRef.current.emit('send-message', { roomId, text: chatInput.trim() })
    setChatInput('')
  }, [chatInput, roomId])

  // ── RAISE HAND ─────────────────────────────────────────────────────────────
  const toggleHand = () => {
    const newRaised = !handRaised
    setHandRaised(newRaised)
    socketRef.current?.emit(newRaised ? 'raise-hand' : 'lower-hand', { roomId })
  }

  // ── LEAVE ──────────────────────────────────────────────────────────────────
  const leaveRoom = () => {
    socketRef.current?.emit('leave-room', { roomId })
    navigate('/rooms')
  }

  const copyInvite = () => {
    navigator.clipboard.writeText(`${window.location.origin}/rooms/${roomId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Timer display
  const timerPct = (timerSeconds / timerTotal) * 100
  const timerMin = Math.floor(timerSeconds / 60)
  const timerSec = timerSeconds % 60
  const RADIUS = 28
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const strokeOffset = CIRCUMFERENCE * (1 - timerPct / 100)

  // Self participant
  const selfParticipant = participants.find(p => p.userId?.toString() === user?._id?.toString()) || {
    name: user?.name || 'You', initials: user?.initials || '?', color: '#00E5FF',
    muted: !micOn, videoOff: !camOn, speaking: false,
  }

  const roomName = room?.name || 'Focus Room'

  if (roomLoading) return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, zIndex: 200 }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite' }} />
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-secondary)' }}>Connecting to room…</div>
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', zIndex: 200, fontFamily: 'var(--font-body)' }}>

      {/* ── TOP BAR ── */}
      <div style={{ height: 56, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, background: 'var(--bg-secondary)', flexShrink: 0 }}>
        {/* Left: room info */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '6px 14px', cursor: 'pointer' }}>
            <svg width={28} height={28} viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="var(--border)" strokeWidth="4" />
              <circle cx="32" cy="32" r={RADIUS} fill="none" stroke={timerRunning ? 'var(--accent-cyan)' : 'var(--border-bright)'} strokeWidth="4"
                strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeOffset}
                style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1, color: timerRunning ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                {String(timerMin).padStart(2, '0')}:{String(timerSec).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>Pomodoro</div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => {
                const newRunning = !timerRunning
                setTimerRunning(newRunning)
                if (newRunning) socketRef.current?.emit('start-timer', { roomId, duration: timerSeconds })
                else socketRef.current?.emit('stop-timer', { roomId })
              }} style={{
                padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer',
                fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700,
                background: timerRunning ? 'var(--accent-rose)' : 'var(--accent-cyan)',
                color: timerRunning ? 'white' : 'var(--bg-primary)', transition: 'all 0.15s',
              }}>
                {timerRunning ? 'Pause' : 'Start'}
              </button>
              <button onClick={() => { setTimerSeconds(25 * 60); setTimerRunning(false); socketRef.current?.emit('stop-timer', { roomId }) }} style={{
                width: 24, height: 24, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer',
                background: 'transparent', fontSize: 10, color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>↺</button>
            </div>
          </div>

          {/* Ambient sound */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowAmbientPicker(!showAmbientPicker)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
              background: ambientOn ? 'rgba(16,185,129,0.12)' : 'var(--bg-card)',
              border: `1px solid ${ambientOn ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`,
              borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
              fontSize: 12, color: ambientOn ? 'var(--accent-emerald)' : 'var(--text-muted)',
            }}>
              {ambientOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>{AMBIENT_OPTIONS.find(a => a.value === ambient)?.label || 'Sound'}</span>
              <ChevronDown size={10} />
            </button>
            {showAmbientPicker && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, zIndex: 50, background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: 12, padding: 8, minWidth: 140, boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}>
                {AMBIENT_OPTIONS.map(opt => (
                  <div key={opt.value} onClick={() => { setAmbient(opt.value); setAmbientOn(opt.value !== 'silent'); setShowAmbientPicker(false) }} style={{
                    padding: '7px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12,
                    color: ambient === opt.value ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                    background: ambient === opt.value ? 'rgba(16,185,129,0.1)' : 'transparent',
                    transition: 'all 0.1s',
                  }}>
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Copy invite */}
          <button onClick={copyInvite} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)', transition: 'all 0.15s' }}>
            {copied ? <><Check size={12} color="var(--accent-emerald)" /> Copied!</> : <><Copy size={12} /> Invite</>}
          </button>

          {/* Focus mode */}
          <button onClick={() => setFocusMode(!focusMode)} className="btn btn-ghost btn-icon">
            {focusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* ── MEDIA ERROR BANNER ── */}
      {mediaError && (
        <div style={{ background: 'rgba(244,63,94,0.12)', borderBottom: '1px solid rgba(244,63,94,0.25)', padding: '8px 20px', fontSize: 12, color: 'var(--accent-rose)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠️ {mediaError}</span>
          <button onClick={() => setMediaError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-rose)' }}><X size={14} /></button>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Video grid */}
        <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
          <div style={{
            flex: 1, display: 'grid', gap: 12,
            gridTemplateColumns: participants.length <= 1 ? '1fr' : participants.length <= 4 ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
            alignContent: 'start',
          }}>
            {/* Local tile */}
            <VideoTile
              participant={{ ...selfParticipant, muted: !micOn, videoOff: !camOn, speaking: false, isHost: room?.host?.toString() === user?._id?.toString() }}
              stream={screenShare ? screenStreamRef.current : localStreamRef.current}
              isLocal={true}
              large={participants.length === 0}
            />
            {/* Remote peers */}
            {participants
              .filter(p => p.userId?.toString() !== user?._id?.toString())
              .map(p => (
                <VideoTile
                  key={p.userId}
                  participant={p}
                  stream={peerStreams[p.socketId]}
                  isLocal={false}
                />
              ))}
          </div>

          {/* ── CONTROLS BAR ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '10px 0' }}>
            {/* Mic */}
            <button onClick={toggleMic} style={{
              width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              background: micOn ? 'rgba(0,229,255,0.15)' : 'rgba(244,63,94,0.15)',
              boxShadow: micOn ? '0 0 20px rgba(0,229,255,0.2)' : 'none',
            }}>
              {micOn ? <Mic size={20} color="var(--accent-cyan)" /> : <MicOff size={20} color="var(--accent-rose)" />}
            </button>

            {/* Camera */}
            <button onClick={toggleCam} style={{
              width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              background: camOn ? 'rgba(0,229,255,0.15)' : 'rgba(244,63,94,0.15)',
              boxShadow: camOn ? '0 0 20px rgba(0,229,255,0.2)' : 'none',
            }}>
              {camOn ? <Video size={20} color="var(--accent-cyan)" /> : <VideoOff size={20} color="var(--accent-rose)" />}
            </button>

            {/* Screen share */}
            <button onClick={toggleScreenShare} style={{
              width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              background: screenShare ? 'rgba(124,58,237,0.2)' : 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}>
              {screenShare ? <ScreenShareOff size={20} color="#A78BFA" /> : <ScreenShare size={20} color="var(--text-secondary)" />}
            </button>

            {/* Raise hand */}
            <button onClick={toggleHand} style={{
              width: 48, height: 48, borderRadius: '50%', border: '1px solid var(--border)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              background: handRaised ? 'rgba(245,158,11,0.15)' : 'var(--bg-card)',
            }}>
              <Hand size={20} color={handRaised ? 'var(--accent-amber)' : 'var(--text-secondary)'} />
            </button>

            {/* Chat toggle */}
            <button onClick={() => setPanel(p => p === 'chat' ? null : 'chat')} style={{
              width: 48, height: 48, borderRadius: '50%', border: '1px solid var(--border)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              background: panel === 'chat' ? 'var(--accent-cyan-dim)' : 'var(--bg-card)',
              position: 'relative',
            }}>
              <MessageSquare size={20} color={panel === 'chat' ? 'var(--accent-cyan)' : 'var(--text-secondary)'} />
              {messages.filter(m => m.type !== 'system').length > 0 && (
                <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-cyan)', border: '1.5px solid var(--bg-primary)' }} />
              )}
            </button>

            {/* Participants toggle */}
            <button onClick={() => setPanel(p => p === 'participants' ? null : 'participants')} style={{
              width: 48, height: 48, borderRadius: '50%', border: '1px solid var(--border)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              background: panel === 'participants' ? 'var(--accent-violet-dim)' : 'var(--bg-card)',
            }}>
              <Users size={20} color={panel === 'participants' ? '#A78BFA' : 'var(--text-secondary)'} />
            </button>

            {/* Leave */}
            <button onClick={leaveRoom} style={{
              width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, var(--accent-rose), #BE123C)',
              boxShadow: '0 4px 16px rgba(244,63,94,0.4)', transition: 'all 0.2s',
            }}>
              <PhoneOff size={20} color="white" />
            </button>
          </div>
        </div>

        {/* ── SIDE PANEL ── */}
        {panel && (
          <div style={{ width: 320, borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', flexShrink: 0 }}>
            {/* Panel header */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 4 }}>
              {[{ key: 'chat', icon: MessageSquare, label: 'Chat' }, { key: 'participants', icon: Users, label: 'People' }].map(({ key, icon: Icon, label }) => (
                <button key={key} onClick={() => setPanel(key)} style={{
                  flex: 1, padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: panel === key ? 'var(--bg-card)' : 'transparent',
                  color: panel === key ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s',
                }}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            {/* CHAT */}
            {panel === 'chat' && (
              <>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                  {messages.length === 0 && (
                    <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                      No messages yet.<br />Say hello! 👋
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={msg.id || i} className="chat-message" style={{ padding: '6px 14px' }}>
                      {msg.type === 'system' ? (
                        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', padding: '4px 0' }}>{msg.text}</div>
                      ) : (
                        <>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${msg.color || '#00E5FF'}20`, border: `1.5px solid ${msg.color || '#00E5FF'}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 10, color: msg.color || '#00E5FF', flexShrink: 0 }}>
                            {msg.initials || msg.user?.[0]?.toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: msg.color || 'var(--accent-cyan)' }}>{msg.user}</span>
                              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{msg.time}</span>
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, wordBreak: 'break-word' }}>{msg.text}</div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <textarea value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                      placeholder="Message the room…" rows={1}
                      style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-body)', resize: 'none', lineHeight: 1.5 }} />
                  </div>
                  <button onClick={sendMessage} style={{
                    width: 36, height: 36, borderRadius: 10, border: 'none', cursor: chatInput.trim() ? 'pointer' : 'default',
                    background: chatInput.trim() ? 'var(--accent-cyan)' : 'var(--border)',
                    color: chatInput.trim() ? 'var(--bg-primary)' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0,
                  }}>
                    <Send size={15} />
                  </button>
                </div>
              </>
            )}

            {/* PARTICIPANTS */}
            {panel === 'participants' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, padding: '0 4px' }}>
                  In this room · {participants.length + 1}
                </div>
                {/* Self */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, marginBottom: 4 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${selfParticipant.color}20`, border: `1.5px solid ${selfParticipant.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: selfParticipant.color }}>
                    {user?.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name} <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>(You)</span></div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{micOn ? '🎤 Live' : '🔇 Muted'}</div>
                  </div>
                  <div className="flex gap-1">
                    {!micOn && <MicOff size={12} color="var(--accent-rose)" />}
                    {!camOn && <VideoOff size={12} color="var(--text-muted)" />}
                  </div>
                </div>
                {/* Others */}
                {participants.filter(p => p.userId?.toString() !== user?._id?.toString()).map(p => (
                  <div key={p.userId} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, marginBottom: 4, transition: 'background 0.15s', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${p.color}20`, border: `1.5px solid ${p.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: p.color }}>
                        {p.initials}
                      </div>
                      {p.speaking && <div style={{ position: 'absolute', inset: -2, borderRadius: '50%', border: `2px solid ${p.color}`, animation: 'pulse-glow 0.8s infinite' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.name}{p.isHost && ' 👑'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {p.speaking ? '🎤 Speaking' : p.muted ? '🔇 Muted' : 'Active'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                      {p.muted && <MicOff size={12} color="var(--accent-rose)" />}
                      {p.videoOff && <VideoOff size={12} color="var(--text-muted)" />}
                    </div>
                  </div>
                ))}

                {/* Room stats */}
                <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Room Stats</div>
                  {[
                    { label: 'Messages', value: messages.filter(m => m.type !== 'system').length },
                    { label: 'Capacity', value: `${participants.length + 1}/${room?.maxMembers || 8}` },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
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