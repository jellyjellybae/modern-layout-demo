import { ref, computed } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import type { ComponentConfig } from '@/types/layout'

export function useFreeDrag() {
  const layoutStore = useLayoutStore()
  const isDraggingComponent = ref(false)
  const draggedComponentId = ref<string | null>(null)
  const dragStartPos = ref({ x: 0, y: 0 })
  const componentStartPos = ref({ x: 0, y: 0 })
  const dragOffset = ref({ x: 0, y: 0 })

  const isDragging = computed(() => isDraggingComponent.value)

  function startComponentDrag(event: MouseEvent, componentId: string) {
    // 防止事件冒泡到父组件
    event.stopPropagation()
    event.preventDefault()

    const component = layoutStore.getComponentById(componentId)
    if (!component) return

    isDraggingComponent.value = true
    draggedComponentId.value = componentId
    
    // 记录拖拽开始位置
    dragStartPos.value = { x: event.clientX, y: event.clientY }
    
    // 获取组件当前位置 - 解析px值
    const currentX = parseFloat(component.style.left?.replace('px', '') || '0')
    const currentY = parseFloat(component.style.top?.replace('px', '') || '0')
    componentStartPos.value = { x: currentX, y: currentY }

    // 确保组件是绝对定位
    layoutStore.updateComponentStyle(componentId, {
      position: 'absolute',
      zIndex: '1000',
      cursor: 'grabbing'
    })

    // 添加全局鼠标事件监听
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    // 阻止文本选择
    document.body.style.userSelect = 'none'
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isDraggingComponent.value || !draggedComponentId.value) return

    const deltaX = event.clientX - dragStartPos.value.x
    const deltaY = event.clientY - dragStartPos.value.y

    const newX = componentStartPos.value.x + deltaX
    const newY = componentStartPos.value.y + deltaY

    // 更新拖拽偏移量用于视觉反馈
    dragOffset.value = { x: deltaX, y: deltaY }

    // 实时更新组件位置
    layoutStore.updateComponentStyle(draggedComponentId.value, {
      left: `${newX}px`,
      top: `${newY}px`
    })
  }

  function handleMouseUp(event: MouseEvent) {
    if (!isDraggingComponent.value || !draggedComponentId.value) return

    // 恢复组件样式
    layoutStore.updateComponentStyle(draggedComponentId.value, {
      cursor: 'grab',
      zIndex: 'auto'
    })

    // 清理状态
    isDraggingComponent.value = false
    draggedComponentId.value = null
    dragOffset.value = { x: 0, y: 0 }

    // 移除全局事件监听
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    
    // 恢复文本选择
    document.body.style.userSelect = ''
  }

  function enableFreeDragging(componentId: string) {
    const component = layoutStore.getComponentById(componentId)
    if (!component) return

    // 设置组件为可拖拽的绝对定位
    const currentStyle = component.style || {}
    
    layoutStore.updateComponentStyle(componentId, {
      ...currentStyle,
      position: currentStyle.position || 'absolute',
      left: currentStyle.left || '0px',
      top: currentStyle.top || '0px',
      cursor: 'grab'
    })
  }

  function getDragStyle(componentId: string) {
    if (draggedComponentId.value === componentId && isDraggingComponent.value) {
      return {
        transform: `translate(${dragOffset.value.x}px, ${dragOffset.value.y}px)`,
        transition: 'none',
        opacity: '0.8'
      }
    }
    return {}
  }

  return {
    isDragging,
    draggedComponentId: computed(() => draggedComponentId.value),
    startComponentDrag,
    enableFreeDragging,
    getDragStyle
  }
}