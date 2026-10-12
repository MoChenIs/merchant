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
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <div class="loading-text">AI正在生成中</div>
      <div class="loading-sub">正在分析门店数据并生成诊断报告，请稍候...</div>
    </div>

    <div v-else-if="report" class="card report-card">
      <div class="report-head">
        <h3 class="report-title">诊断报告（结构化视图）</h3>
        <span class="muted">版本 v{{ report.version }} · {{ report.createdAt }}</span>
      </div>
      <DiagnosisReport :diagnosis="report" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DataAnalysis, Loading } from '@element-plus/icons-vue'
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
const currentStore = computed(() => storeStore.getById(appStore.currentStoreId))
const report = computed(() => diagnosisStore.cache[appStore.currentStoreId] ?? null)

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

async function startDiagnose() {
  const store = currentStore.value
  if (!store) {
    ElMessage.warning('请先选择门店')
    return
  }
  generating.value = true
  try {
    await Promise.all([diagnosisStore.load(store.id), sleep(3000)])
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
.loading-card :deep(.el-icon) {
  color: var(--brand-500);
}
.loading-text {
  font-size: 16px;
  font-weight: 700;
}
.loading-sub {
  font-size: 13px;
  color: var(--text-secondary);
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
</style>
