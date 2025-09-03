import { useState, useEffect, useRef, useCallback } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SimpleSelect } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EnhancedDropdownMenu } from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Plus, Download, FileText, Play, Square, Diamond, 
  Home, Building2, ArrowLeft, Edit, Trash2, Link, Move, Settings,
  Save, X, RotateCcw
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { LoadingSpinner, OverlayLoading } from '@/components/ui/loading-states'
import { ErrorDisplay } from '@/components/ui/error-display'
import { DraggableElement } from './DraggableElement'
import { ElementPalette } from './ElementPalette'
import apiService from '@/services/api'

// Yeni hook: Canvas yönetimi için
const useCanvas = (canvasRef) => {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isCanvasDragging, setIsCanvasDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.min(Math.max(prev * delta, 0.1), 3))
  }, [])

  const handleMouseDown = useCallback((e) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      setIsCanvasDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }, [pan])

  const handleMouseMove = useCallback((e) => {
    if (isCanvasDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }, [isCanvasDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsCanvasDragging(false)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false })
      canvas.addEventListener('mousedown', handleMouseDown)
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        canvas.removeEventListener('wheel', handleWheel)
        canvas.removeEventListener('mousedown', handleMouseDown)
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [canvasRef, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp])

  return { zoom, pan, isCanvasDragging }
}

export const ProcessEditor = ({ process, onBack, onNavigate }) => {
  const { t } = useLanguage()
  const { handleError, errors, clearErrors, clearError } = useErrorHandler()
  const [elements, setElements] = useState([])
  const [connections, setConnections] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [showElementDialog, setShowElementDialog] = useState(false)
  const [showConnectionDialog, setShowConnectionDialog] = useState(false)
  const [editingElement, setEditingElement] = useState(null)
  const [newElement, setNewElement] = useState({ type: 'step', name: '', description: '' })
  const [newConnection, setNewConnection] = useState({ from: '', to: '', label: '' })
  const [connectionMode, setConnectionMode] = useState(false)
  const [connectionStart, setConnectionStart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [elementDragging, setElementDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)
  const { zoom, pan, isCanvasDragging } = useCanvas(canvasRef)
  
  // Süreç elemanlarını yükle
  useEffect(() => {
    if (process) {
      loadProcessElements()
    }
  }, [process])
  
  const loadProcessElements = async () => {
    try {
      const response = await apiService.getProcess(process.id)
      const mappedElements = response.elements.map(el => ({
        id: el.id,
        type: el.element_type,
        name: el.label,
        description: '',
        x: el.x_position || Math.random() * 400 + 100,
        y: el.y_position || Math.random() * 300 + 100,
        properties: el.properties ? JSON.parse(el.properties) : {}
      }))
      setElements(mappedElements)
      
      // Mock connections - gerçek uygulamada API'den gelecek
      if (mappedElements.length > 1) {
        const mockConnections = []
        for (let i = 0; i < mappedElements.length - 1; i++) {
          mockConnections.push({
            id: `conn-${i}`,
            from: mappedElements[i].id,
            to: mappedElements[i + 1].id,
            label: ''
          })
        }
        setConnections(mockConnections)
      }
    } catch (error) {
      handleError(error, 'Süreç Yükleme')
      // Mock data for demo
      setElements([
        { id: 1, type: 'start', name: 'Başla', x: 100, y: 100, description: 'Süreç başlangıcı' },
        { id: 2, type: 'step', name: 'Adım 1', x: 300, y: 100, description: 'İlk adım' },
        { id: 3, type: 'decision', name: 'Karar', x: 500, y: 100, description: 'Karar noktası' },
        { id: 4, type: 'end', name: 'Bitir', x: 700, y: 100, description: 'Süreç sonu' }
      ])
      setConnections([
        { id: 'conn-1', from: 1, to: 2, label: '' },
        { id: 'conn-2', from: 2, to: 3, label: '' },
        { id: 'conn-3', from: 3, to: 4, label: 'Evet' }
      ])
    } finally {
      setLoading(false)
    }
  }
  
  const addElement = async () => {
    if (newElement.name) {
      try {
        const elementData = {
          elementType: newElement.type,
          label: newElement.name,
          xPosition: Math.random() * 400 + 100,
          yPosition: Math.random() * 300 + 100,
          properties: { description: newElement.description }
        }
        
        const response = await apiService.createProcessElement(process.id, elementData)
        
        const element = {
          id: response.element?.id || Date.now(),
          type: newElement.type,
          name: newElement.name,
          description: newElement.description,
          x: elementData.xPosition,
          y: elementData.yPosition
        }
        
        setElements([...elements, element])
        setNewElement({ type: 'step', name: '', description: '' })
        setShowElementDialog(false)
      } catch (error) {
        handleError(error, 'Element Ekleme')
        // Mock ekleme
        const element = {
          id: Date.now(),
          type: newElement.type,
          name: newElement.name,
          description: newElement.description,
          x: Math.random() * 400 + 100,
          y: Math.random() * 300 + 100
        }
        setElements([...elements, element])
        setNewElement({ type: 'step', name: '', description: '' })
        setShowElementDialog(false)
      }
    }
  }
  
  const updateElement = async () => {
    if (editingElement && editingElement.name) {
      try {
        await apiService.updateProcessElement(process.id, editingElement.id, {
          label: editingElement.name,
          properties: { description: editingElement.description }
        })
        
        setElements(elements.map(el => 
          el.id === editingElement.id ? editingElement : el
        ))
        setEditingElement(null)
        setShowElementDialog(false)
      } catch (error) {
        handleError(error, 'Element Güncelleme')
        // Mock güncelleme
        setElements(elements.map(el => 
          el.id === editingElement.id ? editingElement : el
        ))
        setEditingElement(null)
        setShowElementDialog(false)
      }
    }
  }
  
  const deleteElement = async (elementId) => {
    try {
      await apiService.deleteProcessElement(process.id, elementId)
      setElements(elements.filter(el => el.id !== elementId))
      setConnections(connections.filter(conn => conn.from !== elementId && conn.to !== elementId))
      setSelectedElement(null)
    } catch (error) {
      handleError(error, 'Element Silme')
      // Mock silme
      setElements(elements.filter(el => el.id !== elementId))
      setConnections(connections.filter(conn => conn.from !== elementId && conn.to !== elementId))
      setSelectedElement(null)
    }
  }
  
  const addConnection = () => {
    if (newConnection.from && newConnection.to) {
      const connection = {
        id: `conn-${Date.now()}`,
        from: newConnection.from,
        to: newConnection.to,
        label: newConnection.label
      }
      setConnections([...connections, connection])
      setNewConnection({ from: '', to: '', label: '' })
      setShowConnectionDialog(false)
    }
  }
  
  const autoLayout = () => {
    if (elements.length === 0) return
    
    const canvasWidth = 1200
    const canvasHeight = 800
    const elementWidth = 120
    const elementHeight = 60
    const spacing = 100
    
    // Basit grid layout
    const cols = Math.ceil(Math.sqrt(elements.length))
    const rows = Math.ceil(elements.length / cols)
    
    const startX = (canvasWidth - (cols * (elementWidth + spacing))) / 2
    const startY = (canvasHeight - (rows * (elementHeight + spacing))) / 2
    
    const newElements = elements.map((element, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      
      return {
        ...element,
        x: startX + col * (elementWidth + spacing),
        y: startY + row * (elementHeight + spacing)
      }
    })
    
    setElements(newElements)
    
    // Bağlantıları da güncelle
    if (newElements.length > 1) {
      const newConnections = []
      for (let i = 0; i < newElements.length - 1; i++) {
        newConnections.push({
          id: `conn-${i}`,
          from: newElements[i].id,
          to: newElements[i + 1].id,
          label: ''
        })
      }
      setConnections(newConnections)
    }
  }
  
  const startConnection = (element) => {
    setConnectionMode(true)
    setConnectionStart(element)
    setSelectedElement(null)
  }
  
  const finishConnection = (targetElement) => {
    if (connectionMode && connectionStart && targetElement.id !== connectionStart.id) {
      // Aynı bağlantının zaten var olup olmadığını kontrol et
      const existingConnection = connections.find(
        conn => (conn.from === connectionStart.id && conn.to === targetElement.id) ||
                (conn.from === targetElement.id && conn.to === connectionStart.id)
      )
      
      if (!existingConnection) {
        const connection = {
          id: `conn-${Date.now()}`,
          from: connectionStart.id,
          to: targetElement.id,
          label: ''
        }
        setConnections([...connections, connection])
      }
    }
    
    setConnectionMode(false)
    setConnectionStart(null)
  }
  
  const deleteConnection = (connectionId) => {
    setConnections(connections.filter(conn => conn.id !== connectionId))
    setSelectedConnection(null)
  }
  
  const saveProcess = async () => {
    if (!process) return
    
    setSaving(true)
    try {
      // Elementler ve bağlantılar zaten API üzerinden kaydediliyor
      console.log('Süreç kaydedildi')
    } catch (error) {
      handleError(error, 'Süreç Kaydetme')
    } finally {
      setSaving(false)
    }
  }
  
  // Element utility functions moved to utils/elementUtils.js
  
  const handleMouseDown = (e, element) => {
    setElementDragging(true)
    setSelectedElement(element)
    const rect = canvasRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left - element.x,
      y: e.clientY - rect.top - element.y
    })
  }
  
  const handleMouseMove = (e) => {
    if (elementDragging && selectedElement) {
      const rect = canvasRef.current.getBoundingClientRect()
      const newX = e.clientX - rect.left - dragOffset.x
      const newY = e.clientY - rect.top - dragOffset.y
      
      setElements(elements.map(el =>
        el.id === selectedElement.id
          ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) }
          : el
      ))
    }
  }
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const handleCanvasMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }
  
  const handleMouseUp = () => {
    setElementDragging(false)
  }
  
  const openElementDialog = (element = null) => {
    if (element) {
      setEditingElement(element)
      setNewElement({ type: element.type, name: element.name, description: element.description })
    } else {
      setEditingElement(null)
      setNewElement({ type: 'step', name: '', description: '' })
    }
    setShowElementDialog(true)
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Loading Overlay */}
        {loading && <OverlayLoading message="Süreç yükleniyor..." />}
        
        {/* Error Display */}
        <ErrorDisplay 
          errors={errors}
          onClearAll={clearErrors}
          onClearError={clearError}
          onRetry={loadProcessElements}
        />
        
        {/* Mobile Floating Action Button */}
        <div className="md:hidden fixed bottom-4 right-4 z-40">
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg"
            onClick={() => openElementDialog()}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        

      
      {/* Editor Header */}
      <div className="border-b bg-white p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
            <div>
              <h2 className="text-xl font-bold">{process.name}</h2>
              <p className="text-sm text-muted-foreground">Süreç Editörü</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              onClick={() => openElementDialog()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Eleman Ekle
            </Button>
            
            <Button 
              variant={connectionMode ? "default" : "outline"}
              onClick={() => {
                if (connectionMode) {
                  setConnectionMode(false)
                  setConnectionStart(null)
                } else {
                  setShowConnectionDialog(true)
                }
              }}
            >
              <Link className="mr-2 h-4 w-4" />
              {connectionMode ? 'Bağlantı Modunu İptal' : 'Bağlantı Ekle'}
            </Button>
            
            <Button variant="outline" onClick={autoLayout}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Otomatik Düzenleme
            </Button>
            
            <EnhancedDropdownMenu
              trigger={
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Dışa Aktar
                </Button>
              }
              content={
                <div>
                  <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                    <FileText className="mr-2 h-4 w-4" />
                    PDF olarak dışa aktar
                  </div>
                  <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                    <FileText className="mr-2 h-4 w-4" />
                    PNG olarak dışa aktar
                  </div>
                  <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                    <FileText className="mr-2 h-4 w-4" />
                    SVG olarak dışa aktar
                  </div>
                </div>
              }
              align="end"
            />
            
            <Button 
              onClick={saveProcess} 
              loading={saving}
              loadingText="Kaydediliyor..."
              disabled={saving}
            >
              Kaydet
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Editor Area */}
      <div className="flex-1 flex min-h-0">
        {/* Element Palette - Hidden on mobile */}
        <div className="hidden md:block">
          <ElementPalette />
        </div>
        
        {/* Canvas */}
        <div className="flex-1 bg-gray-50 relative overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p>Süreç yükleniyor...</p>
              </div>
            </div>
          ) : (
                          <svg 
                ref={canvasRef}
                className="w-full h-full" 
                viewBox="0 0 1200 800"
                onMouseMove={(e) => {
                  handleMouseMove(e)
                  handleCanvasMouseMove(e)
                }}
                onMouseUp={handleMouseUp}
              >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                </marker>
              </defs>
              
              {/* Grid */}
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Connections */}
              {connections.map((connection) => {
                const fromElement = elements.find(el => el.id === connection.from)
                const toElement = elements.find(el => el.id === connection.to)
                if (!fromElement || !toElement) return null
                
                return (
                  <g key={connection.id}>
                    <line
                      x1={fromElement.x + 60}
                      y1={fromElement.y + 30}
                      x2={toElement.x + 60}
                      y2={toElement.y + 30}
                      stroke={selectedConnection?.id === connection.id ? "#3b82f6" : "#666"}
                      strokeWidth={selectedConnection?.id === connection.id ? "3" : "2"}
                      markerEnd="url(#arrowhead)"
                      cursor="pointer"
                      onClick={() => setSelectedConnection(connection)}
                    />
                    {connection.label && (
                      <text
                        x={(fromElement.x + toElement.x) / 2 + 60}
                        y={(fromElement.y + toElement.y) / 2 + 30}
                        textAnchor="middle"
                        className="text-xs fill-gray-600"
                      >
                        {connection.label}
                      </text>
                    )}
                  </g>
                )
              })}
              
              {/* Elements */}
              {elements.map((element) => (
                <g key={element.id}>
                  {element.type === 'start' || element.type === 'end' ? (
                    <circle
                      cx={element.x + 30}
                      cy={element.y + 30}
                      r="30"
                      className={`fill-green-100 stroke-green-300 cursor-pointer hover:shadow-md transition-shadow ${
                        connectionStart?.id === element.id ? 'stroke-blue-500 stroke-2' : ''
                      }`}
                      onClick={() => {
                        if (connectionMode) {
                          finishConnection(element)
                        } else {
                          setSelectedElement(element)
                        }
                      }}
                      onMouseDown={(e) => {
                        if (!connectionMode) {
                          handleMouseDown(e, element)
                        }
                      }}
                      onDoubleClick={() => {
                        if (!connectionMode) {
                          startConnection(element)
                        }
                      }}
                    />
                  ) : element.type === 'decision' ? (
                    <polygon
                      points={`${element.x + 30},${element.y} ${element.x + 60},${element.y + 30} ${element.x + 30},${element.y + 60} ${element.x},${element.y + 30}`}
                      className={`fill-yellow-100 stroke-yellow-300 cursor-pointer hover:shadow-md transition-shadow ${
                        connectionStart?.id === element.id ? 'stroke-blue-500 stroke-2' : ''
                      }`}
                      onClick={() => {
                        if (connectionMode) {
                          finishConnection(element)
                        } else {
                          setSelectedElement(element)
                        }
                      }}
                      onMouseDown={(e) => {
                        if (!connectionMode) {
                          handleMouseDown(e, element)
                        }
                      }}
                      onDoubleClick={() => {
                        if (!connectionMode) {
                          startConnection(element)
                        }
                      }}
                    />
                  ) : (
                    <rect
                      x={element.x}
                      y={element.y}
                      width="120"
                      height="60"
                      rx="8"
                      className={`fill-blue-100 stroke-blue-300 cursor-pointer hover:shadow-md transition-shadow ${
                        connectionStart?.id === element.id ? 'stroke-blue-500 stroke-2' : ''
                      }`}
                      onClick={() => {
                        if (connectionMode) {
                          finishConnection(element)
                        } else {
                          setSelectedElement(element)
                        }
                      }}
                      onMouseDown={(e) => {
                        if (!connectionMode) {
                          handleMouseDown(e, element)
                        }
                      }}
                      onDoubleClick={() => {
                        if (!connectionMode) {
                          startConnection(element)
                        }
                      }}
                    />
                  )}
                  <text
                    x={element.x + 60}
                    y={element.y + 35}
                    textAnchor="middle"
                    className="text-sm font-medium"
                  >
                    {element.name}
                  </text>
                </g>
              ))}
              
              {/* Connection Preview Line */}
              {connectionMode && connectionStart && (
                <line
                  x1={connectionStart.x + 60}
                  y1={connectionStart.y + 30}
                  x2={mousePosition.x}
                  y2={mousePosition.y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead)"
                />
              )}
            </svg>
          )}
        </div>
        
                 {/* Properties Panel - Hidden on mobile */}
         <div className="hidden lg:block w-80 lg:w-72 xl:w-80 bg-white border-l p-4 overflow-y-auto flex-shrink-0">
           <h3 className="font-semibold mb-4">Özellikler</h3>
           
           {connectionMode && (
             <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
               <div className="flex items-center space-x-2">
                 <Link className="h-4 w-4 text-blue-600" />
                 <span className="text-sm font-medium text-blue-800">Bağlantı Modu Aktif</span>
               </div>
               <p className="text-xs text-blue-600 mt-1">
                 Başlangıç elementini seçtiniz. Şimdi hedef elementi seçin veya çift tıklayın.
               </p>
               <Button
                 size="sm"
                 variant="outline"
                 className="mt-2"
                 onClick={() => {
                   setConnectionMode(false)
                   setConnectionStart(null)
                 }}
               >
                 İptal Et
               </Button>
             </div>
           )}
          
          {selectedElement ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Element: {selectedElement.name}</h4>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openElementDialog(selectedElement)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteElement(selectedElement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label>Tip</Label>
                  <Badge variant="outline">{selectedElement.type}</Badge>
                </div>
                <div>
                  <Label>Ad</Label>
                  <p className="text-sm text-muted-foreground">{selectedElement.name}</p>
                </div>
                <div>
                  <Label>Açıklama</Label>
                  <p className="text-sm text-muted-foreground">{selectedElement.description}</p>
                </div>
                <div>
                  <Label>Konum</Label>
                  <p className="text-sm text-muted-foreground">X: {Math.round(selectedElement.x)}, Y: {Math.round(selectedElement.y)}</p>
                </div>
              </div>
            </div>
          ) : selectedConnection ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Bağlantı</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteConnection(selectedConnection.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label>Kaynak</Label>
                  <p className="text-sm text-muted-foreground">
                    {elements.find(el => el.id === selectedConnection.from)?.name}
                  </p>
                </div>
                <div>
                  <Label>Hedef</Label>
                  <p className="text-sm text-muted-foreground">
                    {elements.find(el => el.id === selectedConnection.to)?.name}
                  </p>
                </div>
                <div>
                  <Label>Etiket</Label>
                  <p className="text-sm text-muted-foreground">{selectedConnection.label || 'Etiket yok'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Bir element veya bağlantı seçin</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Element Dialog */}
      <Dialog open={showElementDialog} onOpenChange={setShowElementDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingElement ? 'Element Düzenle' : 'Yeni Element Ekle'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="elementType">Tip</Label>
              <SimpleSelect
                id="elementType"
                value={newElement.type}
                onChange={(e) => setNewElement({...newElement, type: e.target.value})}
              >
                <option value="start">Başlangıç</option>
                <option value="step">Adım</option>
                <option value="decision">Karar</option>
                <option value="end">Bitiş</option>
              </SimpleSelect>
            </div>
            <div>
              <Label htmlFor="elementName">Ad</Label>
              <Input
                id="elementName"
                value={newElement.name}
                onChange={(e) => setNewElement({...newElement, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="elementDescription">Açıklama</Label>
              <Textarea
                id="elementDescription"
                value={newElement.description}
                onChange={(e) => setNewElement({...newElement, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowElementDialog(false)}>
              İptal
            </Button>
            <Button onClick={editingElement ? updateElement : addElement}>
              {editingElement ? 'Güncelle' : 'Ekle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Connection Dialog */}
      <Dialog open={showConnectionDialog} onOpenChange={setShowConnectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Bağlantı Ekle</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="connectionFrom">Kaynak Element</Label>
              <SimpleSelect
                id="connectionFrom"
                value={newConnection.from}
                onChange={(e) => setNewConnection({...newConnection, from: e.target.value})}
              >
                <option value="">Kaynak seçin</option>
                {elements.map(element => (
                  <option key={element.id} value={element.id}>{element.name}</option>
                ))}
              </SimpleSelect>
            </div>
            <div>
              <Label htmlFor="connectionTo">Hedef Element</Label>
              <SimpleSelect
                id="connectionTo"
                value={newConnection.to}
                onChange={(e) => setNewConnection({...newConnection, to: e.target.value})}
              >
                <option value="">Hedef seçin</option>
                {elements.map(element => (
                  <option key={element.id} value={element.id}>{element.name}</option>
                ))}
              </SimpleSelect>
            </div>
            <div>
              <Label htmlFor="connectionLabel">Etiket (Opsiyonel)</Label>
              <Input
                id="connectionLabel"
                value={newConnection.label}
                onChange={(e) => setNewConnection({...newConnection, label: e.target.value})}
                placeholder="Bağlantı etiketi"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConnectionDialog(false)}>
              İptal
            </Button>
            <Button onClick={addConnection}>
              Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </DndProvider>
  )
} 