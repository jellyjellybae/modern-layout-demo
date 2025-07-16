<template>
  <div class="ai-config-generator">
    <div class="generator-header">
      <h3>AI 配置生成器</h3>
    </div>
    
    <div class="generator-content">
      <el-form @submit.prevent="generateConfig">
        <el-form-item label="描述你想要的布局：">
          <el-input
            v-model="prompt"
            type="textarea"
            :rows="4"
            placeholder="例如：创建一个登录页面，包含用户名输入框、密码输入框和登录按钮，使用卡片布局..."
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="generateConfig"
            :loading="isGenerating"
            block
          >
            生成配置
          </el-button>
        </el-form-item>
      </el-form>
      
      <div v-if="generatedConfig" class="generated-config">
        <div class="config-header">
          <h4>生成的配置</h4>
          <div class="config-actions">
            <el-button @click="applyConfig" type="success" size="small">
              应用到画布
            </el-button>
            <el-button @click="copyConfig" size="small">
              复制配置
            </el-button>
          </div>
        </div>
        
        <el-input
          v-model="configText"
          type="textarea"
          :rows="12"
          readonly
          class="config-textarea"
        />
      </div>
      
      <div class="examples">
        <h4>示例提示词</h4>
        <div class="example-list">
          <div 
            v-for="example in examples"
            :key="example.title"
            class="example-item"
            @click="useExample(example.prompt)"
          >
            <h5>{{ example.title }}</h5>
            <p>{{ example.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useLayoutStore } from '@/stores/layout'
import type { LayoutConfig } from '@/types/layout'

const layoutStore = useLayoutStore()

const prompt = ref('')
const isGenerating = ref(false)
const generatedConfig = ref<LayoutConfig | null>(null)
const configText = ref('')

const examples = [
  {
    title: '登录页面',
    description: '创建一个登录表单',
    prompt: '创建一个登录页面，包含用户名输入框、密码输入框和登录按钮，使用卡片布局，居中显示'
  },
  {
    title: '产品展示',
    description: '展示产品信息的卡片',
    prompt: '创建一个产品展示页面，包含产品图片、标题、描述文本和购买按钮，使用卡片布局'
  },
  {
    title: '联系表单',
    description: '用户联系信息表单',
    prompt: '创建一个联系表单，包含姓名、邮箱、电话号码输入框和提交按钮，垂直排列'
  }
]

async function generateConfig() {
  if (!prompt.value.trim()) {
    ElMessage.warning('请输入布局描述')
    return
  }
  
  isGenerating.value = true
  
  try {
    // 模拟AI生成配置
    const mockConfig = await mockAIGeneration(prompt.value)
    generatedConfig.value = mockConfig
    configText.value = JSON.stringify(mockConfig, null, 2)
    ElMessage.success('配置生成成功')
  } catch (error) {
    ElMessage.error('生成配置失败，请重试')
  } finally {
    isGenerating.value = false
  }
}

async function mockAIGeneration(prompt: string): Promise<LayoutConfig> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // 根据提示词生成不同的配置
  if (prompt.includes('登录')) {
    return {
      version: '1.0.0',
      title: 'AI生成 - 登录页面',
      description: '基于AI生成的登录页面布局',
      components: [
        {
          id: 'card-' + Date.now(),
          type: 'card',
          props: { title: '用户登录' },
          style: { 
            width: '400px', 
            margin: '100px auto',
            padding: '20px'
          },
          children: [
            {
              id: 'username-' + Date.now(),
              type: 'input',
              props: { placeholder: '请输入用户名', type: 'text' },
              style: { width: '100%', marginBottom: '16px' }
            },
            {
              id: 'password-' + Date.now(),
              type: 'input',
              props: { placeholder: '请输入密码', type: 'password' },
              style: { width: '100%', marginBottom: '20px' }
            },
            {
              id: 'login-btn-' + Date.now(),
              type: 'button',
              props: { text: '登录', type: 'primary' },
              style: { width: '100%' }
            }
          ]
        }
      ]
    }
  }
  
  // 默认配置
  return {
    version: '1.0.0',
    title: 'AI生成布局',
    description: '基于AI生成的布局配置',
    components: [
      {
        id: 'container-' + Date.now(),
        type: 'container',
        props: { direction: 'column' },
        style: { padding: '20px' },
        children: [
          {
            id: 'title-' + Date.now(),
            type: 'text',
            props: { content: 'AI生成的标题', tag: 'h2' },
            style: { marginBottom: '16px' }
          },
          {
            id: 'button-' + Date.now(),
            type: 'button',
            props: { text: 'AI生成按钮', type: 'primary' },
            style: { width: '200px' }
          }
        ]
      }
    ]
  }
}

function applyConfig() {
  if (generatedConfig.value) {
    layoutStore.loadLayout(generatedConfig.value)
    ElMessage.success('配置已应用到画布')
  }
}

function copyConfig() {
  if (configText.value) {
    navigator.clipboard.writeText(configText.value)
    ElMessage.success('配置已复制到剪贴板')
  }
}

function useExample(examplePrompt: string) {
  prompt.value = examplePrompt
}
</script>

<style scoped>
.ai-config-generator {
  width: 380px;
  height: 100vh;
  border-left: 1px solid var(--border-color);
  background: var(--bg-primary);
  overflow-y: auto;
  backdrop-filter: blur(8px);
}

.generator-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-light);
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: var(--shadow-sm);
}

.generator-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 8px;
}

.generator-header h3::before {
  content: '🤖';
  font-size: 20px;
  animation: rotate 4s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.generator-content {
  padding: 20px;
}

.generated-config {
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-md);
  transition: var(--transition-normal);
}

.generated-config:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.config-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.config-header h4::before {
  content: '✨';
  font-size: 16px;
}

.config-actions {
  display: flex;
  gap: 8px;
}

.config-textarea {
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}

:deep(.config-textarea .el-textarea__inner) {
  background: var(--bg-dark) !important;
  color: #e2e8f0 !important;
  border: 1px solid var(--border-dark) !important;
  border-radius: var(--radius-md) !important;
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
  line-height: 1.6 !important;
}

.examples {
  margin-top: 32px;
}

.examples h4 {
  margin: 0 0 16px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.examples h4::before {
  content: '💡';
  font-size: 16px;
}

.example-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.example-item {
  padding: 16px;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.example-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  opacity: 0;
  transition: var(--transition-normal);
  z-index: 0;
}

.example-item:hover::before {
  opacity: 0.05;
}

.example-item:hover {
  border-color: var(--accent-color);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px) scale(1.02);
}

.example-item h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  z-index: 1;
  position: relative;
}

.example-item p {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  z-index: 1;
  position: relative;
}

/* AI按钮特殊样式 */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color)) !important;
  border: none !important;
  box-shadow: var(--shadow-md) !important;
  transition: var(--transition-normal) !important;
  position: relative !important;
  overflow: hidden !important;
}

:deep(.el-button--primary::before) {
  content: '' !important;
  position: absolute !important;
  top: -50% !important;
  left: -50% !important;
  width: 200% !important;
  height: 200% !important;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent) !important;
  transform: rotate(45deg) !important;
  transition: var(--transition-slow) !important;
  opacity: 0 !important;
}

:deep(.el-button--primary:hover::before) {
  opacity: 1 !important;
  animation: shimmer 1.5s ease-in-out infinite !important;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px) !important;
  box-shadow: var(--shadow-xl) !important;
}
</style>