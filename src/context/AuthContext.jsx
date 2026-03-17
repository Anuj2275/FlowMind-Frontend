// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount: rehydrate from stored token
  useEffect(() => {
    const token = localStorage.getItem('fm_token')
    if (!token) { setLoading(false); return }

    api.get('/auth/me')
      .then(userData => setUser(userData))
      .catch(() => localStorage.removeItem('fm_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password })
      localStorage.setItem('fm_token', data.token)
      setUser(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const register = async (name, email, password) => {
    try {
      await api.post('/auth/register', { name, email, password })
      return { success: true, message: 'Account created! Please sign in.' }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const updateProfile = useCallback(async (updates) => {
    try {
      const updated = await api.put('/auth/profile', updates)
      setUser(updated)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }, [])

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/auth/password', { currentPassword, newPassword })
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('fm_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, changePassword, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)