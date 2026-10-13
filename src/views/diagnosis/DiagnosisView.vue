<template>
  <div class="page diagnosis">
    <PageHeader title="AI 经营诊断" subtitle="基于门店档案数据，AI 生成多维度经营诊断报告。">
      <template #actions>
        <el-button
          type="primary"
          :icon="DataAnalysis"
          :loading="generating"
          :disabled="generating"
          @click="startDiagnose"
        >
          开始 AI 诊断
        </el-button>
      </template>
    </PageHeader>

    <div class="card control">
      <div class="control-row">
        <label class="control-label">目标门店</label>
        <el-select v-model="appStore.currentStoreId" style="width: 300px" placeholder="选择门店">
          <el-option v-for="s in storeStore.stores" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
        <span v-if="currentStore" class="muted">{{ currentStore.city }} · {{ currentStore.category }}</span>
      </div>
    </div>

    <div v-if="generating" class="card loading-card">
      <div class="spinner">
        <div class="spin-ring"></div>
        <div class="spin-core"><el-icon><MagicStick /></el-icon></div>
      </div>
      <div class="loading-text">AI 深度分析与诊断中...</div>
      <div class="loading-sub">正在分析门店经营数据并生成多维度诊断报告，请稍候...</div>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <div v-else-if="report" class="card report-card">
      <div class="report-head">
        <h3 class="report-title">诊断报告（结构化视图）</h3>
        <span class="muted">版本 v{{ report.version }} · {{ report.createdAt }}</span>
      </div>
      <DiagnosisReport :diagnosis="report" />
    </div>

    <div v-else class="card empty-card">
      <el-icon class="empty-icon" :size="36"><DataAnalysis /></el-icon>
      <div class="empty-title">请点击「开始 AI 诊断」</div>
      <div class="empty-sub">选择门店后，AI 将生成多维度经营诊断报告</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DataAnalysis, MagicStick } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import DiagnosisReport from '@/components/business/DiagnosisReport.vue'
import { useAppStore } from '@/stores/app'
import { useStoreStore } from '@/stores/store'
import { useDiagnosisStore } from '@/stores/diagnosis'

const appStore = useAppStore()
const storeStore = useStoreStore()
const diagnosisStore = useDiagnosisStore()

const generating = ref(false)
const progress = ref(0)
const currentStore = computed(() => storeStore.getById(appStore.currentStoreId))
const report = computed(() => diagnosisStore.cache[appStore.currentStoreId] ?? null)

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

async function startDiagnose() {
  const store = currentStore.value
  if (!store) {
    ElMessage.warning('请先选择门店')
    return
  }
  generating.value = true
  progress.value = 0
  try {
    await Promise.all([diagnosisStore.load(store.id), animateProgress()])
    ElMessage.success('诊断报告生成完成')
  } finally {
    generating.value = false
  }
}
</script>

<style scoped>
.diagnosis {
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
