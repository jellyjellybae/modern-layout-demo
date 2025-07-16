<template>
  <el-card
    :header="title"
    v-bind="$attrs"
  >
    <template #header v-if="$slots.header">
      <slot name="header" />
    </template>
    
    <slot />
    
    <template #default v-if="$slots.default">
      <slot name="default" />
    </template>
    
    <template #footer v-if="$slots.footer">
      <slot name="footer" />
    </template>
  </el-card>
</template>

<script setup lang="ts">
interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: '卡片标题'
})
</script>