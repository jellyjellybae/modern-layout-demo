<template>
  <component
    :is="tag"
    v-bind="$attrs"
  >
    {{ content }}
  </component>
</template>

<script setup lang="ts">
interface Props {
  content?: string
  tag?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

withDefaults(defineProps<Props>(), {
  content: '文本内容',
  tag: 'span'
})
</script>