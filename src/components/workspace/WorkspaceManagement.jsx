import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Building2, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import apiService from '@/services/api'

export const WorkspaceManagement = ({ onSelectWorkspace, onNavigate }) => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [workspaces, setWorkspaces] = useState([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Çalışma alanlarını yükle
  useEffect(() => {
    if (user) {
      loadWorkspaces()
    }
  }, [user])
  
  const loadWorkspaces = async () => {
    try {
      const response = await apiService.getWorkspaces()
      setWorkspaces(response.workspaces.map(ws => ({
        id: ws.id,
        name: ws.name,
        description: ws.description,
        processes: 0 // API'den process count gelecek
      })))
    } catch (error) {
      setError('Çalışma alanları yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }
  
  const createWorkspace = async () => {
    if (newWorkspace.name && user) {
      try {
        await apiService.createWorkspace({
          name: newWorkspace.name,
          description: newWorkspace.description,
          isPublic: false
        })
        loadWorkspaces() // Listeyi yenile
        setNewWorkspace({ name: '', description: '' })
        setShowCreateDialog(false)
      } catch (error) {
        setError('Çalışma alanı oluşturulurken hata oluştu')
      }
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">{t('myWorkspaces')}</h2>
            <p className="text-muted-foreground mt-1">Çalışma alanlarınızı yönetin ve süreçlerinizi organize edin</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('createWorkspace')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('createWorkspace')}</DialogTitle>
                <DialogDescription>
                  Yeni bir çalışma alanı oluşturun
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="workspaceName">{t('workspaceName')}</Label>
                  <Input
                    id="workspaceName"
                    value={newWorkspace.name}
                    onChange={(e) => setNewWorkspace({...newWorkspace, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="workspaceDescription">{t('workspaceDescription')}</Label>
                  <Textarea
                    id="workspaceDescription"
                    value={newWorkspace.description}
                    onChange={(e) => setNewWorkspace({...newWorkspace, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={createWorkspace}>{t('create')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm text-center mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Çalışma alanları yükleniyor...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
            <Card key={workspace.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Building2 className="h-8 w-8 text-primary" />
                                  <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="dropdown-trigger"
                    onClick={(e) => {
                      e.stopPropagation()
                      const dropdown = e.currentTarget.nextElementSibling
                      if (dropdown) {
                        dropdown.classList.toggle('hidden')
                      }
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  <div className="dropdown-content absolute right-0 top-full z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md hidden">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                      <Edit className="mr-2 h-4 w-4" />
                      {t('edit')}
                    </div>
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('delete')}
                    </div>
                  </div>
                </div>
                </div>
                <CardTitle>{workspace.name}</CardTitle>
                <CardDescription>{workspace.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{workspace.processes} {t('processes')}</span>
                  <Badge variant="outline">{t('active')}</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => onSelectWorkspace(workspace)}
                >
                  Aç
                </Button>
              </CardFooter>
            </Card>
          ))}
          </div>
        )}
      </div>
    </div>
  )
} 