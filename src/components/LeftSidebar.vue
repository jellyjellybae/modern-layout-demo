<template>
  <div 
    class="left-sidebar" 
    :class="{ 
      'collapsed': uiStore.leftSidebarCollapsed,
      'mobile': uiStore.isMobile,
      'tablet': uiStore.isTablet
    }"
    :style="{ 
      width: uiStore.leftSidebarCollapsed ? '30px' : uiStore.responsiveLeftWidth + 'px' 
    }"
  >
    <!-- 顶部选项卡 -->
    <div class="sidebar-tabs">
      <el-tooltip 
        v-for="tab in tabs" 
        :key="tab.key"
        :content="uiStore.leftSidebarCollapsed ? `${tab.label} (鼠标悬停查看)` : tab.label"
        placement="right"
        :disabled="!uiStore.leftSidebarCollapsed"
      >
        <div 
          :class="['tab-item', { 'active': activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          <el-icon :size="16">
            <component :is="tab.icon" />
          </el-icon>
          <span v-show="!uiStore.leftSidebarCollapsed">{{ tab.label }}</span>
          <div v-if="uiStore.leftSidebarCollapsed && activeTab === tab.key" class="hover-indicator">
            <el-icon :size="10"><ArrowRight /></el-icon>
          </div>
        </div>
      </el-tooltip>
    </div>

    <!-- 折叠时的悬浮面板 -->
    <div 
      v-if="uiStore.leftSidebarCollapsed && activeTab === 'widgets'" 
      class="floating-panel"
      @mouseenter="showFloatingPanel = true"
      @mouseleave="showFloatingPanel = false"
    >
      <transition name="slide-right">
        <div v-show="showFloatingPanel" class="floating-content">
          <div class="content-header">
            <h4>Widgets</h4>
            <el-input 
              v-model="searchText" 
              placeholder="搜索组件..." 
              size="small"
              :prefix-icon="Search"
              clearable
            />
          </div>

          <el-collapse v-model="activeCategories" class="widget-categories">
            <el-collapse-item
              v-for="category in filteredCategories"
              :key="category.name"
              :title="category.label"
              :name="category.name"
            >
              <div class="widget-grid">
                <div
                  v-for="widget in category.widgets"
                  :key="widget.type"
                  class="widget-item"
                  draggable="true"
                  @dragstart="onDragStart(widget, $event)"
                  @dragend="onDragEnd"
                >
                  <div class="widget-icon">
                    <el-icon :size="20">
                      <component :is="widget.icon" />
                    </el-icon>
                  </div>
                  <span class="widget-name">{{ widget.name }}</span>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </transition>
    </div>

    <!-- 小组件面板 -->
    <div v-show="activeTab === 'widgets' && !uiStore.leftSidebarCollapsed" class="tab-content">
      <div class="content-header">
        <h4>Widgets</h4>
        <el-input 
          v-model="searchText" 
          placeholder="搜索组件..." 
          size="small"
          :prefix-icon="Search"
          clearable
        />
      </div>

      <el-collapse v-model="activeCategories" class="widget-categories">
        <el-collapse-item
          v-for="category in filteredCategories"
          :key="category.name"
          :title="category.label"
          :name="category.name"
        >
          <div class="widget-grid">
            <div
              v-for="widget in category.widgets"
              :key="widget.type"
              class="widget-item"
              draggable="true"
              @dragstart="onDragStart(widget, $event)"
              @dragend="onDragEnd"
            >
              <div class="widget-icon">
                <el-icon :size="20">
                  <component :is="widget.icon" />
                </el-icon>
              </div>
              <span class="widget-name">{{ widget.name }}</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 折叠时的层级悬浮面板 -->
    <div 
      v-if="uiStore.leftSidebarCollapsed && activeTab === 'hierarchy'" 
      class="floating-panel"
      @mouseenter="showFloatingPanel = true"
      @mouseleave="showFloatingPanel = false"
    >
      <transition name="slide-right">
        <div v-show="showFloatingPanel" class="floating-content">
          <div class="content-header">
            <h4>Hierarchy</h4>
            <el-button-group size="small">
              <el-button :icon="Plus" circle plain />
              <el-button :icon="Delete" circle plain />
            </el-button-group>
          </div>

          <div class="hierarchy-tree">
            <HierarchyNode 
              v-for="component in layoutStore.currentLayout.components"
              :key="component.id"
              :node="component"
              :level="0"
            />
            <div v-if="layoutStore.currentLayout.components.length === 0" class="empty-hierarchy">
              <el-icon class="empty-icon"><DocumentAdd /></el-icon>
              <span>暂无组件</span>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 层级面板 -->
    <div v-show="activeTab === 'hierarchy' && !uiStore.leftSidebarCollapsed" class="tab-content">
      <div class="content-header">
        <h4>Hierarchy</h4>
        <el-button-group size="small">
          <el-button :icon="Plus" circle plain />
          <el-button :icon="Delete" circle plain />
        </el-button-group>
      </div>

      <div class="hierarchy-tree">
        <HierarchyNode 
          v-for="component in layoutStore.currentLayout.components"
          :key="component.id"
          :node="component"
          :level="0"
        />
        <div v-if="layoutStore.currentLayout.components.length === 0" class="empty-hierarchy">
          <el-icon class="empty-icon"><DocumentAdd /></el-icon>
          <span>暂无组件</span>
        </div>
      </div>
    </div>

    <!-- 资源面板 -->
    <div v-show="activeTab === 'assets' && !uiStore.leftSidebarCollapsed" class="tab-content">
      <div class="content-header">
        <h4>Assets</h4>
        <el-button-group size="small">
          <el-button :icon="Upload" circle plain />
          <el-button :icon="FolderAdd" circle plain />
        </el-button-group>
      </div>

      <div class="assets-grid">
        <div v-for="asset in assets" :key="asset.id" class="asset-item">
          <div class="asset-preview">
            <el-icon><Picture /></el-icon>
          </div>
          <span class="asset-name">{{ asset.name }}</span>
        </div>
      </div>
    </div>

    <!-- 调整手柄 -->
    <div 
      v-if="!uiStore.leftSidebarCollapsed && !uiStore.isMobile"
      class="resize-handle resize-handle-right"
      @mousedown="startLeftResize"
    >
      <div class="resize-handle-inner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Grid, List, FolderOpened, Search, Plus, Delete, 
  DocumentAdd, Upload, FolderAdd, Picture, ArrowRight
} from '@element-plus/icons-vue'
import { componentDefinitions } from '@/config/components'
import { useLayoutStore } from '@/stores/layout'
import { useUIStore } from '@/stores/ui'
import { useDragDrop } from '@/composables/useDragDrop'
import { useResize } from '@/composables/useResize'
import HierarchyNode from './HierarchyNode.vue'
import type { DragItem } from '@/types/layout'

const layoutStore = useLayoutStore()
const uiStore = useUIStore()
const { startDrag, onDragEnd } = useDragDrop()
const { startResize } = useResize()

const activeTab = ref('widgets')
const searchText = ref('')
const activeCategories = ref(['basic', 'layout'])
const showFloatingPanel = ref(false)

const tabs = [
  { key: 'widgets', label: 'Widgets', icon: Grid },
  { key: 'hierarchy', label: 'Hierarchy', icon: List },
  { key: 'assets', label: 'Assets', icon: FolderOpened }
]

const categories = [
  { 
    name: 'basic', 
    label: 'Basic',
    widgets: componentDefinitions.filter(w => w.category === 'basic')
  },
  { 
    name: 'layout', 
    label: 'Layout',
    widgets: componentDefinitions.filter(w => w.category === 'layout')
  },
  { 
    name: 'form', 
    label: 'Form',
    widgets: componentDefinitions.filter(w => w.category === 'form')
  },
  { 
    name: 'media', 
    label: 'Media',
    widgets: componentDefinitions.filter(w => w.category === 'media')
  }
]

const filteredCategories = computed(() => {
  if (!searchText.value) return categories
  
  return categories.map(category => ({
    ...category,
    widgets: category.widgets.filter(widget => 
      widget.name.toLowerCase().includes(searchText.value.toLowerCase())
    )
  })).filter(category => category.widgets.length > 0)
})

const assets = ref([
  { id: 1, name: 'image1.png', type: 'image' },
  { id: 2, name: 'icon.svg', type: 'image' },
  { id: 3, name: 'photo.jpg', type: 'image' }
])

function onDragStart(widget: any, event: DragEvent) {
  const dragItem: DragItem = {
    componentType: widget.type,
    isNew: true
  }
  startDrag(dragItem, event)
}

function startLeftResize(event: MouseEvent) {
  startResize(
    event,
    'left',
    uiStore.leftSidebarWidth,
    (width: number) => {
      uiStore.setLeftSidebarWidth(width)
    }
  )
}
</script>

<style scoped>
.left-sidebar {
  height: calc(100vh - 48px);
  width: 100%;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-normal);
  overflow: hidden;
  position: relative;
}

.left-sidebar.collapsed {
  overflow: visible;
}

.left-sidebar.collapsed .sidebar-tabs {
  flex-direction: column;
}

.left-sidebar.collapsed .tab-item {
  justify-content: center;
  padding: 12px 4px;
}

/* 悬浮面板样式 */
.floating-panel {
  position: absolute;
  top: 0;
  left: 100%;
  height: 100%;
  z-index: 1000;
  pointer-events: none;
}

.floating-content {
  width: var(--floating-width, 280px);
  height: 100%;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-left: none;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  pointer-events: auto;
}

/* 移动端优化 */
.left-sidebar.mobile .floating-content {
  --floating-width: 240px;
  position: fixed;
  left: 48px;
  top: 48px;
  height: calc(100vh - 48px);
  z-index: 2000;
}

.left-sidebar.tablet .floating-content {
  --floating-width: 260px;
}

/* 小屏幕组件网格优化 */
.left-sidebar.mobile .widget-grid {
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.left-sidebar.mobile .widget-item {
  padding: 8px 4px;
  font-size: 11px;
}

.left-sidebar.mobile .widget-icon {
  margin-bottom: 4px;
}

.left-sidebar.mobile .widget-name {
  font-size: 10px;
}

/* 滑动动画 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform var(--transition-normal), opacity var(--transition-normal);
}

.slide-right-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

/* 悬停指示器 */
.hover-indicator {
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* 调整手柄样式 */
.resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: col-resize;
  background: transparent;
  z-index: 1001;
  transition: background-color var(--transition-fast);
}

.resize-handle-right {
  right: -4px;
}

.resize-handle:hover {
  background: rgba(99, 102, 241, 0.1);
}

.resize-handle-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 40px;
  background: var(--border-color);
  border-radius: 1px;
  transition: all var(--transition-fast);
}

.resize-handle:hover .resize-handle-inner {
  background: var(--primary-color);
  width: 3px;
  height: 60px;
}

.sidebar-tabs {
  display: flex;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 2px solid transparent;
  transition: var(--transition-fast);
  position: relative;
}

.tab-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.tab-item.active {
  background: var(--bg-primary);
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-secondary);
}

.content-header h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.widget-categories {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.widget-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px 8px;
}

.widget-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  cursor: grab;
  transition: var(--transition-normal);
  aspect-ratio: 1;
}

.widget-item:hover {
  border-color: var(--primary-light);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.widget-item:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.widget-icon {
  color: var(--primary-color);
  margin-bottom: 6px;
}

.widget-name {
  font-size: 11px;
  color: var(--text-secondary);
  text-align: center;
  font-weight: 500;
}

.hierarchy-tree {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.empty-hierarchy {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-tertiary);
  gap: 8px;
}

.empty-icon {
  font-size: 32px;
  opacity: 0.6;
}

.assets-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}

.asset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  cursor: pointer;
  transition: var(--transition-normal);
}

.asset-item:hover {
  border-color: var(--primary-light);
  box-shadow: var(--shadow-sm);
}

.asset-preview {
  width: 48px;
  height: 48px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: var(--text-tertiary);
}

.asset-name {
  font-size: 11px;
  color: var(--text-secondary);
  text-align: center;
  word-break: break-all;
}

:deep(.el-collapse) {
  border: none !important;
}

:deep(.el-collapse-item__header) {
  height: 36px !important;
  padding: 0 12px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  background: var(--bg-tertiary) !important;
  border: none !important;
  border-radius: var(--radius-sm) !important;
  margin-bottom: 4px !important;
}

:deep(.el-collapse-item__content) {
  padding: 0 !important;
  background: transparent !important;
}
</style>