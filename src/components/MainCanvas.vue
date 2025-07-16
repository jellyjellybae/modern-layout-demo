<template>
  <div class="main-canvas">
    <!-- 工具栏 -->
    <div class="canvas-toolbar" :class="{ 'mobile': uiStore.isMobile }">
      <div class="toolbar-section" v-if="!uiStore.isMobile">
        <el-button-group size="small">
          <el-button :icon="Pointer" plain>选择</el-button>
          <el-button :icon="Position" plain>移动</el-button>
          <el-button :icon="ZoomIn" plain>缩放</el-button>
        </el-button-group>
      </div>
      
      <!-- 移动端简化工具 -->
      <div class="toolbar-section mobile-tools" v-else>
        <el-button-group size="small">
          <el-button :icon="Pointer" circle plain />
          <el-button :icon="Position" circle plain />
          <el-button :icon="ZoomIn" circle plain />
        </el-button-group>
      </div>
      
      <div class="toolbar-section zoom-section">
        <span class="zoom-info">{{ Math.round(zoomLevel * 100) }}%</span>
        <el-slider 
          v-model="zoomLevel" 
          :min="0.25" 
          :max="2" 
          :step="0.25"
          :show-tooltip="false"
          :style="{ width: uiStore.isMobile ? '60px' : '100px', margin: '0 12px' }"
        />
      </div>

      <div class="toolbar-section" v-if="!uiStore.isMobile">
        <el-button-group size="small">
          <el-button :icon="Grid" plain :type="showGrid ? 'primary' : ''" @click="showGrid = !showGrid">
            网格
          </el-button>
          <el-button :icon="Aim" plain :type="showRuler ? 'primary' : ''" @click="showRuler = !showRuler">
            标尺
          </el-button>
        </el-button-group>
      </div>

      <!-- 移动端简化的网格和标尺 -->
      <div class="toolbar-section mobile-toggles" v-else>
        <el-button-group size="small">
          <el-button :icon="Grid" circle plain :type="showGrid ? 'primary' : ''" @click="showGrid = !showGrid" />
          <el-button :icon="Aim" circle plain :type="showRuler ? 'primary' : ''" @click="showRuler = !showRuler" />
        </el-button-group>
      </div>

      <div class="toolbar-section device-section" v-if="!uiStore.isMobile">
        <el-dropdown>
          <el-button size="small" plain>
            {{ selectedDevice }} <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="selectDevice('Desktop', 1200)">Desktop (1200px)</el-dropdown-item>
              <el-dropdown-item @click="selectDevice('Tablet', 768)">Tablet (768px)</el-dropdown-item>
              <el-dropdown-item @click="selectDevice('Mobile', 375)">Mobile (375px)</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 画布区域 -->
    <div class="canvas-viewport" ref="canvasViewport" :class="{ 'mobile': uiStore.isMobile }">
      <div 
        class="canvas-container"
        :class="{ 
          'show-grid': showGrid, 
          'drag-over': isDragOver,
          'mobile': uiStore.isMobile
        }"
        :style="{ 
          transform: `scale(${zoomLevel})`,
          width: Math.min(canvasWidth, uiStore.isMobile ? uiStore.screenWidth - 100 : canvasWidth) + 'px',
          minHeight: uiStore.isMobile ? '400px' : '600px'
        }"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
        <!-- 标尺 -->
        <div v-if="showRuler" class="rulers">
          <div class="ruler ruler-horizontal">
            <div 
              v-for="i in Math.ceil(canvasWidth / 50)" 
              :key="`h-${i}`"
              class="ruler-mark"
              :style="{ left: i * 50 + 'px' }"
            >
              {{ i * 50 }}
            </div>
          </div>
          <div class="ruler ruler-vertical">
            <div 
              v-for="i in 20" 
              :key="`v-${i}`"
              class="ruler-mark"
              :style="{ top: i * 50 + 'px' }"
            >
              {{ i * 50 }}
            </div>
          </div>
        </div>

        <!-- 画布内容 -->
        <div class="canvas-content">
          <div v-if="layoutStore.currentLayout.components.length === 0" class="empty-canvas">
            <div class="empty-content">
              <el-icon class="empty-icon"><Grid /></el-icon>
              <h3>Start Building</h3>
              <p>Drag widgets from the left panel to create your layout</p>
            </div>
          </div>
          
          <div class="components-container">
            <DynamicComponent
              v-for="component in layoutStore.currentLayout.components"
              :key="component.id"
              :config="component"
            />
          </div>
        </div>

        <!-- 选择框 -->
        <div 
          v-if="selectionBox" 
          class="selection-box"
          :style="selectionBox"
        ></div>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="status-bar">
      <div class="status-item">
        <span>Components: {{ layoutStore.currentLayout.components.length }}</span>
      </div>
      <div class="status-item">
        <span>Selected: {{ selectedComponent?.type || 'None' }}</span>
      </div>
      <div class="status-item">
        <span>{{ canvasWidth }} × {{ canvasHeight }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Pointer, Position, ZoomIn, Grid, Aim, ArrowDown
} from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/layout'
import { useUIStore } from '@/stores/ui'
import { useDragDrop } from '@/composables/useDragDrop'
import DynamicComponent from './DynamicComponent.vue'

const layoutStore = useLayoutStore()
const uiStore = useUIStore()
const { onDragOver, onDragLeave, onDrop } = useDragDrop()

const canvasViewport = ref<HTMLElement>()
const zoomLevel = ref(1)
const showGrid = ref(true)
const showRuler = ref(false)
const selectedDevice = ref('Desktop')
const canvasWidth = ref(1200)
const canvasHeight = ref(800)
const isDragOver = ref(false)
const selectionBox = ref<any>(null)

const selectedComponent = computed(() => layoutStore.selectedComponent)

function selectDevice(device: string, width: number) {
  selectedDevice.value = device
  canvasWidth.value = width
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  onDragOver(event)
  isDragOver.value = true
}

function handleDragLeave(event: DragEvent) {
  onDragLeave()
  isDragOver.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  onDrop(event)
  isDragOver.value = false
}

onMounted(() => {
  // 可以添加键盘快捷键等功能
})
</script>

<style scoped>
.main-canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
  background: var(--bg-secondary);
}

.canvas-toolbar {
  height: 44px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
  overflow-y: hidden;
}

.canvas-toolbar.mobile {
  height: 40px;
  padding: 0 8px;
  gap: 8px;
}

.canvas-toolbar.mobile .toolbar-section {
  flex-shrink: 0;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-info {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  min-width: 40px;
}

.canvas-viewport {
  flex: 1;
  overflow: auto;
  background: var(--bg-tertiary);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.canvas-viewport.mobile {
  padding: 20px 10px;
  align-items: flex-start;
  justify-content: center;
}

.canvas-container.mobile {
  margin-top: 20px;
}

.canvas-container {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  position: relative;
  transform-origin: center;
  transition: var(--transition-normal);
  border: 1px solid var(--border-color);
}

.canvas-container.show-grid {
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  width: 800px !important;
}

.canvas-container.drag-over {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2), var(--shadow-xl);
}

.rulers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
}

.ruler {
  position: absolute;
  background: rgba(0, 0, 0, 0.05);
}

.ruler-horizontal {
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
}

.ruler-vertical {
  top: 0;
  left: 0;
  bottom: 0;
  width: 20px;
}

.ruler-mark {
  position: absolute;
  font-size: 10px;
  color: var(--text-tertiary);
  font-weight: 500;
}

.ruler-horizontal .ruler-mark {
  top: 2px;
  transform: translateX(-50%);
}

.ruler-vertical .ruler-mark {
  left: 2px;
  writing-mode: vertical-rl;
  transform: translateY(-50%);
}

.canvas-content {
  position: relative;
  min-height: 100%;
  padding: 20px;
}

.components-container {
  position: relative;
  min-height: 100%;
  width: 100%;
}

.empty-canvas {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.empty-content {
  text-align: center;
  color: var(--text-tertiary);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.empty-content p {
  margin: 0;
  font-size: 14px;
}

.selection-box {
  position: absolute;
  border: 2px solid var(--primary-color);
  background: rgba(99, 102, 241, 0.1);
  pointer-events: none;
  z-index: 100;
}

.status-bar {
  height: 24px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 11px;
  color: var(--text-secondary);
}

.status-item {
  margin-right: 24px;
}

:deep(.el-button--small) {
  height: 28px !important;
  font-size: 12px !important;
}

:deep(.el-slider__runway) {
  background: var(--bg-tertiary) !important;
}

:deep(.el-slider__button) {
  border-color: var(--primary-color) !important;
}

:deep(.el-dropdown-menu__item) {
  font-size: 12px !important;
}
</style>