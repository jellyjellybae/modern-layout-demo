<template>
  <div class="property-panel">
    <div class="panel-header">
      <h3>属性面板</h3>
    </div>
    
    <div v-if="!selectedComponent" class="no-selection">
      <el-icon class="no-selection-icon"><Select /></el-icon>
      <p>请选择一个组件</p>
    </div>
    
    <div v-else class="property-content">
      <el-form label-position="top" size="small">
        <div class="property-section">
          <h4>基本信息</h4>
          <el-form-item label="组件ID">
            <el-input v-model="selectedComponent.id" disabled />
          </el-form-item>
          <el-form-item label="组件类型">
            <el-input v-model="selectedComponent.type" disabled />
          </el-form-item>
        </div>
        
        <div class="property-section">
          <h4>属性配置</h4>
          <el-form-item
            v-for="(value, key) in selectedComponent.props"
            :key="key"
            :label="key"
          >
            <component
              :is="getInputComponent(key, value)"
              v-model="selectedComponent.props[key]"
              @change="updateComponent"
            />
          </el-form-item>
        </div>
        
        <div class="property-section">
          <h4>样式配置</h4>
          <el-form-item
            v-for="(value, key) in selectedComponent.style"
            :key="key"
            :label="key"
          >
            <el-input
              v-model="selectedComponent.style[key]"
              @change="updateComponent"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button @click="addStyleProperty" size="small" type="primary" plain>
              添加样式属性
            </el-button>
          </el-form-item>
        </div>
        
        <div class="property-section">
          <el-button @click="deleteComponent" type="danger" plain block>
            删除组件
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Select } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/layout'
import { componentDefinitions } from '@/config/components'

const layoutStore = useLayoutStore()

const selectedComponent = computed(() => layoutStore.selectedComponent)

function getInputComponent(key: string, value: any) {
  if (typeof value === 'boolean') {
    return 'el-switch'
  }
  if (typeof value === 'number') {
    return 'el-input-number'
  }
  
  const definition = componentDefinitions.find(def => def.type === selectedComponent.value?.type)
  const propSchema = definition?.propsSchema?.[key]
  
  if (propSchema?.type === 'select') {
    return 'el-select'
  }
  
  return 'el-input'
}

function updateComponent() {
  if (selectedComponent.value) {
    layoutStore.updateComponent(selectedComponent.value.id, selectedComponent.value)
  }
}

function addStyleProperty() {
  ElMessageBox.prompt('请输入样式属性名', '添加样式属性', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^[a-zA-Z][a-zA-Z0-9-]*$/,
    inputErrorMessage: '属性名格式不正确'
  }).then(({ value }) => {
    if (selectedComponent.value && !selectedComponent.value.style[value]) {
      selectedComponent.value.style[value] = ''
      updateComponent()
    }
  }).catch(() => {
    // 用户取消
  })
}

function deleteComponent() {
  if (!selectedComponent.value) return
  
  ElMessageBox.confirm(
    '确定要删除此组件吗？',
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    if (selectedComponent.value) {
      layoutStore.removeComponent(selectedComponent.value.id)
      ElMessage.success('组件已删除')
    }
  }).catch(() => {
    // 用户取消
  })
}
</script>

<style scoped>
.property-panel {
  width: 320px;
  height: 100vh;
  border-left: 1px solid var(--border-color);
  background: var(--bg-primary);
  overflow-y: auto;
  backdrop-filter: blur(8px);
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-light);
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: var(--shadow-sm);
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--text-tertiary);
  padding: 40px 20px;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  margin: 20px;
  border-radius: var(--radius-xl);
  border: 2px dashed var(--border-color);
  transition: var(--transition-normal);
}

.no-selection:hover {
  border-color: var(--primary-light);
  color: var(--text-secondary);
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}

.no-selection-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: var(--primary-color);
  opacity: 0.6;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.no-selection p {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  text-align: center;
}

.property-content {
  padding: 20px;
}

.property-section {
  margin-bottom: 32px;
  padding: 20px;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

.property-section:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.property-section:last-child {
  border-bottom: 1px solid var(--border-light);
}

.property-section h4 {
  margin: 0 0 16px 0;
  font-size: 15px;
  color: var(--text-primary);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.property-section h4::before {
  content: '';
  width: 3px;
  height: 16px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  border-radius: var(--radius-sm);
}

/* 表单项美化 */
:deep(.el-form-item) {
  margin-bottom: 20px !important;
}

:deep(.el-form-item__label) {
  font-weight: 600 !important;
  color: var(--text-secondary) !important;
  font-size: 13px !important;
}

:deep(.el-input__wrapper) {
  background: var(--bg-primary) !important;
  border: 1px solid var(--border-color) !important;
  transition: var(--transition-fast) !important;
}

:deep(.el-input__wrapper:hover) {
  border-color: var(--primary-light) !important;
  box-shadow: var(--shadow-md) !important;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1) !important;
}

:deep(.el-button--danger) {
  background: linear-gradient(135deg, var(--danger-color), #f87171) !important;
  border: none !important;
  box-shadow: var(--shadow-sm) !important;
  transition: var(--transition-normal) !important;
}

:deep(.el-button--danger:hover) {
  transform: translateY(-1px) !important;
  box-shadow: var(--shadow-md) !important;
}
</style>