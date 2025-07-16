import { ref } from 'vue'
import type { DragItem, ComponentConfig } from '@/types/layout'
import { componentDefinitions } from '@/config/components'
import { useLayoutStore } from '@/stores/layout'

export function useDragDrop() {
  const layoutStore = useLayoutStore()
  const isDragging = ref(false)
  const dragOverTarget = ref<string | null>(null)

  function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  function createComponentFromType(type: string): ComponentConfig {
    const definition = componentDefinitions.find(def => def.type === type)
    if (!definition) {
      throw new Error(`Unknown component type: ${type}`)
    }

    return {
      id: generateId(),
      type: definition.type,
      props: { ...definition.defaultProps },
      style: { ...definition.defaultStyle },
      children: definition.allowChildren ? [] : undefined,
      slots: definition.slots ? definition.slots.reduce((acc, slot) => {
        acc[slot] = []
        return acc
      }, {} as Record<string, ComponentConfig[]>) : undefined
    }
  }

  function startDrag(item: DragItem, event: DragEvent) {
    if (!event.dataTransfer) return

    isDragging.value = true
    layoutStore.draggedComponent = item
    
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('application/json', JSON.stringify(item))
  }

  function onDragOver(event: DragEvent, targetId?: string) {
    event.preventDefault()
    if (!event.dataTransfer) return

    event.dataTransfer.dropEffect = 'copy'
    dragOverTarget.value = targetId || null
  }

  function onDragLeave() {
    dragOverTarget.value = null
  }

  function onDrop(event: DragEvent, parentId?: string, slotName?: string) {
    event.preventDefault()
    if (!event.dataTransfer) return

    try {
      const dragItem: DragItem = JSON.parse(event.dataTransfer.getData('application/json'))
      
      let component: ComponentConfig
      if (dragItem.isNew) {
        component = createComponentFromType(dragItem.componentType)
      } else if (dragItem.config) {
        component = { ...dragItem.config, id: generateId() }
      } else {
        return
      }

      layoutStore.addComponent(component, parentId, slotName)
      layoutStore.selectedComponentId = component.id
    } catch (error) {
      console.error('Drop error:', error)
    } finally {
      isDragging.value = false
      dragOverTarget.value = null
      layoutStore.draggedComponent = null
    }
  }

  function onDragEnd() {
    isDragging.value = false
    dragOverTarget.value = null
    layoutStore.draggedComponent = null
  }

  return {
    isDragging,
    dragOverTarget,
    startDrag,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
    createComponentFromType
  }
}