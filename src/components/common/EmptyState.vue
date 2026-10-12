<template>
  <div class="empty">
    <slot>
      <div class="empty-text">{{ message }}</div>
    </slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), { message: '暂无数据' })
</script>

<style scoped>
.empty {
  padding: 40px 16px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 13px;
}
</style>
