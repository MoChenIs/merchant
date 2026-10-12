<template>
  <div class="card table-wrap">
    <el-table
      :data="stores"
      v-loading="loading"
      style="width: 100%"
      @row-click="handleRowClick"
    >
      <el-table-column label="门店名称" min-width="220">
        <template #default="{ row }">
          <div class="store-cell">
            <div class="store-avatar">{{ row.name.slice(0, 1) }}</div>
            <div class="store-info">
              <div class="store-name">{{ row.name }}</div>
              <div class="store-addr">{{ row.city }} · {{ row.address }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="品类与客单价" width="160">
        <template #default="{ row }">
          <div class="cell-main">{{ row.category }}</div>
          <div class="cell-sub">{{ row.avgPrice }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="monthlyRevenue" label="月营业额评估" width="140" />
      <el-table-column label="诊断状态" width="130">
        <template #default="{ row }">
          <StatusTag :status="row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" width="160" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <div class="ops" @click.stop>
            <el-button size="small" type="primary" plain @click="emitDetail(row)">详情</el-button>
            <el-button size="small" type="info" plain @click="emitEdit(row)">编辑</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import StatusTag from '@/components/common/StatusTag.vue'
import type { Store } from '@/types/store'

defineProps<{ stores: Store[]; loading?: boolean }>()
const emit = defineEmits<{
  (e: 'detail', row: Store): void
  (e: 'edit', row: Store): void
}>()

function handleRowClick(row: Store) {
  emit('detail', row)
}

function emitDetail(row: unknown) {
  emit('detail', row as Store)
}

function emitEdit(row: unknown) {
  emit('edit', row as Store)
}
</script>

<style scoped>
.table-wrap {
  overflow: hidden;
}
.store-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
}
.store-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--brand-50);
  color: var(--brand-500);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.store-name {
  font-weight: 600;
  font-size: 14px;
}
.store-addr,
.cell-sub {
  font-size: 12px;
  color: var(--text-secondary);
}
.cell-main {
  font-size: 14px;
  font-weight: 500;
}
.ops {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
