import { useState } from 'react'
import { AlertTriangle, X, ChevronDown, ChevronUp, RefreshCw, Lock, Wrench, Globe, AlertCircle } from 'lucide-react'
import { Button } from './button'
import { Badge } from './badge'

export const ErrorDisplay = ({ errors, onClearAll, onClearError, onRetry }) => {
  const [expanded, setExpanded] = useState(false)

  if (!errors || errors.length === 0) {
    return null
  }

  const recentErrors = errors.slice(0, 3)
  const hasMoreErrors = errors.length > 3

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getErrorIcon = (error) => {
    if (error.originalError?.response?.status === 401) {
      return <Lock className="w-4 h-4" />
    } else if (error.originalError?.response?.status >= 500) {
      return <Wrench className="w-4 h-4" />
    } else if (error.originalError?.request) {
      return <Globe className="w-4 h-4" />
    }
    return <AlertCircle className="w-4 h-4" />
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-white border border-red-200 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-red-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-900">
              Hatalar ({errors.length})
            </span>
            <Badge variant="destructive" className="text-xs">
              {errors.length}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-1">
            {onRetry && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRetry}
                className="text-red-600 hover:text-red-700"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-red-600 hover:text-red-700"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Error List */}
        {expanded && (
          <div className="max-h-64 overflow-y-auto">
            {errors.map((error) => (
              <div
                key={error.id}
                className="p-3 border-b border-red-100 last:border-b-0 hover:bg-red-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getErrorIcon(error)}
                      <span className="text-sm font-medium text-red-900">
                        {error.message}
                      </span>
                    </div>
                    
                    {error.context && (
                      <p className="text-xs text-red-600 mb-1">
                        Konum: {error.context}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(error.timestamp)}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onClearError(error.id)}
                    className="text-red-400 hover:text-red-600 ml-2"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Collapsed View */}
        {!expanded && (
          <div className="p-3">
            <div className="space-y-2">
              {recentErrors.map((error) => (
                <div key={error.id} className="flex items-center space-x-2">
                  {getErrorIcon(error)}
                  <span className="text-sm text-red-900 truncate flex-1">
                    {error.message}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(error.timestamp)}
                  </span>
                </div>
              ))}
              
              {hasMoreErrors && (
                <p className="text-xs text-gray-500 text-center">
                  +{errors.length - 3} hata daha...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 