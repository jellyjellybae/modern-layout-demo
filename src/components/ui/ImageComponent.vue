<template>
  <img
    :src="src"
    :alt="alt"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
interface Props {
  src?: string
  alt?: string
}

withDefaults(defineProps<Props>(), {
  src: 'https://via.placeholder.com/200x150',
  alt: '图片'
})
</script>