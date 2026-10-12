<template>
  <div class="plan">
    <div class="objective">
      <span class="objective-label">🎯 核心达成目标</span>
      <p class="objective-text">{{ plan.objective }}</p>
    </div>

    <div class="section">
      <h4 class="section-title">多阶段行动时间线</h4>
      <div class="stages">
        <div v-for="(stage, i) in plan.stages" :key="i" class="stage">
          <div class="stage-head">
            <span class="stage-week">{{ stage.week }}</span>
            <div class="stage-main">
              <div class="stage-title">{{ stage.title }}</div>
              <div class="stage-desc">{{ stage.desc }}</div>
            </div>
          </div>
          <div class="stage-foot">
            <el-tag :type="stateType(stage.state)" size="small" effect="plain">{{ stateLabel(stage.state) }}</el-tag>
            <el-tag v-for="tag in stage.tags" :key="tag" size="small" effect="plain" type="info">
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="section">
        <h4 class="section-title">执行落地关键动作</h4>
        <ul class="list">
          <li v-for="(act, i) in plan.actions" :key="i"><span class="dot brand"></span>{{ act }}</li>
        </ul>
      </div>
      <div class="section">
        <h4 class="section-title amber">重要配合事项提醒</h4>
        <ul class="list">
          <li v-for="(col, i) in plan.collaborations" :key="i"><span class="dot amber"></span>{{ col }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Plan } from '@/types/plan'

defineProps<{ plan: Plan }>()

function stateType(state: 'done' | 'next' | 'todo'): 'success' | 'primary' | 'info' {
  if (state === 'done') return 'success'
  if (state === 'next') return 'primary'
  return 'info'
}

function stateLabel(state: 'done' | 'next' | 'todo'): string {
  if (state === 'done') return '已完成'
  if (state === 'next') return '进行中'
  return '待启动'
}
</script>

<style scoped>
.plan {
  display: flex;
  flex-direction: column;
  gap: 28px;
  font-size: 13px;
}
.objective {
  padding: 14px 16px;
  border-radius: 10px;
  background: var(--brand-50);
  border: 1px solid var(--brand-100);
}
.objective-label {
  display: block;
  font-weight: 700;
  margin-bottom: 6px;
}
.objective-text {
  margin: 0;
  color: var(--text-secondary);
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--brand-500);
  margin: 0 0 14px;
}
.section-title.amber {
  color: #f59e0b;
}
.stages {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.stage {
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
}
.stage-head {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}
.stage-week {
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-500);
  white-space: nowrap;
  width: 56px;
  padding-top: 2px;
}
.stage-title {
  font-weight: 600;
}
.stage-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}
.stage-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
  padding-left: 70px;
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--text-secondary);
}
.list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot.brand {
  background: var(--brand-500);
}
.dot.amber {
  background: #f59e0b;
}
@media (max-width: 900px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
