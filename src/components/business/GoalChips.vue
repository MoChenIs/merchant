<template>
  <div class="goals">
    <el-button
      v-for="g in goals"
      :key="g"
      :type="g === modelValue ? 'primary' : 'info'"
      :plain="g !== modelValue"
      @click="emit('update:modelValue', g)"
    >
      {{ g }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import type { PlanGoal } from '@/types/plan'

defineProps<{ modelValue: PlanGoal; goals: PlanGoal[] }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: PlanGoal): void }>()
</script>

<style scoped>
.goals {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
