<template>
  <div class="top-menu-bar">
    <!-- Logo和项目信息 -->
    <div class="menu-section logo-section">
      <div class="logo">
        <el-icon class="logo-icon"><Grid /></el-icon>
        <span class="logo-text">Builder</span>
      </div>
      <div class="project-info">
        <span class="project-name">{{ layoutStore.currentLayout.title }}</span>
        <el-icon class="project-status"><CircleCheck /></el-icon>
      </div>
    </div>

    <!-- 侧边栏切换按钮 -->
    <div class="menu-section sidebar-toggles">
      <el-button 
        :icon="ArrowLeft" 
        size="small" 
        circle 
        plain
        :class="{ 'active': !uiStore.leftSidebarCollapsed }"
        @click="uiStore.toggleLeftSidebar()"
        title="Toggle Left Sidebar"
      />
      <el-button 
        :icon="ArrowRight" 
        size="small" 
        circle 
        plain
        :class="{ 'active': !uiStore.rightSidebarCollapsed }"
        @click="uiStore.toggleRightSidebar()"
        title="Toggle Right Sidebar"
      />
    </div>

    <!-- 主要工具栏 -->
    <div class="menu-section tools-section" :class="{ 'mobile': uiStore.isMobile }">
      <el-button-group class="tool-group" v-if="!uiStore.isMobile">
        <el-button :icon="FolderOpened" size="small" plain>
          打开
        </el-button>
        <el-button :icon="DocumentAdd" size="small" plain>
          新建
        </el-button>
        <el-button :icon="Document" size="small" plain>
          保存
        </el-button>
      </el-button-group>

      <!-- 移动端简化工具栏 -->
      <el-button-group class="tool-group mobile-tools" v-else>
        <el-button :icon="FolderOpened" size="small" circle plain />
        <el-button :icon="DocumentAdd" size="small" circle plain />
        <el-button :icon="Document" size="small" circle plain />
      </el-button-group>

      <el-divider direction="vertical" />

      <template v-if="!uiStore.isMobile">
        <el-divider direction="vertical" />

        <el-button-group class="tool-group">
          <el-button :icon="RefreshLeft" size="small" plain>
            撤销
          </el-button>
          <el-button :icon="RefreshRight" size="small" plain>
            重做
          </el-button>
        </el-button-group>

        <el-divider direction="vertical" />

        <el-button-group class="tool-group">
          <el-button :icon="CopyDocument" size="small" plain>
            复制
          </el-button>
          <el-button :icon="DocumentCopy" size="small" plain>
            粘贴
          </el-button>
          <el-button :icon="Delete" size="small" plain>
            删除
          </el-button>
        </el-button-group>

        <el-divider direction="vertical" />
      </template>

      <el-button-group class="tool-group">
        <el-button :icon="View" size="small" type="primary">
          {{ uiStore.isMobile ? '' : '预览' }}
        </el-button>
        <el-button :icon="VideoPlay" size="small" plain v-if="!uiStore.isMobile">
          运行
        </el-button>
        <el-button :icon="Download" size="small" plain>
          {{ uiStore.isMobile ? '' : '导出' }}
        </el-button>
      </el-button-group>
    </div>

    <!-- 右侧功能区 -->
    <div class="menu-section actions-section">
      <el-button-group class="tool-group" v-if="!uiStore.isMobile">
        <el-button :icon="Search" size="small" circle plain />
        <el-button :icon="Setting" size="small" circle plain />
        <el-button :icon="QuestionFilled" size="small" circle plain />
      </el-button-group>
      
      <el-avatar class="user-avatar" :size="uiStore.isMobile ? 'small' : 'small'">
        <el-icon><User /></el-icon>
      </el-avatar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Grid, CircleCheck, FolderOpened, DocumentAdd, Document, 
  RefreshLeft, RefreshRight, CopyDocument, DocumentCopy, Delete,
  View, VideoPlay, Download, Search, Setting, QuestionFilled, User,
  ArrowLeft, ArrowRight
} from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/layout'
import { useUIStore } from '@/stores/ui'

const layoutStore = useLayoutStore()
const uiStore = useUIStore()
</script>

<style scoped>
.top-menu-bar {
  height: 48px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-shadow: var(--shadow-sm);
  position: relative;
  z-index: 100;
}

.menu-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-section {
  min-width: 200px;
}

.sidebar-toggles {
  min-width: 80px;
  gap: 8px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 16px;
}

.logo-icon {
  font-size: 20px;
  color: var(--primary-color);
}

.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.project-info {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
}

.project-name {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.project-status {
  font-size: 12px;
  color: var(--secondary-color);
}

.tools-section {
  flex: 1;
  justify-content: center;
}

.tools-section.mobile {
  justify-content: flex-start;
}

.mobile-tools {
  gap: 4px;
}

.tool-group {
  display: flex;
  gap: 4px;
}

.actions-section {
  min-width: 120px;
  justify-content: flex-end;
}

.user-avatar {
  margin-left: 8px;
  background: var(--primary-color);
}

.el-divider--vertical {
  height: 20px;
  margin: 0 12px;
  border-color: var(--border-light);
}

:deep(.el-button) {
  border-radius: var(--radius-sm) !important;
  font-size: 12px !important;
  height: 28px !important;
  padding: 0 8px !important;
}

:deep(.el-button.is-circle) {
  width: 28px !important;
  height: 28px !important;
  padding: 0 !important;
}

:deep(.el-button--plain) {
  background: transparent !important;
  border-color: transparent !important;
  color: var(--text-secondary) !important;
}

:deep(.el-button--plain:hover) {
  background: var(--bg-secondary) !important;
  border-color: var(--border-light) !important;
  color: var(--text-primary) !important;
}

:deep(.el-button--primary) {
  background: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

:deep(.sidebar-toggles .el-button.active) {
  background: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}
</style>