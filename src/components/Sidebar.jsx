import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { EnhancedDropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { 
  Workflow, 
  Building2, 
  ClipboardList, 
  FileText, 
  BarChart3, 
  Palette, 
  Cog, 
  User, 
  Settings, 
  LogOut, 
  Languages,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

export const Sidebar = ({ 
  currentView, 
  onNavigate, 
  selectedWorkspace, 
  selectedProcess,
  isCollapsed = false,
  onToggleCollapse 
}) => {
  const { t, toggleLanguage, language } = useLanguage()
  const { user, logout } = useAuth()
  
  // User menu content component
  const UserMenuContent = ({ onItemClick }) => (
    <div className="w-56">
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{user.fullName || user.username}</p>
          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => { onNavigate('profile'); onItemClick?.() }}>
        <User className="mr-2 h-4 w-4" />
        <span>Profil</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => { onNavigate('settings'); onItemClick?.() }}>
        <Settings className="mr-2 h-4 w-4" />
        <span>{t('settings')}</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => { logout(); onItemClick?.() }}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>{t('logout')}</span>
      </DropdownMenuItem>
    </div>
  )
  
  // Main navigation items
  const mainNavigationItems = [
    { 
      id: 'workspaces', 
      label: t('myWorkspaces'), 
      icon: Building2, 
      alwaysVisible: true,
      description: 'Çalışma alanlarınızı yönetin'
    },
    { 
      id: 'templates', 
      label: 'Şablonlar', 
      icon: FileText, 
      alwaysVisible: true,
      description: 'Hazır süreç şablonları'
    },
    { 
      id: 'analytics', 
      label: 'Analitik', 
      icon: BarChart3, 
      alwaysVisible: true,
      description: 'Performans raporları'
    },
    { 
      id: 'demo', 
      label: 'Demo', 
      icon: Palette, 
      alwaysVisible: true,
      description: 'Bileşen örnekleri'
    },
    { 
      id: 'settings', 
      label: t('settings'), 
      icon: Cog, 
      alwaysVisible: true,
      description: 'Uygulama ayarları'
    },
  ]
  
  // Context-specific navigation items
  const getContextNavigationItems = () => {
    const items = []
    
    if (selectedWorkspace) {
      items.push({
        id: 'processes',
        label: selectedProcess ? selectedProcess.name : t('processes'),
        icon: ClipboardList,
        parent: selectedWorkspace.name,
        description: selectedProcess ? 'Süreç düzenleyici' : 'Süreçleri yönetin'
      })
    }
    
    return items
  }
  
  const contextItems = getContextNavigationItems()
  const allItems = [...mainNavigationItems, ...contextItems]
  
  const getBreadcrumbPath = () => {
    const path = []
    
    if (currentView === 'workspaces') {
      path.push({ label: t('myWorkspaces'), id: 'workspaces' })
    } else if (currentView === 'processes' && selectedWorkspace) {
      path.push(
        { label: t('myWorkspaces'), id: 'workspaces' },
        { label: selectedWorkspace.name, id: 'processes' }
      )
    } else if (currentView === 'editor' && selectedProcess) {
      path.push(
        { label: t('myWorkspaces'), id: 'workspaces' },
        { label: selectedWorkspace?.name || 'Workspace', id: 'processes' },
        { label: selectedProcess.name, id: 'editor' }
      )
    } else {
      const item = mainNavigationItems.find(item => item.id === currentView)
      if (item) {
        path.push({ label: item.label, id: item.id })
      }
    }
    
    return path
  }
  
  const breadcrumbPath = getBreadcrumbPath()
  
  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 h-screen ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div 
              className="flex items-center space-x-2 cursor-pointer flex-1" 
              onClick={() => onNavigate('home')}
            >
              <Workflow className="h-8 w-8 text-primary flex-shrink-0" />
              <h1 className="text-xl font-bold text-primary truncate">{t('appTitle')}</h1>
            </div>
          )}
          {isCollapsed && (
            <div 
              className="flex items-center justify-center cursor-pointer w-full" 
              onClick={() => onNavigate('home')}
            >
              <Workflow className="h-8 w-8 text-primary" />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Breadcrumb */}
      {!isCollapsed && breadcrumbPath.length > 1 && (
        <div className="px-4 py-3 border-b border-gray-100">
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('home')}
              className="h-6 px-2 hover:text-foreground"
            >
              <Home className="h-3 w-3" />
            </Button>
            
            {breadcrumbPath.map((item, index) => (
              <div key={index} className="flex items-center space-x-1">
                <ChevronRight className="h-3 w-3" />
                {index === breadcrumbPath.length - 1 ? (
                  <span className="text-foreground font-medium">{item.label}</span>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate(item.id)}
                    className="h-6 px-2 hover:text-foreground"
                  >
                    {item.label}
                  </Button>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-1">
          {allItems.map((item) => (
            <div key={item.id}>
              <Button
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onNavigate(item.id)}
                className={`w-full justify-start h-11 ${
                  isCollapsed ? 'px-2' : 'px-3'
                } transition-colors duration-200`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className={`h-4 w-4 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && (
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className="text-sm font-medium truncate w-full">{item.label}</span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground truncate w-full">{item.description}</span>
                    )}
                  </div>
                )}
              </Button>
              
              {/* Context indicator */}
              {!isCollapsed && item.parent && (
                <div className="ml-6 text-xs text-muted-foreground mt-1 mb-2">
                  {item.parent}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      
      {/* User Menu */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          {!isCollapsed && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center space-x-2"
              >
                <Languages className="h-4 w-4" />
                <span className="text-sm">{language.toUpperCase()}</span>
              </Button>
              
              {user && (
                <EnhancedDropdownMenu
                  trigger={
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={user.profileImage || user.avatar} 
                          alt={user.fullName || user.username} 
                        />
                        <AvatarFallback>{(user.fullName || user.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                  content={<UserMenuContent />}
                  align="end"
                />
              )}
            </>
          )}
          
          {isCollapsed && (
            <div className="flex flex-col items-center space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="h-8 w-8 p-0"
                title={`Dil: ${language.toUpperCase()}`}
              >
                <Languages className="h-4 w-4" />
              </Button>
              
              {user && (
                <EnhancedDropdownMenu
                  trigger={
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={user.profileImage || user.avatar} 
                          alt={user.fullName || user.username} 
                        />
                        <AvatarFallback>{(user.fullName || user.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                  content={<UserMenuContent />}
                  align="end"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}