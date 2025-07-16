export interface ComponentConfig {
  id: string
  type: string
  props: Record<string, any>
  style: Record<string, any>
  children?: ComponentConfig[]
  slots?: Record<string, ComponentConfig[]>
}

export interface LayoutConfig {
  version: string
  title: string
  description?: string
  components: ComponentConfig[]
  globalStyles?: Record<string, any>
  metadata?: Record<string, any>
}

export interface ComponentDefinition {
  type: string
  name: string
  icon: string
  category: string
  defaultProps: Record<string, any>
  defaultStyle: Record<string, any>
  propsSchema: Record<string, any>
  allowChildren: boolean
  slots?: string[]
}

export interface DragItem {
  componentType: string
  isNew: boolean
  config?: ComponentConfig
}