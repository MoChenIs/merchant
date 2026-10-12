<template>
  <div class="page">
    <PageHeader title="内容交付中心" subtitle="统一查看各门店 AI 生成内容的交付与发布进度。" />

    <div class="stats">
      <StatCard label="本月交付内容" value="46" delta-text="+9% 较上月" delta-type="up" tone="blue">
        <template #icon><el-icon :size="24"><DocumentChecked /></el-icon></template>
      </StatCard>
      <StatCard label="待交付任务" value="8" delta-text="需尽快处理" delta-type="warn" tone="amber">
        <template #icon><el-icon :size="24"><Clock /></el-icon></template>
      </StatCard>
      <StatCard label="平均交付周期" value="2.4天" delta-text="较上月缩短 0.6 天" delta-type="up" tone="purple">
        <template #icon><el-icon :size="24"><Timer /></el-icon></template>
      </StatCard>
      <StatCard label="交付及时率" value="98.5%" delta-text="目标达成" delta-type="up" tone="green">
        <template #icon><el-icon :size="24"><CircleCheck /></el-icon></template>
      </StatCard>
    </div>

    <div class="card table-wrap">
      <el-table :data="records" style="width: 100%">
        <el-table-column label="交付项目" min-width="220">
          <template #default="{ row }">
            <div class="proj">{{ row.project }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="store" label="门店" min-width="180" />
        <el-table-column label="内容类型" width="130">
          <template #default="{ row }">
            <el-tag type="primary" effect="plain" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="目标平台" width="150">
          <template #default="{ row }">
            <span class="muted">{{ row.platform }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.statusType" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="交付时间" width="160" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DocumentChecked, Clock, Timer, CircleCheck } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'

interface DeliveryRecord {
  project: string
  store: string
  type: string
  platform: string
  status: string
  statusType: 'success' | 'warning' | 'info' | 'primary'
  time: string
}

const records: DeliveryRecord[] = [
  {
    project: '九宫格火锅双人套餐团购图文',
    store: '川渝火锅·春熙路店',
    type: '团购图文',
    platform: '美团 / 抖音',
    status: '已发布',
    statusType: 'success',
    time: '2026-10-11 16:20',
  },
  {
    project: '成都火锅探店小红书种草笔记',
    store: '川渝火锅·春熙路店',
    type: '小红书图文',
    platform: '小红书',
    status: '已发布',
    statusType: 'success',
    time: '2026-10-10 11:05',
  },
  {
    project: '新店开业引流短视频脚本',
    store: '老成都串串香·太古里店',
    type: '短视频脚本',
    platform: '抖音',
    status: '待审核',
    statusType: 'warning',
    time: '2026-10-10 09:40',
  },
  {
    project: '江南小馆招牌菜小红书笔记',
    store: '江南小馆·外滩源店',
    type: '小红书图文',
    platform: '小红书',
    status: '待交付',
    statusType: 'info',
    time: '2026-10-09 15:30',
  },
  {
    project: '节日大促海报与团购文案',
    store: '江南小馆·外滩源店',
    type: '团购图文',
    platform: '美团',
    status: '已交付',
    statusType: 'success',
    time: '2026-10-08 10:15',
  },
]
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}
.table-wrap {
  overflow: hidden;
}
.proj {
  font-weight: 600;
  font-size: 14px;
}
@media (max-width: 1100px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
