<template>
  <div class="layout-builder">
    <!-- 顶部菜单栏 -->
    <TopMenuBar />
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧边栏 -->
      <LeftSidebar />
      
      <!-- 中央画布 -->
      <MainCanvas />
      
      <!-- 右侧边栏 -->
      <RightSidebar />
    </div>

    <!-- 调整大小时的遮罩和提示 -->
    <div v-if="isResizing" class="resize-overlay">
      <div class="resize-indicator">
        <el-icon class="resize-icon"><Expand /></el-icon>
        <span class="resize-text">调整侧边栏宽度</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopMenuBar from '@/components/TopMenuBar.vue'
import LeftSidebar from '@/components/LeftSidebar.vue'
import MainCanvas from '@/components/MainCanvas.vue'
import RightSidebar from '@/components/RightSidebar.vue'
import { useResize } from '@/composables/useResize'
import { Expand } from '@element-plus/icons-vue'

const { isResizing } = useResize()
</script>

<style scoped>
.layout-builder {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  height: calc(100vh - 48px);
  overflow: hidden;
}

.resize-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.02);
  cursor: col-resize;
  z-index: 9999;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resize-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
}

.resize-icon {
  font-size: 16px;
  color: var(--primary-color);
}
</style>