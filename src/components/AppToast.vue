<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
        @click="removeToast(toast.id)"
      >
        <span class="material-icons-outlined toast-icon">
          {{ iconMap[toast.type] }}
        </span>
        <span class="toast-message">{{ toast.message }}</span>
        <span class="material-icons-outlined toast-close">close</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/toast.store'

const { toasts } = storeToRefs(useToastStore())
const { removeToast } = useToastStore()

const iconMap: Record<string, string> = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info'
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 10px;
  color: #fff;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .15);
  backdrop-filter: blur(8px);
}

.toast-success { background: linear-gradient(135deg, #22C55E, #16A34A); }
.toast-error { background: linear-gradient(135deg, #EF4444, #DC2626); }
.toast-warning { background: linear-gradient(135deg, #F59E0B, #D97706); }
.toast-info { background: linear-gradient(135deg, #3B82F6, #2563EB); }

.toast-icon { font-size: 20px; }
.toast-message { flex: 1; }
.toast-close { font-size: 16px; opacity: .7; }
.toast-close:hover { opacity: 1; }

.toast-enter-active { transition: all .3s ease; }
.toast-leave-active { transition: all .2s ease; }
.toast-enter-from { transform: translateX(100%); opacity: 0; }
.toast-leave-to { transform: translateX(100%); opacity: 0; }
</style>
