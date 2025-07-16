<template>
  <el-input
    :placeholder="placeholder"
    :type="type"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
interface Props {
  placeholder?: string
  type?: 'text' | 'password' | 'number' | 'email'
}

withDefaults(defineProps<Props>(), {
  placeholder: '请输入内容',
  type: 'text'
})
</script>