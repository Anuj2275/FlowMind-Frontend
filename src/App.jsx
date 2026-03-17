import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Schedule from './pages/Schedule'
import FocusRooms from './pages/FocusRooms'
import FocusRoom from './pages/FocusRoom'
import Profile from './pages/Profile'
import AppLayout from './components/AppLayout'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <BrowserRouter future={{ 
        v7_startTransition: true, 
        v7_relativeSplatPath: true 
      }}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><AppLayout><Tasks /></AppLayout></PrivateRoute>} />
          <Route path="/schedule" element={<PrivateRoute><AppLayout><Schedule /></AppLayout></PrivateRoute>} />
          <Route path="/rooms" element={<PrivateRoute><AppLayout><FocusRooms /></AppLayout></PrivateRoute>} />
          <Route path="/rooms/:roomId" element={<PrivateRoute><FocusRoom /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><AppLayout><Profile /></AppLayout></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
