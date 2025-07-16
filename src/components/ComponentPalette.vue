<template>
  <div class="component-palette">
    <div class="palette-header">
      <h3>组件库</h3>
    </div>
    
    <el-collapse v-model="activeCategories" accordion>
      <el-collapse-item
        v-for="category in categories"
        :key="category"
        :title="categoryNames[category]"
        :name="category"
      >
        <div class="component-grid">
          <div
            v-for="definition in getComponentsByCategory(category)"
            :key="definition.type"
            class="component-item"
            draggable="true"
            @dragstart="onDragStart(definition, $event)"
            @dragend="onDragEnd"
          >
            <el-icon class="component-icon">
              <component :is="definition.icon" />
            </el-icon>
            <span class="component-name">{{ definition.name }}</span>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { componentDefinitions } from '@/config/components'
import { useDragDrop } from '@/composables/useDragDrop'
import type { DragItem } from '@/types/layout'

const { startDrag, onDragEnd } = useDragDrop()

const activeCategories = ref(['layout'])

const categoryNames = {
  layout: '布局组件',
  basic: '基础组件',
  form: '表单组件',
  media: '媒体组件'
}

const categories = computed(() => {
  const cats = new Set(componentDefinitions.map(def => def.category))
  return Array.from(cats)
})

function getComponentsByCategory(category: string) {
  return componentDefinitions.filter(def => def.category === category)
}

function onDragStart(definition: any, event: DragEvent) {
  const dragItem: DragItem = {
    componentType: definition.type,
    isNew: true
  }
  startDrag(dragItem, event)
}
</script>

<style scoped>
.component-palette {
  width: 280px;
  height: 100vh;
  border-right: 1px solid var(--border-color);
  background: var(--bg-primary);
  overflow-y: auto;
  backdrop-filter: blur(8px);
}

.palette-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-light);
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.palette-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 20px 16px;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 12px;
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  cursor: grab;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.component-item::before {
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

.component-item:hover::before {
  opacity: 0.05;
}

.component-item:hover {
  border-color: var(--primary-light);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px) scale(1.02);
}

.component-item:active {
  cursor: grabbing;
  transform: scale(0.98) translateY(-2px);
  box-shadow: var(--shadow-md);
}

.component-icon {
  font-size: 28px;
  color: var(--primary-color);
  margin-bottom: 12px;
  transition: var(--transition-normal);
  z-index: 1;
  position: relative;
}

.component-item:hover .component-icon {
  color: var(--primary-light);
  transform: scale(1.1);
}

.component-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: center;
  transition: var(--transition-normal);
  z-index: 1;
  position: relative;
}

.component-item:hover .component-name {
  color: var(--text-primary);
}

/* 折叠面板美化 */
:deep(.el-collapse-item__header) {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%) !important;
  border: 1px solid var(--border-light) !important;
  box-shadow: var(--shadow-sm) !important;
  font-size: 14px !important;
  transition: var(--transition-normal) !important;
}

:deep(.el-collapse-item__header:hover) {
  border-color: var(--primary-light) !important;
  box-shadow: var(--shadow-md) !important;
}

:deep(.el-collapse-item__content) {
  border: none !important;
  background: transparent !important;
}
</style>