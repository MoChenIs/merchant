<template>
  <div class="upload">
    <input type="file" class="upload-input" accept="image/*" @change="onChange" />
    <div v-if="modelValue" class="upload-preview">
      <img :src="modelValue" alt="预览图" />
      <span class="upload-hint">点击更换图片</span>
    </div>
    <div v-else class="upload-empty">
      <el-icon :size="28"><Plus /></el-icon>
      <span>点击上传或拖拽图片到此处</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'

defineProps<{ modelValue: string | null }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string | null): void }>()

function onChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => emit('update:modelValue', reader.result as string)
  reader.readAsDataURL(file)
}
</script>

<style scoped>
.upload {
  position: relative;
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s;
  overflow: hidden;
}
.upload:hover {
  border-color: var(--brand-500);
}
.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}
.upload-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 16px;
  color: var(--text-secondary);
  font-size: 12px;
}
.upload-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
}
.upload-preview img {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: var(--shadow-card);
}
.upload-hint {
  font-size: 12px;
  color: var(--brand-500);
}
</style>
