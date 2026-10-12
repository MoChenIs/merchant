<template>
  <div class="report">
    <div class="block">
      <h4 class="block-title">1. 经营现状概述</h4>
      <p class="block-text">{{ diagnosis.overview }}</p>
    </div>

    <div class="block">
      <h4 class="block-title">2. 主要发现的问题与风险</h4>
      <div v-for="(p, i) in diagnosis.problems" :key="i" class="problem">
        <el-tag :type="severityType(p.severity)" size="small">{{ p.severity }}级风险</el-tag>
        <div class="problem-body">
          <div class="problem-title">{{ p.title }}</div>
          <div class="problem-desc">{{ p.desc }}</div>
        </div>
      </div>
    </div>

    <div class="block">
      <h4 class="block-title">3. 核心根因分析</h4>
      <p class="block-text">{{ diagnosis.causes }}</p>
    </div>

    <div class="block">
      <h4 class="block-title">4. 优先改进建议</h4>
      <div v-for="(s, i) in diagnosis.suggestions" :key="i" class="suggestion">
        <el-icon><CircleCheck /></el-icon>
        <span>{{ s }}</span>
      </div>
    </div>

    <div class="block">
      <h4 class="block-title">5. 分析方向</h4>
      <div class="directions">
        <el-tag v-for="d in diagnosis.directions" :key="d" effect="plain" type="primary">{{ d }}</el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleCheck } from '@element-plus/icons-vue'
import type { Diagnosis } from '@/types/diagnosis'

defineProps<{ diagnosis: Diagnosis }>()

function severityType(s: '高' | '中' | '低'): 'danger' | 'warning' | 'info' {
  if (s === '高') return 'danger'
  if (s === '中') return 'warning'
  return 'info'
}
</script>

<style scoped>
.report {
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-size: 13px;
  line-height: 1.7;
}
.block-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--brand-500);
  margin: 0 0 12px;
}
.block-text {
  margin: 0;
  color: var(--text-secondary);
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  padding: 12px 16px;
  border-radius: 10px;
}
.problem {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  margin-bottom: 10px;
}
.problem-title {
  font-weight: 600;
}
.problem-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}
.suggestion {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(12, 163, 12, 0.08);
  color: var(--text-color);
  margin-bottom: 8px;
}
.suggestion :deep(.el-icon) {
  color: var(--success);
}
.directions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
