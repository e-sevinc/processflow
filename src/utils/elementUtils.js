import { 
  Play, Square, Diamond, Home, Building2, FileText, 
  Users, Settings, Database, Cloud, Lock, Unlock 
} from 'lucide-react'

export const getElementIcon = (type) => {
  switch (type) {
    case 'start': return Play
    case 'end': return Home
    case 'decision': return Diamond
    case 'step': return Square
    case 'subprocess': return Building2
    case 'document': return FileText
    case 'user': return Users
    case 'system': return Settings
    case 'database': return Database
    case 'cloud': return Cloud
    case 'security': return Lock
    case 'public': return Unlock
    default: return FileText
  }
}

export const getElementColor = (type) => {
  switch (type) {
    case 'start': return 'bg-green-100 text-green-800 border-green-300'
    case 'end': return 'bg-red-100 text-red-800 border-red-300'
    case 'decision': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'step': return 'bg-blue-100 text-blue-800 border-blue-300'
    case 'subprocess': return 'bg-purple-100 text-purple-800 border-purple-300'
    case 'document': return 'bg-gray-100 text-gray-800 border-gray-300'
    case 'user': return 'bg-indigo-100 text-indigo-800 border-indigo-300'
    case 'system': return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'database': return 'bg-teal-100 text-teal-800 border-teal-300'
    case 'cloud': return 'bg-cyan-100 text-cyan-800 border-cyan-300'
    case 'security': return 'bg-pink-100 text-pink-800 border-pink-300'
    case 'public': return 'bg-lime-100 text-lime-800 border-lime-300'
    default: return 'bg-blue-100 text-blue-800 border-blue-300'
  }
}

export const getElementShape = (type) => {
  switch (type) {
    case 'start':
    case 'end':
      return 'rounded-full'
    case 'decision':
      return 'transform rotate-45'
    default:
      return 'rounded-lg'
  }
}

export const getElementTypes = () => [
  { type: 'start', name: 'Başlangıç', icon: Play, color: 'bg-green-100 text-green-800' },
  { type: 'step', name: 'Adım', icon: Square, color: 'bg-blue-100 text-blue-800' },
  { type: 'decision', name: 'Karar', icon: Diamond, color: 'bg-yellow-100 text-yellow-800' },
  { type: 'end', name: 'Bitiş', icon: Home, color: 'bg-red-100 text-red-800' },
  { type: 'subprocess', name: 'Alt Süreç', icon: Building2, color: 'bg-purple-100 text-purple-800' },
  { type: 'document', name: 'Doküman', icon: FileText, color: 'bg-gray-100 text-gray-800' },
  { type: 'user', name: 'Kullanıcı', icon: Users, color: 'bg-indigo-100 text-indigo-800' },
  { type: 'system', name: 'Sistem', icon: Settings, color: 'bg-orange-100 text-orange-800' },
  { type: 'database', name: 'Veritabanı', icon: Database, color: 'bg-teal-100 text-teal-800' },
  { type: 'cloud', name: 'Bulut', icon: Cloud, color: 'bg-cyan-100 text-cyan-800' },
  { type: 'security', name: 'Güvenlik', icon: Lock, color: 'bg-pink-100 text-pink-800' },
  { type: 'public', name: 'Genel', icon: Unlock, color: 'bg-lime-100 text-lime-800' }
] 