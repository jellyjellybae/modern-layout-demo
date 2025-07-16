<template>
  <div
    class="container-component"
    :class="[`direction-${direction}`]"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  direction?: 'row' | 'column'
}

withDefaults(defineProps<Props>(), {
  direction: 'column'
})
</script>

<style scoped>
.container-component {
  display: flex;
  gap: 12px;
  min-height: 80px;
  border-radius: 6px;
  transition: all 0.2s ease;
  width: auto;
  max-width: 100%;
}

.direction-row {
  flex-direction: row;
  align-items: flex-start;
}

.direction-column {
  flex-direction: column;
}
</style>