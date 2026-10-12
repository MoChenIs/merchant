<template>
  <div class="cfe">
    <div v-for="(field, index) in fields" :key="field.id" class="cfe-row">
      <el-input v-model="field.name" placeholder="字段名 (如: 停车位)" style="width: 180px" />
      <el-input v-model="field.value" placeholder="字段内容 (如: 免费2小时)" class="cfe-value" />
      <el-button type="danger" :icon="Delete" circle plain @click="remove(index)" />
    </div>
    <el-button type="primary" plain :icon="Plus" size="small" @click="add">添加自定义字段</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import type { CustomField } from '@/types/common'
import { genId } from '@/utils/format'

const props = defineProps<{ modelValue: CustomField[] }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: CustomField[]): void }>()

const fields = ref<CustomField[]>(props.modelValue ?? [])

watch(
  () => props.modelValue,
  (val) => {
    fields.value = val ?? []
  }
)

function sync() {
  emit(
    'update:modelValue',
    fields.value.map((f) => ({ ...f }))
  )
}

function add() {
  fields.value.push({ id: genId('cf'), name: '', value: '' })
  sync()
}

function remove(index: number) {
  fields.value.splice(index, 1)
  sync()
}
</script>

<style scoped>
.cfe {
  width: 100%;
}
.cfe-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.cfe-value {
  flex: 1;
}
</style>
