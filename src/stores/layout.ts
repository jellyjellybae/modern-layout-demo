import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LayoutConfig, ComponentConfig } from '@/types/layout'

export const useLayoutStore = defineStore('layout', () => {
  const currentLayout = ref<LayoutConfig>({
    version: '1.0.0',
    title: '新建布局',
    components: []
  })

  const selectedComponentId = ref<string | null>(null)
  const draggedComponent = ref<any>(null)
  const hoveredComponentId = ref<string | null>(null)

  const selectedComponent = computed(() => {
    if (!selectedComponentId.value) return null
    return findComponentById(currentLayout.value.components, selectedComponentId.value)
  })

  function findComponentById(components: ComponentConfig[], id: string): ComponentConfig | null {
    for (const component of components) {
      if (component.id === id) return component
      if (component.children) {
        const found = findComponentById(component.children, id)
        if (found) return found
      }
      if (component.slots) {
        for (const slotComponents of Object.values(component.slots)) {
          const found = findComponentById(slotComponents, id)
          if (found) return found
        }
      }
    }
    return null
  }

  function addComponent(component: ComponentConfig, parentId?: string, slotName?: string) {
    if (!parentId) {
      currentLayout.value.components.push(component)
    } else {
      const parent = findComponentById(currentLayout.value.components, parentId)
      if (parent) {
        if (slotName && parent.slots) {
          if (!parent.slots[slotName]) {
            parent.slots[slotName] = []
          }
          parent.slots[slotName].push(component)
        } else if (parent.children) {
          parent.children.push(component)
        } else {
          parent.children = [component]
        }
      }
    }
  }

  function removeComponent(id: string) {
    function removeFromArray(components: ComponentConfig[]): boolean {
      const index = components.findIndex(c => c.id === id)
      if (index !== -1) {
        components.splice(index, 1)
        return true
      }
      for (const component of components) {
        if (component.children && removeFromArray(component.children)) {
          return true
        }
        if (component.slots) {
          for (const slotComponents of Object.values(component.slots)) {
            if (removeFromArray(slotComponents)) {
              return true
            }
          }
        }
      }
      return false
    }
    removeFromArray(currentLayout.value.components)
    if (selectedComponentId.value === id) {
      selectedComponentId.value = null
    }
  }

  function updateComponent(id: string, updates: Partial<ComponentConfig>) {
    const component = findComponentById(currentLayout.value.components, id)
    if (component) {
      Object.assign(component, updates)
    }
  }

  function loadLayout(layout: LayoutConfig) {
    currentLayout.value = layout
    selectedComponentId.value = null
  }

  function clearLayout() {
    currentLayout.value = {
      version: '1.0.0',
      title: '新建布局',
      components: []
    }
    selectedComponentId.value = null
  }

  function getComponentById(id: string): ComponentConfig | null {
    return findComponentById(currentLayout.value.components, id)
  }

  function updateComponentStyle(id: string, styleUpdates: Record<string, any>) {
    const component = findComponentById(currentLayout.value.components, id)
    if (component) {
      component.style = { ...component.style, ...styleUpdates }
    }
  }

  return {
    currentLayout,
    selectedComponentId,
    selectedComponent,
    draggedComponent,
    hoveredComponentId,
    findComponentById,
    getComponentById,
    addComponent,
    removeComponent,
    updateComponent,
    updateComponentStyle,
    loadLayout,
    clearLayout
  }
})