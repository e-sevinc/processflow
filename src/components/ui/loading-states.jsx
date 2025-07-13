import { Loader2 } from 'lucide-react'

// Basit loading spinner
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className}`} 
    />
  )
}

// Sayfa loading
export const PageLoading = ({ message = 'Yükleniyor...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}

// Kart loading
export const CardLoading = ({ lines = 3 }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="space-y-3">
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-3 w-full bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}

// Tablo loading
export const TableLoading = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-4 py-3">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Button loading
export const ButtonLoading = ({ children, loading, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center space-x-2 ${props.className || ''}`}
    >
      {loading && <LoadingSpinner size="sm" />}
      <span>{children}</span>
    </button>
  )
}

// Progress bar
export const ProgressBar = ({ progress, total, message }) => {
  const percentage = total > 0 ? (progress / total) * 100 : 0

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{message || 'İlerleme'}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {total > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          {progress} / {total}
        </p>
      )}
    </div>
  )
}

// Skeleton wrapper
export const SkeletonWrapper = ({ children, loading, className = '' }) => {
  if (loading) {
    return (
      <div className={`${className} bg-gray-200 rounded animate-pulse`}>
        <div className="w-full h-full" />
      </div>
    )
  }
  
  return children
}

// Infinite scroll loading
export const InfiniteScrollLoading = () => {
  return (
    <div className="flex items-center justify-center py-4">
      <LoadingSpinner size="md" className="mr-2" />
      <span className="text-gray-600">Daha fazla yükleniyor...</span>
    </div>
  )
}

// Overlay loading
export const OverlayLoading = ({ message = 'İşlem devam ediyor...' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <LoadingSpinner size="lg" className="text-blue-600" />
          <div>
            <p className="font-medium text-gray-900">{message}</p>
            <p className="text-sm text-gray-500">Lütfen bekleyin...</p>
          </div>
        </div>
      </div>
    </div>
  )
} 