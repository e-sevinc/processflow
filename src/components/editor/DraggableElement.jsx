import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { getElementIcon, getElementColor, getElementShape } from '@/utils/elementUtils'

const ITEM_TYPE = 'PROCESS_ELEMENT'

export const DraggableElement = ({ 
  element, 
  onMove, 
  onSelect, 
  isSelected, 
  onEdit, 
  onDelete,
  scale = 1 
}) => {
  const ref = useRef(null)

  // Drag hook
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: element.id, type: element.type, x: element.x, y: element.y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // Drop hook
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item, monitor) => {
      if (!ref.current) return
      
      const dragIndex = item.id
      const hoverIndex = element.id

      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      onMove(dragIndex, hoverIndex)
      item.id = hoverIndex
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  // Ref'leri birleştir
  drag(drop(ref))

  const handleClick = (e) => {
    e.stopPropagation()
    onSelect(element)
  }

  const handleDoubleClick = (e) => {
    e.stopPropagation()
    onEdit(element)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(element.id)
  }

  const IconComponent = getElementIcon(element.type)
  const colorClass = getElementColor(element.type)
  const shapeClass = getElementShape(element.type)

  return (
    <div
      ref={ref}
      className={`
        absolute cursor-move select-none
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${isOver ? 'bg-blue-50' : ''}
        transition-all duration-200
      `}
      style={{
        left: element.x * scale,
        top: element.y * scale,
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`
          ${shapeClass}
          ${colorClass}
          min-w-[120px] min-h-[60px]
          flex items-center justify-center
          border-2 border-gray-300
          hover:border-gray-400
          transition-colors duration-200
          relative
        `}
      >
        <div className="flex flex-col items-center space-y-1">
          <IconComponent className="w-5 h-5" />
          <span className="text-xs font-medium text-center px-2">
            {element.name}
          </span>
        </div>

        {/* Seçili element için kontroller */}
        {isSelected && (
          <div className="absolute -top-8 -right-8 flex space-x-1">
            <button
              onClick={handleDelete}
              className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              title="Sil"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 