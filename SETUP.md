# FlowMind — Setup Guide

## Prerequisites
- Node.js 18+ 
- npm or yarn

## Quick Start

```bash
# 1. Navigate into the project
cd flowmind

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

## Build for Production
```bash
npm run build
npm run preview
```

## Connecting to Your Backend

All API stubs are in `src/context/AuthContext.jsx`.

Replace the mock login/register functions with real fetch calls:

```js
// Login — replace mock with:
const res = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
const data = await res.json()
localStorage.setItem('fm_token', data.token)

// For protected routes, include JWT:
headers: { Authorization: `Bearer ${localStorage.getItem('fm_token')}` }
```

## Socket.IO Integration

Install socket.io-client:
```bash
npm install socket.io-client
```

Create `src/context/SocketContext.jsx`:
```js
import { io } from 'socket.io-client'
export const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('fm_token') }
})
```

Then in FocusRoom.jsx, use:
```js
socket.emit('join-room', roomId)
socket.on('chat-message', (msg) => setMessages(p => [...p, msg]))
socket.emit('chat-message', { roomId, text: chatInput })
socket.on('webrtc-offer', handleOffer)
socket.on('webrtc-answer', handleAnswer)
socket.on('ice-candidate', handleIceCandidate)
```

## Project Structure

```
src/
├── context/
│   └── AuthContext.jsx        ← Auth state + API stubs
├── components/
│   └── AppLayout.jsx          ← Sidebar + TopBar layout
├── pages/
│   ├── Landing.jsx            ← Marketing landing page
│   ├── Login.jsx              ← Auth: sign in
│   ├── Register.jsx           ← Auth: sign up  
│   ├── Dashboard.jsx          ← Home overview
│   ├── Tasks.jsx              ← Tasks (list + kanban)
│   ├── Schedule.jsx           ← Calendar + timeline
│   ├── FocusRooms.jsx         ← Rooms browser
│   ├── FocusRoom.jsx          ← Live room (video/chat)
│   └── Profile.jsx            ← Settings + stats
├── index.css                  ← Design system + tokens
└── App.jsx                    ← Router
```

## Tech Stack
- React 18 + Vite
- React Router v6
- date-fns (calendar)
- lucide-react (icons)
- framer-motion (optional animations)
- CSS Variables design system (no Tailwind needed)

## API Routes Expected (from your backend)

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login → returns JWT |
| GET | /api/tasks | Get user tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/schedules | Get events |
| POST | /api/schedules | Create event |
| GET | /api/rooms | Get active rooms |
| POST | /api/rooms | Create room |

## Socket.IO Events Expected

| Event | Direction | Payload |
|-------|-----------|---------|
| join-room | emit | { roomId } |
| leave-room | emit | { roomId } |
| chat-message | emit/on | { roomId, text, user } |
| user-joined | on | { user, roomId } |
| user-left | on | { userId } |
| webrtc-offer | emit/on | { offer, targetId } |
| webrtc-answer | emit/on | { answer, targetId } |
| ice-candidate | emit/on | { candidate, targetId } |
| room-update | on | { room } |
