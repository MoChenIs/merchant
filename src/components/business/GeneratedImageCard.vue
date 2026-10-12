<template>
  <div class="gen-img">
    <img :src="src" alt="生成图" />
    <span class="gen-label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ src: string; label?: string }>(), {
  label: 'AI 视觉生成图 / 预览图',
})
</script>

<style scoped>
.gen-img {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 220px;
}
.gen-img img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: var(--shadow-card);
}
.gen-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}
</style>
