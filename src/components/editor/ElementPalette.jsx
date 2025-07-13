import { useDrag } from 'react-dnd'
import { Card, CardContent } from '@/components/ui/card'
import { getElementTypes } from '@/utils/elementUtils'

const ITEM_TYPE = 'NEW_ELEMENT'

const elementTypes = getElementTypes()

const DraggableElementType = ({ elementType }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { 
      type: elementType.type, 
      name: elementType.name,
      isNew: true 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const IconComponent = elementType.icon

  return (
    <div
      ref={drag}
      className={`
        cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        transition-opacity duration-200
      `}
    >
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full ${elementType.color} flex items-center justify-center`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{elementType.name}</p>
              <p className="text-xs text-gray-500 capitalize">{elementType.type}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const ElementPalette = () => {
  return (
    <div className="bg-white border-r border-gray-200 w-64 lg:w-72 xl:w-80 p-4 overflow-y-auto flex-shrink-0">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Elementler</h3>
        <p className="text-sm text-gray-600">
          Elementleri sürükleyip canvas'a bırakın
        </p>
      </div>

      <div className="space-y-2">
        {elementTypes.map((elementType) => (
          <DraggableElementType 
            key={elementType.type} 
            elementType={elementType} 
          />
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Kullanım İpuçları</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Elementleri sürükleyip canvas'a bırakın</li>
          <li>• Çift tıklayarak düzenleyin</li>
          <li>• Seçili elementleri silmek için × butonunu kullanın</li>
          <li>• Bağlantı kurmak için elementleri birbirine yaklaştırın</li>
        </ul>
      </div>
    </div>
  )
} 