<template>
  <div class="page plan-view">
    <PageHeader title="AI 营销方案" subtitle="按经营目标生成多阶段营销策划方案。">
      <template #actions>
        <el-button
          type="primary"
          :icon="TrendCharts"
          :loading="generating"
          :disabled="generating"
          @click="startPlan"
        >
          生成营销方案
        </el-button>
      </template>
    </PageHeader>

    <div class="card control">
      <div class="control-row">
        <label class="control-label">目标门店</label>
        <el-select v-model="appStore.currentStoreId" style="width: 300px" placeholder="选择门店">
          <el-option v-for="s in storeStore.stores" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </div>
      <div class="control-row">
        <label class="control-label">营销目标</label>
        <GoalChips v-model="planStore.goal" :goals="goals" />
      </div>
    </div>

    <div v-if="generating" class="card loading-card">
      <div class="spinner">
        <div class="spin-ring"></div>
        <div class="spin-core"><el-icon><MagicStick /></el-icon></div>
      </div>
      <div class="loading-text">AI 深度策划与方案生成中...</div>
      <div class="loading-sub">正在结合门店数据与营销目标生成多阶段方案，请稍候...</div>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <div v-else-if="plan" class="card report-card">
      <div class="report-head">
        <h3 class="report-title">营销策划方案（结构化视图）</h3>
        <span class="muted">{{ plan.period }} · 预算 {{ plan.budget }}</span>
      </div>
      <PlanTimeline :plan="plan" />
    </div>

    <div v-else class="card empty-card">
      <el-icon class="empty-icon" :size="36"><TrendCharts /></el-icon>
      <div class="empty-title">请点击「生成营销方案」</div>
      <div class="empty-sub">选择门店与营销目标后，AI 将生成多阶段策划方案</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { TrendCharts, MagicStick } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import GoalChips from '@/components/business/GoalChips.vue'
import PlanTimeline from '@/components/business/PlanTimeline.vue'
import { useAppStore } from '@/stores/app'
import { useStoreStore } from '@/stores/store'
import { usePlanStore } from '@/stores/plan'
import type { PlanGoal } from '@/types/plan'

const appStore = useAppStore()
const storeStore = useStoreStore()
const planStore = usePlanStore()

const goals: PlanGoal[] = ['新店开业', '老店提升客流', '新品推广', '节假日大促']

const generating = ref(false)
const progress = ref(0)
const currentStore = computed(() => storeStore.getById(appStore.currentStoreId))
const plan = computed(() => planStore.cache[`${appStore.currentStoreId}:${planStore.goal}`] ?? null)

/** 进度条动画（约 3 秒） */
function animateProgress(duration = 3000) {
  return new Promise<void>((resolve) => {
    const interval = 250
    const step = 100 / (duration / interval)
    const timer = setInterval(() => {
      progress.value = Math.min(100, progress.value + step)
      if (progress.value >= 100) {
        clearInterval(timer)
        resolve()
      }
    }, interval)
  })
}

async function startPlan() {
  const store = currentStore.value
  if (!store) {
    ElMessage.warning('请先选择门店')
    return
  }
  generating.value = true
  progress.value = 0
  try {
    await Promise.all([planStore.load(store.id, planStore.goal), animateProgress()])
    ElMessage.success('营销方案生成完成')
  } finally {
    generating.value = false
  }
}
</script>

<style scoped>
.plan-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.control {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.control-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.control-label {
  font-size: 14px;
  font-weight: 600;
}
.loading-card {
  padding: 60px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
}
.spinner {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
}
.spin-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 4px solid var(--brand-100);
  border-top-color: var(--brand-500);
  animation: spin 1s linear infinite;
}
.spin-core {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-500);
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.loading-text {
  font-size: 16px;
  font-weight: 700;
}
.loading-sub {
  font-size: 13px;
  color: var(--text-secondary);
  max-width: 360px;
  line-height: 1.6;
}
.progress {
  width: 260px;
  height: 6px;
  border-radius: 999px;
  background: var(--border-color);
  overflow: hidden;
  margin-top: 8px;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--brand-500), var(--brand-600));
  transition: width 0.25s;
}
.report-card {
  padding: 24px;
}
.report-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}
.report-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}
.empty-card {
  padding: 120px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
}
.empty-icon {
  color: var(--text-muted);
  margin-bottom: 8px;
}
.empty-title {
  font-size: 15px;
  font-weight: 600;
}
.empty-sub {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
