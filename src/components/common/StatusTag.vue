<template>
  <el-tag :type="meta.type" size="small" :effect="effect">{{ meta.label }}</el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StoreStatus } from '@/types/common'

const props = withDefaults(defineProps<{ status: StoreStatus; effect?: 'dark' | 'light' | 'plain' }>(), {
  effect: 'dark',
})

const META: Record<StoreStatus, { type: 'success' | 'warning' | 'info'; label: string }> = {
  diagnosed: { type: 'success', label: '已诊断' },
  pending: { type: 'warning', label: '待诊断' },
  incomplete: { type: 'info', label: '资料待补充' },
}

const meta = computed(() => META[props.status])
</script>
