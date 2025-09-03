import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export const Header = ({ onToggleSidebar, isSidebarCollapsed, isMobileSidebarOpen }) => {
  const { t } = useLanguage()
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Mobile menu button and title */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="lg:hidden"
            >
              {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            {/* Desktop collapse button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="hidden lg:flex"
            >
              {isSidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-gray-900">{t('appTitle')}</h1>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Add any header actions here if needed */}
          </div>
        </div>
      </div>
    </header>
  )
} 