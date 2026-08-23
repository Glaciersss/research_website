import { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (token && savedUser) {
      try {
        const response = await authAPI.verify()
        if (response.data.valid) {
          setUser(JSON.parse(savedUser))
          setIsAuthenticated(true)
        } else {
          logout()
        }
      } catch (error) {
        logout()
      }
    }
    setLoading(false)
  }

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password)
      const { access_token, admin } = response.data

      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(admin))

      setUser(admin)
      setIsAuthenticated(true)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || '鐧诲綍澶辫触'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

