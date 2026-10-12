<template>
  <div class="card stat-card">
    <div>
      <div class="stat-label">{{ label }}</div>
      <div class="stat-value">{{ value }}</div>
      <div class="stat-delta" :class="deltaType">
        <el-icon :size="14"><component :is="deltaIcon" /></el-icon>
        <span>{{ deltaText }}</span>
      </div>
    </div>
    <div class="stat-icon" :class="tone">
      <slot name="icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Top, Warning } from '@element-plus/icons-vue'

const props = withDefaults(
  defineProps<{
    label: string
    value: string
    deltaText?: string
    deltaType?: 'up' | 'warn'
    tone?: 'blue' | 'purple' | 'amber' | 'green'
  }>(),
  { deltaType: 'up', tone: 'blue' }
)

const deltaIcon = computed(() => (props.deltaType === 'up' ? Top : Warning))
</script>

<style scoped>
.stat-card {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stat-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}
.stat-value {
  font-size: 30px;
  font-weight: 700;
  margin-top: 8px;
  letter-spacing: -0.02em;
}
.stat-delta {
  font-size: 12px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}
.stat-delta.up {
  color: #0ca30c;
}
.stat-delta.warn {
  color: #f59e0b;
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tone-blue {
  background: rgba(42, 120, 214, 0.12);
  color: var(--brand-500);
}
.tone-purple {
  background: rgba(139, 92, 246, 0.14);
  color: #8b5cf6;
}
.tone-amber {
  background: rgba(245, 158, 11, 0.14);
  color: #f59e0b;
}
.tone-green {
  background: rgba(16, 185, 129, 0.14);
  color: #10b981;
}
</style>
