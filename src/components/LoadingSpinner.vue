<template>
  <div class="loading-container" :class="{ 'loading-fullpage': fullPage }">
    <div class="spinner" :style="{ width: size + 'px', height: size + 'px' }"></div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
  fullPage?: boolean
  size?: number
}>()
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
}
.loading-fullpage {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,.8);
  z-index: 500;
}
.loading-message {
  color: var(--text-secondary);
  font-size: 14px;
}
</style>
