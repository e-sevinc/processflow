import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

export const useErrorHandler = () => {
  const [errors, setErrors] = useState([])

  const handleError = useCallback((error, context = '') => {
    console.error(`Error in ${context}:`, error)

    // Hata mesajını belirle
    let errorMessage = 'Beklenmeyen bir hata oluştu'
    
    if (error.response) {
      // API hatası
      const status = error.response.status
      const data = error.response.data
      
      switch (status) {
        case 400:
          errorMessage = data.error || 'Geçersiz istek'
          break
        case 401:
          errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.'
          // Otomatik logout
          localStorage.removeItem('token')
          window.location.reload()
          break
        case 403:
          errorMessage = 'Bu işlem için yetkiniz bulunmuyor'
          break
        case 404:
          errorMessage = 'İstenen kaynak bulunamadı'
          break
        case 409:
          errorMessage = data.error || 'Çakışma oluştu'
          break
        case 422:
          errorMessage = data.error || 'Geçersiz veri'
          break
        case 500:
          errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.'
          break
        default:
          errorMessage = data.error || `HTTP ${status} hatası`
      }
    } else if (error.request) {
      // Ağ hatası
      errorMessage = 'Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.'
    } else if (error.message) {
      // JavaScript hatası
      errorMessage = error.message
    }

    // Toast bildirimi göster
    toast.error(errorMessage, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#FEE2E2',
        color: '#DC2626',
        border: '1px solid #FCA5A5'
      }
    })

    // Hata listesine ekle
    const newError = {
      id: Date.now(),
      message: errorMessage,
      context,
      timestamp: new Date().toISOString(),
      originalError: error
    }

    setErrors(prev => [newError, ...prev.slice(0, 9)]) // Son 10 hatayı tut

    return errorMessage
  }, [])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  const clearError = useCallback((errorId) => {
    setErrors(prev => prev.filter(error => error.id !== errorId))
  }, [])

  const getErrorsByContext = useCallback((context) => {
    return errors.filter(error => error.context === context)
  }, [errors])

  return {
    errors,
    handleError,
    clearErrors,
    clearError,
    getErrorsByContext
  }
} 