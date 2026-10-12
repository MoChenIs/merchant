<template>
  <div v-if="store" class="page detail">
    <div class="card detail-top">
      <div class="detail-top-left">
        <div class="detail-avatar">{{ store.name.slice(0, 1) }}</div>
        <div>
          <div class="detail-name-row">
            <h2 class="detail-name">{{ store.name }}</h2>
            <StatusTag :status="store.status" />
          </div>
          <p class="detail-sub">
            {{ store.city }} · {{ store.address }}｜品类 {{ store.category }}｜客单价
            {{ store.avgPrice }}｜营业 {{ store.businessHours }}
          </p>
        </div>
      </div>
      <div class="detail-actions">
        <el-button type="primary" :icon="Edit" @click="router.push(`/stores/${store.id}/edit`)">
          编辑门店信息
        </el-button>
        <el-button type="success" :icon="DataAnalysis" @click="goDiagnose">开始 AI 诊断</el-button>
      </div>
    </div>

    <div class="detail-grid">
      <div class="card detail-col">
        <h3 class="col-title"><el-icon><Shop /></el-icon> 经营状况</h3>
        <dl class="detail-dl">
          <dt>月营业额评估</dt>
          <dd>{{ store.monthlyRevenue }}</dd>
          <dt>日常客流</dt>
          <dd>{{ store.dailyTraffic }}</dd>
          <dt>主要客群</dt>
          <dd>{{ store.targetAudience }}</dd>
          <dt>当前主要问题</dt>
          <dd>{{ store.currentProblem }}</dd>
        </dl>
      </div>
      <div class="card detail-col">
        <h3 class="col-title"><el-icon><Share /></el-icon> 线上平台信息</h3>
        <dl class="detail-dl">
          <dt>抖音主页</dt>
          <dd>{{ store.douyin || '—' }}</dd>
          <dt>小红书账号</dt>
          <dd>{{ store.xiaohongshu || '—' }}</dd>
          <dt>大众点评商户</dt>
          <dd>{{ store.dianping || '—' }}</dd>
          <dt>团购套餐概要</dt>
          <dd>{{ store.groupBuy || '—' }}</dd>
        </dl>
      </div>
      <div class="card detail-col">
        <h3 class="col-title"><el-icon><List /></el-icon> 自定义扩展属性</h3>
        <dl v-if="store.customFields.length" class="detail-dl">
          <template v-for="f in store.customFields" :key="f.name">
            <dt>{{ f.name }}</dt>
            <dd>{{ f.value || '—' }}</dd>
          </template>
        </dl>
        <EmptyState v-else message="暂无自定义扩展属性" />
      </div>
    </div>

    <div class="card detail-tabs">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="历史经营诊断报告" name="diagnosis">
          <EmptyState message="暂无历史诊断报告，点击右上角「开始 AI 诊断」立即生成" />
        </el-tab-pane>
        <el-tab-pane label="历史营销方案" name="plan">
          <EmptyState message="暂无历史营销方案，前往 AI 营销方案模块生成" />
        </el-tab-pane>
        <el-tab-pane label="内容素材交付记录" name="content">
          <EmptyState message="暂无内容素材交付记录，前往 AI 内容工作台创作" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

  <div v-else class="page">
    <div class="card"><EmptyState message="未找到该门店" /></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Edit, DataAnalysis, Shop, Share, List } from '@element-plus/icons-vue'
import StatusTag from '@/components/common/StatusTag.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useStoreStore } from '@/stores/store'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const storeStore = useStoreStore()
const appStore = useAppStore()

const activeTab = ref('diagnosis')
const store = computed(() => storeStore.getById(route.params.id as string))

function goDiagnose() {
  if (store.value) appStore.setCurrentStore(store.value.id)
  router.push('/diagnosis')
}

onMounted(() => {
  if (!store.value) storeStore.fetchStores()
})
</script>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.detail-top {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.detail-top-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.detail-avatar {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--brand-50);
  color: var(--brand-500);
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.detail-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.detail-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}
.detail-sub {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 6px 0 0;
}
.detail-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.detail-col {
  padding: 24px;
}
.col-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 16px;
  color: var(--brand-500);
}
.detail-dl {
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  row-gap: 12px;
  column-gap: 12px;
}
.detail-dl dt {
  font-size: 12px;
  color: var(--text-secondary);
}
.detail-dl dd {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  word-break: break-all;
}
.detail-tabs {
  padding: 8px 24px 24px;
}
@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
