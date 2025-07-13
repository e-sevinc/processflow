import { createContext, useContext, useState, useEffect } from 'react'
import apiService from '@/services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Sayfa yüklendiğinde token kontrolü yap
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await apiService.getUserProfile()
          setUser(response.user)
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Token geçersiz:', error)
          apiService.logout()
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [])
  
  const login = async (username, password) => {
    try {
      const response = await apiService.login({ username, password })
      setUser(response.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message || 'Giriş yapılırken bir hata oluştu' }
    }
  }
  
  const register = async (username, email, password, confirmPassword, fullName) => {
    try {
      if (password !== confirmPassword) {
        return { success: false, error: 'Şifreler eşleşmiyor' }
      }
      
      const response = await apiService.register({ username, email, password, fullName })
      setUser(response.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message || 'Kayıt olurken bir hata oluştu' }
    }
  }
  
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    apiService.logout()
  }
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
} 