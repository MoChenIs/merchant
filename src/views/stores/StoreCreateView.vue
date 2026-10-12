<template>
  <div class="page">
    <PageHeader title="新增门店档案" subtitle="填写门店基础资料与线上信息，系统将基于此生成 AI 诊断与营销方案。">
      <template #actions>
        <el-button :icon="ArrowLeft" @click="router.push('/stores')">返回列表</el-button>
      </template>
    </PageHeader>

    <StoreForm :initial="initialForm" submit-label="保存门店档案" @submit="onSubmit" @cancel="router.push('/stores')" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import StoreForm from '@/components/business/StoreForm.vue'
import { useStoreStore } from '@/stores/store'
import { emptyStoreForm } from '@/utils/storeForm'
import type { StoreFormData } from '@/types/store'

const router = useRouter()
const storeStore = useStoreStore()

const initialForm = emptyStoreForm()

async function onSubmit(form: StoreFormData) {
  if (!form.name.trim()) {
    ElMessage.warning('请填写门店名称')
    return
  }
  await storeStore.create(form)
  ElMessage.success('门店档案已成功创建！')
  router.push('/stores')
}
</script>
