<template>
  <div class="stats-card card">
    <div class="card-body">
      <p class="stats-label">{{ label }}</p>
      <p class="stats-value" :style="{ color: color ?? 'var(--primary)' }">{{ value }}</p>
      <p class="stats-sub" v-if="sub">{{ sub }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  sub?: string
  color?: string
}>()
</script>

<style scoped>
.stats-card {
  flex: 1;
  min-width: 160px;
}
.stats-label {
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .4px;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.stats-value {
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 4px;
}
.stats-sub {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
