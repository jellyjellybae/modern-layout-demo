<template>
  <div 
    class="right-sidebar" 
    :class="{ 
      'collapsed': uiStore.rightSidebarCollapsed,
      'mobile': uiStore.isMobile,
      'tablet': uiStore.isTablet
    }"
    :style="{ 
      width: uiStore.rightSidebarCollapsed ? '48px' : uiStore.responsiveRightWidth + 'px' 
    }"
  >
    <!-- 顶部选项卡 -->
    <div class="sidebar-tabs">
      <el-tooltip 
        v-for="tab in tabs" 
        :key="tab.key"
        :content="tab.label"
        placement="left"
        :disabled="!uiStore.rightSidebarCollapsed"
      >
        <div 
          :class="['tab-item', { 'active': activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          <el-icon :size="16">
            <component :is="tab.icon" />
          </el-icon>
          <span v-show="!uiStore.rightSidebarCollapsed">{{ tab.label }}</span>
        </div>
      </el-tooltip>
    </div>

    <!-- 折叠时的属性悬浮面板 -->
    <div 
      v-if="uiStore.rightSidebarCollapsed && activeTab === 'properties'" 
      class="floating-panel"
      @mouseenter="showFloatingPanel = true"
      @mouseleave="showFloatingPanel = false"
    >
      <transition name="slide-left">
        <div v-show="showFloatingPanel" class="floating-content">
          <div v-if="!selectedComponent" class="no-selection">
            <el-icon class="no-selection-icon"><Select /></el-icon>
            <p>Select a widget to edit properties</p>
          </div>
          
          <div v-else class="properties-content">
            <div class="property-group">
              <div class="group-header">
                <el-icon><InfoFilled /></el-icon>
                <span>Object</span>
              </div>
              <div class="property-item">
                <label>Name</label>
                <el-input v-model="selectedComponent.id" size="small" disabled />
              </div>
              <div class="property-item">
                <label>Type</label>
                <el-input v-model="selectedComponent.type" size="small" disabled />
              </div>
            </div>

            <div class="property-group">
              <div class="group-header">
                <el-icon><Setting /></el-icon>
                <span>Properties</span>
              </div>
              <div 
                v-for="(value, key) in selectedComponent.props" 
                :key="key"
                class="property-item"
              >
                <label>{{ formatLabel(key) }}</label>
                <component
                  :is="getPropertyInput(key, value)"
                  v-model="selectedComponent.props[key]"
                  size="small"
                  @change="updateComponent"
                />
              </div>
            </div>

            <div class="property-group">
              <el-button type="danger" size="small" plain block @click="deleteComponent">
                <el-icon><Delete /></el-icon>
                Delete Widget
              </el-button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 属性面板 -->
    <div v-show="activeTab === 'properties' && !uiStore.rightSidebarCollapsed" class="tab-content">
      <div v-if="!selectedComponent" class="no-selection">
        <el-icon class="no-selection-icon"><Select /></el-icon>
        <p>Select a widget to edit properties</p>
      </div>
      
      <div v-else class="properties-content">
        <div class="property-group">
          <div class="group-header">
            <el-icon><InfoFilled /></el-icon>
            <span>Object</span>
          </div>
          <div class="property-item">
            <label>Name</label>
            <el-input v-model="selectedComponent.id" size="small" disabled />
          </div>
          <div class="property-item">
            <label>Type</label>
            <el-input v-model="selectedComponent.type" size="small" disabled />
          </div>
        </div>

        <div class="property-group">
          <div class="group-header">
            <el-icon><Setting /></el-icon>
            <span>Properties</span>
          </div>
          <div 
            v-for="(value, key) in selectedComponent.props" 
            :key="key"
            class="property-item"
          >
            <label>{{ formatLabel(key) }}</label>
            <component
              :is="getPropertyInput(key, value)"
              v-model="selectedComponent.props[key]"
              size="small"
              @change="updateComponent"
            />
          </div>
        </div>

        <div class="property-group">
          <div class="group-header">
            <el-icon><EditPen /></el-icon>
            <span>Style</span>
          </div>
          <div class="style-tabs">
            <div 
              v-for="styleTab in styleTabs"
              :key="styleTab.key"
              :class="['style-tab', { 'active': activeStyleTab === styleTab.key }]"
              @click="activeStyleTab = styleTab.key"
            >
              {{ styleTab.label }}
            </div>
          </div>
          
          <div class="style-properties">
            <template v-if="activeStyleTab === 'layout'">
              <div class="property-item">
                <label>Width</label>
                <el-input v-model="selectedComponent.style.width" size="small" @change="updateComponent" />
              </div>
              <div class="property-item">
                <label>Height</label>
                <el-input v-model="selectedComponent.style.height" size="small" @change="updateComponent" />
              </div>
              <div class="property-item">
                <label>Margin</label>
                <el-input v-model="selectedComponent.style.margin" size="small" @change="updateComponent" />
              </div>
              <div class="property-item">
                <label>Padding</label>
                <el-input v-model="selectedComponent.style.padding" size="small" @change="updateComponent" />
              </div>
            </template>
            
            <template v-if="activeStyleTab === 'appearance'">
              <div class="property-item">
                <label>Background</label>
                <el-input v-model="selectedComponent.style.background" size="small" @change="updateComponent" />
              </div>
              <div class="property-item">
                <label>Border</label>
                <el-input v-model="selectedComponent.style.border" size="small" @change="updateComponent" />
              </div>
              <div class="property-item">
                <label>Border Radius</label>
                <el-input v-model="selectedComponent.style.borderRadius" size="small" @change="updateComponent" />
              </div>
              <div class="property-item">
                <label>Box Shadow</label>
                <el-input v-model="selectedComponent.style.boxShadow" size="small" @change="updateComponent" />
              </div>
            </template>
          </div>
        </div>

        <div class="property-group">
          <el-button type="danger" size="small" plain block @click="deleteComponent">
            <el-icon><Delete /></el-icon>
            Delete Widget
          </el-button>
        </div>
      </div>
    </div>

    <!-- AI助手面板 -->
    <div v-show="activeTab === 'ai' && !uiStore.rightSidebarCollapsed" class="tab-content">
      <div class="ai-content">
        <div class="ai-header">
          <el-icon class="ai-icon"><Cpu /></el-icon>
          <h4>AI Assistant</h4>
        </div>
        
        <div class="chat-container">
          <div class="chat-messages">
            <div v-for="message in chatMessages" :key="message.id" :class="['message', message.type]">
              <div class="message-content">{{ message.content }}</div>
            </div>
          </div>
          
          <div class="chat-input">
            <el-input
              v-model="chatInput"
              type="textarea"
              :rows="3"
              placeholder="Describe the layout you want to create..."
              @keydown.ctrl.enter="sendMessage"
            />
            <el-button 
              type="primary" 
              size="small" 
              :loading="isGenerating"
              @click="sendMessage"
            >
              <el-icon><ChatLineRound /></el-icon>
              Generate
            </el-button>
          </div>
        </div>

        <div class="quick-actions">
          <h5>Quick Actions</h5>
          <div class="action-buttons">
            <el-button 
              v-for="action in quickActions"
              :key="action.text"
              size="small"
              plain
              @click="useQuickAction(action.prompt)"
            >
              {{ action.text }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 调整手柄 -->
    <div 
      v-if="!uiStore.rightSidebarCollapsed && !uiStore.isMobile"
      class="resize-handle resize-handle-left"
      @mousedown="startRightResize"
    >
      <div class="resize-handle-inner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Setting, Cpu, Select, InfoFilled, EditPen, Delete, 
  ChatLineRound
} from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/layout'
import { useUIStore } from '@/stores/ui'
import { useResize } from '@/composables/useResize'

const layoutStore = useLayoutStore()
const uiStore = useUIStore()
const { startResize } = useResize()

const activeTab = ref('properties')
const activeStyleTab = ref('layout')
const chatInput = ref('')
const isGenerating = ref(false)
const showFloatingPanel = ref(false)

const tabs = [
  { key: 'properties', label: 'Properties', icon: Setting },
  { key: 'ai', label: 'AI Assistant', icon: Cpu }
]

const styleTabs = [
  { key: 'layout', label: 'Layout' },
  { key: 'appearance', label: 'Style' }
]

const selectedComponent = computed(() => layoutStore.selectedComponent)

const chatMessages = ref([
  {
    id: 1,
    type: 'assistant',
    content: 'Hello! I can help you create layouts. Just describe what you want to build.'
  }
])

const quickActions = [
  { text: 'Login Form', prompt: 'Create a login form with username, password and login button' },
  { text: 'Product Card', prompt: 'Create a product card with image, title, price and buy button' },
  { text: 'Contact Form', prompt: 'Create a contact form with name, email, message fields' },
  { text: 'Hero Section', prompt: 'Create a hero section with title, subtitle and call-to-action button' }
]

function formatLabel(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
}

function getPropertyInput(key: string, value: any) {
  if (typeof value === 'boolean') return 'el-switch'
  if (typeof value === 'number') return 'el-input-number'
  return 'el-input'
}

function updateComponent() {
  if (selectedComponent.value) {
    layoutStore.updateComponent(selectedComponent.value.id, selectedComponent.value)
  }
}

function deleteComponent() {
  if (!selectedComponent.value) return
  
  ElMessageBox.confirm(
    'Are you sure you want to delete this widget?',
    'Delete Widget',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(() => {
    if (selectedComponent.value) {
      layoutStore.removeComponent(selectedComponent.value.id)
      ElMessage.success('Widget deleted')
    }
  }).catch(() => {})
}

function sendMessage() {
  if (!chatInput.value.trim() || isGenerating.value) return
  
  // 添加用户消息
  chatMessages.value.push({
    id: Date.now(),
    type: 'user',
    content: chatInput.value
  })
  
  const userMessage = chatInput.value
  chatInput.value = ''
  isGenerating.value = true
  
  // 模拟AI响应
  setTimeout(() => {
    chatMessages.value.push({
      id: Date.now() + 1,
      type: 'assistant', 
      content: `I'll create that layout for you. Check the canvas to see the generated components based on: "${userMessage}"`
    })
    isGenerating.value = false
  }, 2000)
}

function useQuickAction(prompt: string) {
  chatInput.value = prompt
  sendMessage()
}

function startRightResize(event: MouseEvent) {
  startResize(
    event,
    'right',
    uiStore.rightSidebarWidth,
    (width: number) => {
      uiStore.setRightSidebarWidth(width)
    }
  )
}
</script>

<style scoped>
.right-sidebar {
  height: calc(100vh - 48px);
  background: var(--bg-primary);
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-normal);
  overflow: hidden;
  position: relative;
}

.right-sidebar.collapsed {
  overflow: visible;
}

.right-sidebar.collapsed .sidebar-tabs {
  flex-direction: column;
}

.right-sidebar.collapsed .tab-item {
  justify-content: center;
  padding: 12px 4px;
}

/* 悬浮面板样式 */
.floating-panel {
  position: absolute;
  top: 0;
  right: 100%;
  height: 100%;
  z-index: 1000;
  pointer-events: none;
}

.floating-content {
  width: var(--floating-width, 320px);
  height: 100%;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-right: none;
  box-shadow: var(--shadow-lg);
  overflow-y: auto;
  pointer-events: auto;
}

/* 移动端优化 */
.right-sidebar.mobile .floating-content {
  --floating-width: 280px;
  position: fixed;
  right: 48px;
  top: 48px;
  height: calc(100vh - 48px);
  z-index: 2000;
}

.right-sidebar.tablet .floating-content {
  --floating-width: 300px;
}

/* 移动端表单优化 */
.right-sidebar.mobile .property-group {
  margin-bottom: 16px;
  padding: 12px;
}

.right-sidebar.mobile .property-item {
  padding: 8px 12px;
}

.right-sidebar.mobile .group-header {
  padding: 8px 12px;
  font-size: 12px;
}

.right-sidebar.mobile .chat-messages {
  max-height: 200px;
}

.right-sidebar.mobile .chat-input textarea {
  font-size: 14px;
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

.resize-handle-left {
  left: -4px;
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

/* 滑动动画 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform var(--transition-normal), opacity var(--transition-normal);
}

.slide-left-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(20px);
  opacity: 0;
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
  overflow-y: auto;
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-tertiary);
  padding: 20px;
  text-align: center;
}

.no-selection-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.6;
}

.properties-content {
  padding: 16px;
}

.property-group {
  margin-bottom: 24px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-light);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.property-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light);
}

.property-item:last-child {
  border-bottom: none;
}

.property-item label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.style-tabs {
  display: flex;
  background: var(--bg-tertiary);
}

.style-tab {
  flex: 1;
  padding: 8px 12px;
  text-align: center;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-fast);
}

.style-tab:hover {
  background: var(--bg-secondary);
}

.style-tab.active {
  background: var(--bg-primary);
  color: var(--primary-color);
}

.style-properties {
  max-height: 300px;
  overflow-y: auto;
}

.ai-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-secondary);
}

.ai-icon {
  font-size: 18px;
  color: var(--accent-color);
}

.ai-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.chat-messages {
  flex: 1;
  min-height: 200px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.message {
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  font-size: 13px;
  line-height: 1.4;
}

.message.user {
  background: var(--primary-color);
  color: white;
  margin-left: 20px;
}

.message.assistant {
  background: var(--bg-secondary);
  color: var(--text-primary);
  margin-right: 20px;
}

.chat-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-actions {
  padding: 16px;
  border-top: 1px solid var(--border-light);
}

.quick-actions h5 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

:deep(.el-input__wrapper) {
  font-size: 12px !important;
}

:deep(.el-button--small) {
  font-size: 12px !important;
  height: 28px !important;
}
</style>