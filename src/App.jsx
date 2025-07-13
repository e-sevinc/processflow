import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ProcessProvider } from '@/contexts/ProcessContext'
import { Header } from '@/components/Header'
import { WorkspaceManagement } from '@/components/workspace/WorkspaceManagement'
import { ProcessManagement } from '@/components/process/ProcessManagement'
import { ProcessEditor } from '@/components/editor/ProcessEditor'
import { AuthForm } from '@/components/auth/AuthForm'
import { TemplatesView } from '@/components/views/TemplatesView'
import { AnalyticsView } from '@/components/views/AnalyticsView'
import { SettingsView } from '@/components/views/SettingsView'
import { ProfileView } from '@/components/views/ProfileView'
import '@/styles/globals.css'

// Auth Wrapper Component
const AuthWrapper = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <AuthForm />
  }
  
  return children
}

// Main Content Component
const MainContent = ({ 
  currentView, 
  selectedWorkspace, 
  selectedProcess, 
  onSelectWorkspace, 
  onSelectProcess, 
  onBackToWorkspaces, 
  onBackToProcesses,
  onNavigate
}) => {
  // Breadcrumb items based on current view
  const getBreadcrumbItems = () => {
    const items = []
    
    if (currentView === 'workspaces') {
      items.push({ label: 'Çalışma Alanları', path: 'workspaces' })
    } else if (currentView === 'processes' && selectedWorkspace) {
      items.push(
        { label: 'Çalışma Alanları', path: 'workspaces' },
        { label: selectedWorkspace.name, path: 'processes' }
      )
    } else if (currentView === 'editor' && selectedProcess) {
      items.push(
        { label: 'Çalışma Alanları', path: 'workspaces' },
        { label: selectedWorkspace?.name || 'Workspace', path: 'processes' },
        { label: selectedProcess.name, path: 'editor' }
      )
    } else if (currentView === 'templates') {
      items.push({ label: 'Şablonlar', path: 'templates' })
    } else if (currentView === 'analytics') {
      items.push({ label: 'Analitik', path: 'analytics' })
    } else if (currentView === 'settings') {
      items.push({ label: 'Ayarlar', path: 'settings' })
    } else if (currentView === 'profile') {
      items.push({ label: 'Profil', path: 'profile' })
    }
    
    return items
  }
  
  if (currentView === 'workspaces') {
    return <WorkspaceManagement onSelectWorkspace={onSelectWorkspace} onNavigate={onNavigate} />
  }
  
  if (currentView === 'processes' && selectedWorkspace) {
    return (
      <ProcessManagement 
        workspace={selectedWorkspace} 
        onSelectProcess={onSelectProcess}
        onNavigate={onNavigate}
        onBack={onBackToWorkspaces}
      />
    )
  }
  
  if (currentView === 'editor' && selectedProcess) {
    return (
      <ProcessEditor 
        process={selectedProcess} 
        onBack={onBackToProcesses}
        onNavigate={onNavigate}
      />
    )
  }
  
  if (currentView === 'templates') {
    return <TemplatesView onNavigate={onNavigate} />
  }
  
  if (currentView === 'analytics') {
    return <AnalyticsView onNavigate={onNavigate} />
  }
  
  if (currentView === 'settings') {
    return <SettingsView onNavigate={onNavigate} />
  }
  
  if (currentView === 'profile') {
    return <ProfileView onNavigate={onNavigate} />
  }
  
  return <WorkspaceManagement onSelectWorkspace={onSelectWorkspace} onNavigate={onNavigate} />
}

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('workspaces')
  const [selectedWorkspace, setSelectedWorkspace] = useState(null)
  const [selectedProcess, setSelectedProcess] = useState(null)
  
  // Global click handler to close dropdowns
  useEffect(() => {
    const handleGlobalClick = (event) => {
      // Close all dropdowns when clicking outside
      const dropdowns = document.querySelectorAll('.dropdown-content')
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target) && !event.target.closest('.dropdown-trigger')) {
          dropdown.classList.add('hidden')
        }
      })
    }

    document.addEventListener('click', handleGlobalClick)
    return () => {
      document.removeEventListener('click', handleGlobalClick)
    }
  }, [])
  
  const handleSelectWorkspace = (workspace) => {
    setSelectedWorkspace(workspace)
    setCurrentView('processes')
  }
  
  const handleSelectProcess = (process) => {
    setSelectedProcess(process)
    setCurrentView('editor')
  }
  
  const handleBackToWorkspaces = () => {
    setSelectedWorkspace(null)
    setCurrentView('workspaces')
  }
  
  const handleBackToProcesses = () => {
    setSelectedProcess(null)
    setCurrentView('processes')
  }
  
  const handleNavigate = (view) => {
    switch (view) {
      case 'home':
      case 'workspaces':
        setCurrentView('workspaces')
        setSelectedWorkspace(null)
        setSelectedProcess(null)
        break
      case 'processes':
        if (selectedWorkspace) {
          setCurrentView('processes')
          setSelectedProcess(null)
        }
        break
      case 'templates':
        setCurrentView('templates')
        break
      case 'analytics':
        setCurrentView('analytics')
        break
      case 'settings':
        setCurrentView('settings')
        break
      case 'profile':
        setCurrentView('profile')
        break
      default:
        break
    }
  }
  
  // Breadcrumb items based on current view
  const getBreadcrumbItems = () => {
    const items = []
    
    if (currentView === 'workspaces') {
      items.push({ label: 'Çalışma Alanları', path: 'workspaces' })
    } else if (currentView === 'processes' && selectedWorkspace) {
      items.push(
        { label: 'Çalışma Alanları', path: 'workspaces' },
        { label: selectedWorkspace.name, path: 'processes' }
      )
    } else if (currentView === 'editor' && selectedProcess) {
      items.push(
        { label: 'Çalışma Alanları', path: 'workspaces' },
        { label: selectedWorkspace?.name || 'Workspace', path: 'processes' },
        { label: selectedProcess.name, path: 'editor' }
      )
    } else if (currentView === 'templates') {
      items.push({ label: 'Şablonlar', path: 'templates' })
    } else if (currentView === 'analytics') {
      items.push({ label: 'Analitik', path: 'analytics' })
    } else if (currentView === 'settings') {
      items.push({ label: 'Ayarlar', path: 'settings' })
    } else if (currentView === 'profile') {
      items.push({ label: 'Profil', path: 'profile' })
    }
    
    return items
  }
  
  return (
    <LanguageProvider>
      <AuthProvider>
        <ProcessProvider>
          <AuthWrapper>
            <div className="min-h-screen bg-gray-50">
              <Header 
                currentView={currentView}
                onNavigate={handleNavigate}
                breadcrumbItems={getBreadcrumbItems()}
              />
              <MainContent 
                currentView={currentView}
                selectedWorkspace={selectedWorkspace}
                selectedProcess={selectedProcess}
                onSelectWorkspace={handleSelectWorkspace}
                onSelectProcess={handleSelectProcess}
                onBackToWorkspaces={handleBackToWorkspaces}
                onBackToProcesses={handleBackToProcesses}
                onNavigate={handleNavigate}
              />
            </div>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthWrapper>
        </ProcessProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App 