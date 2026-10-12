<template>
  <div class="page">
    <PageHeader title="门店管理系统" subtitle="集中管理所有代运营餐饮门店档案、线上资料及增长状态。">
      <template #actions>
        <el-button type="primary" :icon="Plus" @click="router.push('/stores/new')">新增门店档案</el-button>
      </template>
    </PageHeader>

    <div class="card toolbar">
      <div class="filters">
        <el-input v-model="search" placeholder="搜索门店名称或地址..." clearable style="width: 260px">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-select v-model="filterCity" placeholder="全部城市" clearable style="width: 160px">
          <el-option v-for="c in cities" :key="c" :label="c" :value="c" />
        </el-select>
        <el-select v-model="filterCategory" placeholder="全品类" clearable style="width: 140px">
          <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="全部状态" clearable style="width: 140px">
          <el-option label="已诊断" value="diagnosed" />
          <el-option label="待诊断" value="pending" />
          <el-option label="资料待补充" value="incomplete" />
        </el-select>
      </div>
      <div class="count">共计 <b>{{ filtered.length }}</b> 家门店</div>
    </div>

    <StoreTable :stores="filtered" :loading="storeStore.loading" @detail="goDetail" @edit="goEdit" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StoreTable from '@/components/business/StoreTable.vue'
import { useStoreStore } from '@/stores/store'
import type { Store } from '@/types/store'
import type { StoreStatus } from '@/types/common'

const router = useRouter()
const storeStore = useStoreStore()

const search = ref('')
const filterCity = ref('')
const filterCategory = ref('')
const filterStatus = ref<StoreStatus | ''>('')

const cities = computed(() => [...new Set(storeStore.stores.map((s) => s.city))])
const categories = computed(() => [...new Set(storeStore.stores.map((s) => s.category))])

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return storeStore.stores.filter((s) => {
    if (q && !`${s.name}${s.address}${s.city}`.toLowerCase().includes(q)) return false
    if (filterCity.value && s.city !== filterCity.value) return false
    if (filterCategory.value && s.category !== filterCategory.value) return false
    if (filterStatus.value && s.status !== filterStatus.value) return false
    return true
  })
})

function goDetail(row: Store) {
  router.push(`/stores/${row.id}`)
}
function goEdit(row: Store) {
  router.push(`/stores/${row.id}/edit`)
}

onMounted(() => {
  if (!storeStore.stores.length) storeStore.fetchStores()
})
</script>

<style scoped>
.toolbar {
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.filters {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.count {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
}
.count b {
  color: var(--brand-500);
  font-weight: 700;
}
</style>
