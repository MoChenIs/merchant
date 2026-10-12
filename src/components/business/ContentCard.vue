<template>
  <div class="content-card" :style="{ background: gradient }" @click="emit('click')">
    <div class="cc-top">
      <span class="cc-sub">{{ subtitle }}</span>
      <span class="cc-badge" :style="{ background: badgeBg }">{{ badge }}</span>
    </div>
    <div class="cc-body">
      <h3 class="cc-title">{{ title }}</h3>
      <p class="cc-desc">{{ description }}</p>
      <div class="cc-tags">
        <span v-for="t in tags" :key="t" class="cc-tag">{{ t }}</span>
      </div>
    </div>
    <div class="cc-footer">
      <span>立即开始创作</span>
      <el-icon><Right /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Right } from '@element-plus/icons-vue'

defineProps<{
  title: string
  subtitle: string
  description: string
  gradient: string
  badge: string
  badgeBg: string
  tags: string[]
}>()

const emit = defineEmits<{ (e: 'click'): void }>()
</script>

<style scoped>
.content-card {
  border-radius: 24px;
  padding: 32px;
  color: #fff;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 320px;
}
.content-card:hover {
  transform: translateY(-4px);
}
.cc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.cc-sub {
  background: rgba(255, 255, 255, 0.22);
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.cc-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  text-transform: uppercase;
}
.cc-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 8px;
}
.cc-desc {
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.7;
  margin: 0 0 16px;
}
.cc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.cc-tag {
  background: rgba(255, 255, 255, 0.22);
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 8px;
}
.cc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  font-weight: 700;
  font-size: 14px;
  margin-top: 24px;
}
</style>
