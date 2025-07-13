import { ChevronRight, Home } from 'lucide-react'
import { Button } from './button'

export const Breadcrumb = ({ items, onNavigate }) => {
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