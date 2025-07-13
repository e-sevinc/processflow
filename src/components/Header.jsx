import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { EnhancedDropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Workflow, Languages, User, Settings, LogOut, Menu, X, Home, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export const Header = ({ currentView, onNavigate, breadcrumbItems = [] }) => {
  const { t, toggleLanguage, language } = useLanguage()
  const { user, logout } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  const navigationItems = [
    { id: 'workspaces', label: t('myWorkspaces'), icon: '🏢' },
    { id: 'processes', label: t('processes'), icon: '📋' },
    { id: 'templates', label: 'Şablonlar', icon: '📄' },
    { id: 'analytics', label: 'Analitik', icon: '📊' },
    { id: 'settings', label: t('settings'), icon: '⚙️' },
  ]
  
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden"
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <Workflow className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">{t('appTitle')}</h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onNavigate(item.id)}
                className="flex items-center space-x-2"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>
          
          {/* User Menu and Language */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-1"
            >
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">{language.toUpperCase()}</span>
            </Button>
            
            {user && (
              <EnhancedDropdownMenu
                trigger={
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user.profileImage || user.avatar} 
                        alt={user.fullName || user.username} 
                      />
                      <AvatarFallback>{(user.fullName || user.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                }
                content={
                  <div className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.fullName || user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate('profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t('settings')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('logout')}</span>
                    </DropdownMenuItem>
                  </div>
                }
                align="end"
              />
            )}
          </div>
        </div>
        
        {/* Breadcrumb */}
        {breadcrumbItems.length > 0 && (
          <div className="mt-3 pb-2">
            <Breadcrumb items={breadcrumbItems} onNavigate={onNavigate} />
          </div>
        )}
      </div>
      
      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto px-4 py-2">
            <div className="flex flex-col space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    onNavigate(item.id)
                    setShowMobileMenu(false)
                  }}
                  className="justify-start"
                >
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

// Breadcrumb component
const Breadcrumb = ({ items, onNavigate }) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate('home')}
        className="h-6 px-2 hover:text-foreground"
      >
        <Home className="h-3 w-3" />
      </Button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-3 w-3" />
          {index === items.length - 1 ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(item.path)}
              className="h-6 px-2 hover:text-foreground"
            >
              {item.label}
            </Button>
          )}
        </div>
      ))}
    </nav>
  )
} 