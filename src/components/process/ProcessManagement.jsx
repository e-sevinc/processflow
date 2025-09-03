import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SimpleSelect, SelectOption } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

import { FileText, Plus, Edit, Trash2, Download, Share2, MoreHorizontal } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import apiService from '@/services/api'

export const ProcessManagement = ({ workspace, onSelectProcess, onNavigate, onBack }) => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [processes, setProcesses] = useState([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newProcess, setNewProcess] = useState({
    name: '',
    description: '',
    owner: '',
    department: '',
    status: 'draft'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Süreçleri yükle
  useEffect(() => {
    if (workspace) {
      loadProcesses()
    }
  }, [workspace])
  
  const loadProcesses = async () => {
    try {
      const response = await apiService.getProcesses(workspace.id)
      setProcesses(response.processes.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        owner: p.created_by_name,
        department: '',
        version: '1.0',
        status: p.status,
        steps: 0 // API'den element count gelecek
      })))
    } catch (error) {
      setError('Süreçler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }
  
  const createProcess = async () => {
    if (newProcess.name && user) {
      try {
        await apiService.createProcess(workspace.id, {
          name: newProcess.name,
          description: newProcess.description
        })
        loadProcesses() // Listeyi yenile
        setNewProcess({ name: '', description: '', owner: '', department: '', status: 'draft' })
        setShowCreateDialog(false)
      } catch (error) {
        setError('Süreç oluşturulurken hata oluştu')
      }
    }
  }
  
  const getStatusBadge = (status) => {
    const variants = {
      draft: 'secondary',
      inReview: 'outline',
      active: 'default'
    }
    return <Badge variant={variants[status]}>{t(status)}</Badge>
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">{workspace.name} - {t('processes')}</h2>
            <p className="text-muted-foreground mt-1">{workspace.description}</p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Yeni Süreç Oluştur
          </Button>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm text-center mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Süreçler yükleniyor...</p>
          </div>
        ) : processes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz süreç oluşturulmamış</h3>
            <p className="text-gray-600 mb-6">Bu workspace'te henüz hiç süreç bulunmuyor. İlk sürecinizi oluşturmak için yukarıdaki butonu kullanın.</p>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              İlk Sürecinizi Oluşturun
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {processes.map((process) => (
              <Card key={process.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{process.name}</CardTitle>
                        <CardDescription>{process.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(process.status)}
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
                          <div 
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                            onClick={() => onSelectProcess(process)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Düzenle
                          </div>
                          <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <Download className="mr-2 h-4 w-4" />
                            İndir
                          </div>
                          <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <Share2 className="mr-2 h-4 w-4" />
                            Paylaş
                          </div>
                          <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('delete')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t('owner')}:</span>
                      <p>{process.owner}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('department')}:</span>
                      <p>{process.department}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('version')}:</span>
                      <p>{process.version}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('steps')}:</span>
                      <p>{process.steps}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => onSelectProcess(process)}
                  >
                    {t('open')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Create Process Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('createProcess')}</DialogTitle>
            <DialogDescription>
              Yeni bir süreç oluşturun
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="processName">{t('processName')}</Label>
                <Input
                  id="processName"
                  value={newProcess.name}
                  onChange={(e) => setNewProcess({...newProcess, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="processOwner">{t('processOwner')}</Label>
                <Input
                  id="processOwner"
                  value={newProcess.owner}
                  onChange={(e) => setNewProcess({...newProcess, owner: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">{t('department')}</Label>
                <Input
                  id="department"
                  value={newProcess.department}
                  onChange={(e) => setNewProcess({...newProcess, department: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="status">{t('status')}</Label>
                <SimpleSelect
                  id="status"
                  value={newProcess.status}
                  onChange={(e) => setNewProcess({...newProcess, status: e.target.value})}
                >
                  <SelectOption value="draft">Taslak</SelectOption>
                  <SelectOption value="inReview">İncelemede</SelectOption>
                  <SelectOption value="active">Aktif</SelectOption>
                </SimpleSelect>
              </div>
            </div>
            <div>
              <Label htmlFor="processDescription">{t('processDescription')}</Label>
              <Textarea
                id="processDescription"
                value={newProcess.description}
                onChange={(e) => setNewProcess({...newProcess, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={createProcess}>{t('create')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 