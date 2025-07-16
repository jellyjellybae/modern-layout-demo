<template>
  <div class="hierarchy-node">
    <div 
      :class="['node-item', { 
        'selected': isSelected, 
        'expanded': isExpanded 
      }]"
      :style="{ paddingLeft: level * 16 + 'px' }"
      @click="selectNode"
    >
      <el-icon 
        v-if="hasChildren" 
        :class="['expand-icon', { 'expanded': isExpanded }]"
        @click.stop="toggleExpand"
      >
        <ArrowRight />
      </el-icon>
      <div v-else class="expand-placeholder"></div>
      
      <el-icon class="node-icon" :size="14">
        <component :is="getNodeIcon(node.type)" />
      </el-icon>
      
      <span class="node-name">{{ getNodeName(node) }}</span>
      
      <div class="node-actions">
        <el-icon class="action-icon" @click.stop="deleteNode">
          <Delete />
        </el-icon>
      </div>
    </div>
    
    <template v-if="isExpanded && hasChildren">
      <HierarchyNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowRight, Delete, Grid, Pointer, EditPen, Document, Picture, Tickets } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/layout'
import type { ComponentConfig } from '@/types/layout'

interface Props {
  node: ComponentConfig
  level: number
}

const props = defineProps<Props>()

const layoutStore = useLayoutStore()
const isExpanded = ref(true)

const isSelected = computed(() => 
  layoutStore.selectedComponentId === props.node.id
)

const hasChildren = computed(() => 
  props.node.children && props.node.children.length > 0
)

function selectNode() {
  layoutStore.selectedComponentId = props.node.id
}

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

function deleteNode() {
  layoutStore.removeComponent(props.node.id)
}

function getNodeIcon(type: string) {
  const iconMap: Record<string, any> = {
    container: Grid,
    button: Pointer,
    input: EditPen,
    text: Document,
    image: Picture,
    card: Tickets
  }
  return iconMap[type] || Grid
}

function getNodeName(node: ComponentConfig): string {
  if (node.props?.text) return node.props.text
  if (node.props?.title) return node.props.title
  if (node.props?.content) return node.props.content
  return node.type.charAt(0).toUpperCase() + node.type.slice(1)
}
</script>

<style scoped>
.hierarchy-node {
  user-select: none;
}

.node-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-fast);
  font-size: 13px;
  min-height: 28px;
}

.node-item:hover {
  background: var(--bg-secondary);
}

.node-item.selected {
  background: var(--primary-color);
  color: white;
}

.expand-icon {
  font-size: 12px;
  color: var(--text-tertiary);
  transition: var(--transition-fast);
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
}

.expand-icon:hover {
  background: var(--bg-tertiary);
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.expand-placeholder {
  width: 16px;
  height: 16px;
}

.node-icon {
  color: var(--primary-color);
  flex-shrink: 0;
}

.node-item.selected .node-icon {
  color: white;
}

.node-name {
  flex: 1;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-actions {
  opacity: 0;
  display: flex;
  gap: 4px;
  transition: var(--transition-fast);
}

.node-item:hover .node-actions {
  opacity: 1;
}

.action-icon {
  font-size: 12px;
  padding: 2px;
  border-radius: 2px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: var(--transition-fast);
}

.action-icon:hover {
  background: var(--danger-color);
  color: white;
}

.node-item.selected .action-icon {
  color: rgba(255, 255, 255, 0.7);
}

.node-item.selected .action-icon:hover {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}
</style>