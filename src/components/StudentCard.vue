<template>
  <div class="student-card card">
    <div class="card-body student-inner">
      <div class="avatar" :class="avatarColor">{{ initial }}</div>
      <div class="student-info">
        <p class="student-name">{{ name }}</p>
        <p class="student-role">{{ role }}</p>
      </div>
      <div class="student-meta" v-if="matricula || turma">
        <div v-if="matricula">
          <span class="meta-label">Matrícula:</span>
          <span class="meta-value">{{ matricula }}</span>
        </div>
        <div v-if="turma">
          <span class="meta-label">Turma:</span>
          <span class="meta-value">{{ turma }}</span>
        </div>
      </div>
      <div class="student-actions"><slot /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  name: string;
  role?: string;
  matricula?: string;
  turma?: string;
}>();

const colors = [
  "avatar-blue",
  "avatar-green",
  "avatar-purple",
  "avatar-orange",
];
const initial = computed(() => props.name?.charAt(0).toUpperCase() ?? "");
const avatarColor = computed(
  () => colors[(props.name?.charCodeAt(0) ?? 0) % colors.length],
);
</script>

<style scoped>
.student-card {
  transition: var(--transition);
}
.student-card:hover {
  box-shadow: var(--shadow-md);
}
.student-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.student-info {
  min-width: 120px;
}
.student-name {
  font-weight: 600;
  font-size: 15px;
}
.student-role {
  font-size: 12px;
  color: var(--text-secondary);
}
.student-meta {
  display: flex;
  gap: 32px;
}
.meta-label {
  font-weight: 600;
  font-size: 12px;
  color: var(--text-primary);
  display: block;
}
.meta-value {
  font-size: 13px;
  color: var(--text-secondary);
}
.student-actions {
  margin-left: auto;
}

@media (max-width: 768px) {
  .student-inner {
    gap: 10px;
  }
  .student-meta {
    gap: 16px;
  }
  .student-actions {
    margin-left: 0;
    width: 100%;
  }
}
</style>
