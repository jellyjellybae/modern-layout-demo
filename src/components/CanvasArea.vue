<template>
  <div class="canvas-area">
    <div class="canvas-toolbar">
      <el-button-group>
        <el-button @click="clearCanvas" :icon="Delete" size="small">
          清空画布
        </el-button>
        <el-button @click="previewLayout" :icon="View" size="small">
          预览
        </el-button>
        <el-button @click="exportConfig" :icon="Download" size="small">
          导出配置
        </el-button>
      </el-button-group>
    </div>
    
    <div
      class="canvas-container"
      :class="{ 'drag-over': isDragOver }"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <div v-if="layoutStore.currentLayout.components.length === 0" class="empty-canvas">
        <el-icon class="empty-icon"><Plus /></el-icon>
        <p>拖拽组件到此处开始设计</p>
      </div>
      
      <DynamicComponent
        v-for="component in layoutStore.currentLayout.components"
        :key="component.id"
        :config="component"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, View, Download, Plus } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/layout'
import { useDragDrop } from '@/composables/useDragDrop'
import DynamicComponent from './DynamicComponent.vue'

const layoutStore = useLayoutStore()
const { onDragOver, onDragLeave, onDrop } = useDragDrop()

const isDragOver = ref(false)

function clearCanvas() {
  ElMessageBox.confirm(
    '确定要清空画布吗？此操作不可撤销。',
    '确认清空',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    layoutStore.clearLayout()
    ElMessage.success('画布已清空')
  }).catch(() => {
    // 用户取消
  })
}

function previewLayout() {
  // TODO: 实现预览功能
  ElMessage.info('预览功能开发中...')
}

function exportConfig() {
  const config = JSON.stringify(layoutStore.currentLayout, null, 2)
  const blob = new Blob([config], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'layout-config.json'
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('配置文件已导出')
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
</script>

<style scoped>
.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-primary);
}

.canvas-toolbar {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: var(--shadow-sm);
}

.canvas-container {
  flex: 1;
  padding: 32px;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  overflow: auto;
  position: relative;
  min-height: 0;
  transition: var(--transition-normal);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.canvas-container.drag-over {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(129, 140, 248, 0.05) 100%);
  border: 3px dashed var(--primary-light);
  border-radius: var(--radius-xl);
  box-shadow: inset 0 0 0 1px var(--primary-color);
}

.empty-canvas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-tertiary);
  min-height: 400px;
  background: var(--bg-primary);
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-xl);
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.empty-canvas::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  opacity: 0.02;
  z-index: 0;
}

.empty-canvas:hover {
  border-color: var(--primary-light);
  color: var(--text-secondary);
  transform: scale(1.01);
  box-shadow: var(--shadow-lg);
}

.empty-icon {
  font-size: 72px;
  margin-bottom: 20px;
  color: var(--primary-color);
  opacity: 0.6;
  animation: float 3s ease-in-out infinite;
  z-index: 1;
  position: relative;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.empty-canvas p {
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  z-index: 1;
  position: relative;
}

/* 工具栏按钮组美化 */
:deep(.el-button-group) {
  box-shadow: var(--shadow-sm);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

:deep(.el-button-group .el-button) {
  border-radius: 0 !important;
  border-right: 1px solid var(--border-color) !important;
}

:deep(.el-button-group .el-button:first-child) {
  border-radius: var(--radius-lg) 0 0 var(--radius-lg) !important;
}

:deep(.el-button-group .el-button:last-child) {
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0 !important;
  border-right: none !important;
}
</style>