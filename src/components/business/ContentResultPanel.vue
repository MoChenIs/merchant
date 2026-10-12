<template>
  <div v-if="result" class="card result-card">
    <div class="result-head">
      <h3 class="card-title">生成结果</h3>
      <div class="result-actions">
        <el-button type="success" :icon="Promotion" @click="onPublish">一键发布</el-button>
        <el-button type="info" :icon="Download" @click="onExport">导出</el-button>
      </div>
    </div>

    <template v-if="result.type !== 'video'">
      <div v-if="result.uploadImage" class="img-row">
        <GeneratedImageCard :src="result.uploadImage" label="上传原图" />
        <GeneratedImageCard v-if="result.image" :src="result.image" label="AI 配图" />
      </div>
      <GeneratedImageCard v-else-if="result.image" :src="result.image" label="AI 视觉生成图" />

      <div class="blocks">
        <div v-for="b in result.blocks" :key="b.label" class="block">
          <span class="block-label">{{ b.label }}</span>
          <p class="block-text">{{ b.text }}</p>
        </div>
      </div>
    </template>

    <StoryboardTable v-else :rows="result.storyboard ?? []" />
  </div>
</template>

<script setup lang="ts">
import { Promotion, Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import GeneratedImageCard from '@/components/business/GeneratedImageCard.vue'
import StoryboardTable from '@/components/business/StoryboardTable.vue'
import type { ContentResult } from '@/types/content'

defineProps<{ result: ContentResult | null }>()

async function onPublish() {
  try {
    await ElMessageBox.confirm('是否同步发布到抖音 / 小红书？', '一键发布', {
      confirmButtonText: '确认发布',
      cancelButtonText: '取消',
      type: 'warning',
    })
    ElMessage.success('已提交发布（演示）')
  } catch {
    /* 用户取消发布 */
  }
}

function onExport() {
  ElMessage.success('已导出txt文件')
}
</script>

<style scoped>
.result-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.card-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}
.result-actions {
  display: flex;
  gap: 12px;
}
.img-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.blocks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.block {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 14px 16px;
}
.block-label {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-500);
  margin-bottom: 6px;
}
.block-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-color);
}
@media (max-width: 900px) {
  .img-row {
    grid-template-columns: 1fr;
  }
}
</style>
