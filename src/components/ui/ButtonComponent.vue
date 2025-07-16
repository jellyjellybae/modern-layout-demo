<template>
  <el-button
    :type="type"
    :size="size"
    v-bind="$attrs"
  >
    {{ text }}
  </el-button>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  size?: 'large' | 'default' | 'small'
}

withDefaults(defineProps<Props>(), {
  text: '按钮',
  type: 'primary',
  size: 'default'
})
</script>