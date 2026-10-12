<template>
  <div class="info-banner" :class="type">
    <el-icon :size="20"><Warning /></el-icon>
    <div class="info-banner-body"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'

withDefaults(defineProps<{ type?: 'warning' | 'info' }>(), { type: 'warning' })
</script>

<style scoped>
.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.6;
}
.info-banner.warning {
  background: rgba(250, 178, 25, 0.12);
  border: 1px solid rgba(250, 178, 25, 0.4);
  color: var(--text-color);
}
.info-banner.warning :deep(.el-icon) {
  color: #f59e0b;
}
.info-banner.info {
  background: var(--brand-50);
  border: 1px solid var(--brand-100);
  color: var(--text-color);
}
.info-banner.info :deep(.el-icon) {
  color: var(--brand-500);
}
</style>
