<template>
  <div class="page">
    <PageHeader :title="`编辑门店信息 · ${store?.name ?? ''}`" subtitle="修改门店档案资料，保存后立即生效。">
      <template #actions>
        <el-button :icon="ArrowLeft" @click="router.push(`/stores/${store?.id}`)">返回详情</el-button>
      </template>
    </PageHeader>

    <StoreForm
      v-if="store"
      :initial="storeToForm(store)"
      submit-label="保存修改"
      @submit="onSubmit"
      @cancel="router.push(`/stores/${store.id}`)"
    />
    <div v-else class="card"><EmptyState message="未找到该门店" /></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import StoreForm from '@/components/business/StoreForm.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useStoreStore } from '@/stores/store'
import { storeToForm } from '@/utils/storeForm'
import type { StoreFormData } from '@/types/store'

const route = useRoute()
const router = useRouter()
const storeStore = useStoreStore()

const id = route.params.id as string
const store = computed(() => storeStore.getById(id))

async function onSubmit(form: StoreFormData) {
  if (!form.name.trim()) {
    ElMessage.warning('请填写门店名称')
    return
  }
  await storeStore.update(id, form)
  ElMessage.success('门店信息已更新！')
  router.push(`/stores/${id}`)
}

onMounted(() => {
  if (!store.value) storeStore.fetchStores()
})
</script>
