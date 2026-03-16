import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Mock user — replace with real JWT calls to your Express API
const MOCK_USER = {
  _id: 'usr_001',
  name: 'Arjun Sharma',
  email: 'arjun@flowmind.app',
  avatar: null,
  initials: 'AS',
  streak: 14,
  joinedAt: '2024-09-01',
  stats: { tasksCompleted: 142, focusHours: 87, roomsJoined: 31 }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate checking stored JWT
    const stored = localStorage.getItem('fm_user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Replace with: const res = await fetch('/api/auth/login', { method:'POST', body: JSON.stringify({email,password}) })
    // const data = await res.json(); localStorage.setItem('fm_token', data.token)
    await new Promise(r => setTimeout(r, 800))
    localStorage.setItem('fm_user', JSON.stringify(MOCK_USER))
    setUser(MOCK_USER)
    return { success: true }
  }

  const register = async (name, email, password) => {
    await new Promise(r => setTimeout(r, 900))
    const newUser = { ...MOCK_USER, name, email, initials: name.split(' ').map(n=>n[0]).join('').toUpperCase() }
    localStorage.setItem('fm_user', JSON.stringify(newUser))
    setUser(newUser)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('fm_user')
    localStorage.removeItem('fm_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
