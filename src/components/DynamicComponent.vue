<template>
  <div
    :class="[
      'dynamic-component-wrapper',
      { 'selected': isSelected, 'hovered': isHovered, 'drag-over': isDragOver, 'free-dragging': isFreeDragging }
    ]"
    :style="freeDragStyle"
    @click.stop="selectComponent"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @mousedown="handleMouseDown"
  >
    <component
      :is="componentMap[config.type]"
      v-bind="config.props"
      :style="config.style"
      class="dynamic-component"
    >
      <!-- 对于容器类组件，显示子组件 -->
      <template v-if="config.children">
        <div v-if="config.children.length === 0" class="empty-container">
          <el-icon class="empty-icon"><Plus /></el-icon>
          <span>拖拽组件到此处</span>
        </div>
        <DynamicComponent
          v-for="child in config.children"
          :key="child.id"
          :config="child"
        />
      </template>
      
      <!-- 对于有slots的组件 -->
      <template v-if="config.slots" #[slotName]="slotProps" v-for="(slotComponents, slotName) in config.slots" :key="slotName">
        <div
          :class="['slot-container', `slot-${slotName}`]"
          @dragover="(e) => onSlotDragOver(e, slotName)"
          @drop="(e) => onSlotDrop(e, slotName)"
        >
          <DynamicComponent
            v-for="component in slotComponents"
            :key="component.id"
            :config="component"
          />
          <div v-if="slotComponents.length === 0" class="empty-slot">
            拖拽组件到此处
          </div>
        </div>
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { ComponentConfig } from '@/types/layout'
import { useLayoutStore } from '@/stores/layout'
import { useDragDrop } from '@/composables/useDragDrop'
import { useFreeDrag } from '@/composables/useFreeDrag'

import ButtonComponent from './ui/ButtonComponent.vue'
import InputComponent from './ui/InputComponent.vue'
import TextComponent from './ui/TextComponent.vue'
import ImageComponent from './ui/ImageComponent.vue'
import ContainerComponent from './ui/ContainerComponent.vue'
import CardComponent from './ui/CardComponent.vue'

interface Props {
  config: ComponentConfig
}

const props = defineProps<Props>()

const layoutStore = useLayoutStore()
const { onDragOver, onDragLeave, onDrop } = useDragDrop()
const { isDragging: isFreeDragging, draggedComponentId, startComponentDrag, enableFreeDragging, getDragStyle } = useFreeDrag()

const isDragOver = ref(false)

const componentMap = {
  button: ButtonComponent,
  input: InputComponent,
  text: TextComponent,
  image: ImageComponent,
  container: ContainerComponent,
  card: CardComponent
}

const isSelected = computed(() => 
  layoutStore.selectedComponentId === props.config.id
)

const isHovered = computed(() => 
  layoutStore.hoveredComponentId === props.config.id
)

const freeDragStyle = computed(() => getDragStyle(props.config.id))

function selectComponent() {
  layoutStore.selectedComponentId = props.config.id
}

function onMouseEnter() {
  layoutStore.hoveredComponentId = props.config.id
}

function onMouseLeave() {
  layoutStore.hoveredComponentId = null
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  
  // 只有容器类组件才允许接收子组件
  if (props.config.children !== undefined) {
    onDragOver(event, props.config.id)
    isDragOver.value = true
  }
}

function handleDragLeave(event: DragEvent) {
  event.stopPropagation()
  onDragLeave()
  isDragOver.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  
  // 只有容器类组件才允许接收子组件
  if (props.config.children !== undefined) {
    onDrop(event, props.config.id)
  }
  isDragOver.value = false
}

function onSlotDragOver(event: DragEvent, slotName: string) {
  event.preventDefault()
  event.stopPropagation()
  onDragOver(event, props.config.id)
}

function onSlotDrop(event: DragEvent, slotName: string) {
  event.preventDefault()
  event.stopPropagation()
  onDrop(event, props.config.id, slotName)
}

function handleMouseDown(event: MouseEvent) {
  // 只有在按下鼠标左键时才开始拖拽，但要确保不在组件内部的交互元素上
  if (event.button === 0) {
    const target = event.target as HTMLElement
    const wrapper = event.currentTarget as HTMLElement
    
    // 检查是否点击在组件包装器上，而不是子元素上
    if (target === wrapper || target.closest('.dynamic-component-wrapper') === wrapper) {
      startComponentDrag(event, props.config.id)
    }
  }
}

onMounted(() => {
  // 启用组件的自由拖拽功能
  enableFreeDragging(props.config.id)
})
</script>

<style scoped>
.dynamic-component-wrapper {
  position: relative;
  transition: var(--transition-normal);
  border-radius: var(--radius-md);
  display: inline-block;
  width: auto;
  max-width: 100%;
}

.dynamic-component-wrapper.selected {
  outline: 3px solid var(--primary-color);
  outline-offset: 3px;
  box-shadow: 0 0 0 1px var(--primary-color), var(--shadow-lg);
}

.dynamic-component-wrapper.hovered {
  outline: 2px dashed var(--primary-light);
  outline-offset: 2px;
  transform: scale(1.01);
}

.dynamic-component-wrapper.drag-over {
  outline: 3px solid var(--secondary-color);
  outline-offset: 3px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.1));
  box-shadow: inset 0 0 0 1px var(--secondary-color), var(--shadow-lg);
  border-radius: var(--radius-lg);
}

.dynamic-component-wrapper.free-dragging {
  opacity: 0.8;
  transform: scale(1.02);
  z-index: 1000;
  box-shadow: var(--shadow-xl);
  cursor: grabbing !important;
}

.dynamic-component {
  border-radius: inherit;
  display: inline-block;
  max-width: 100%;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  border: 2px dashed var(--border-color);
  color: var(--text-tertiary);
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  transition: var(--transition-normal);
  margin: 12px;
  position: relative;
  overflow: hidden;
}

.empty-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  opacity: 0;
  transition: var(--transition-normal);
  z-index: 0;
}

.empty-container:hover::before {
  opacity: 0.03;
}

.empty-container:hover {
  border-color: var(--primary-light);
  color: var(--text-secondary);
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 12px;
  color: var(--primary-color);
  opacity: 0.6;
  animation: bounce 2s ease-in-out infinite;
  z-index: 1;
  position: relative;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-4px); }
}

.empty-container span {
  z-index: 1;
  position: relative;
}

.slot-container {
  min-height: 80px;
  position: relative;
  border: 1px dashed var(--border-light);
  border-radius: var(--radius-md);
  margin: 8px;
  padding: 12px;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  transition: var(--transition-normal);
}

.slot-container:hover {
  border-color: var(--primary-light);
  box-shadow: var(--shadow-sm);
}

.empty-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  border: 2px dashed var(--border-color);
  color: var(--text-tertiary);
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.empty-slot::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  opacity: 0;
  transition: var(--transition-normal);
  z-index: 0;
}

.empty-slot:hover::before {
  opacity: 0.03;
}

.empty-slot:hover {
  border-color: var(--primary-light);
  color: var(--text-secondary);
  transform: scale(1.01);
  box-shadow: var(--shadow-sm);
}
</style>