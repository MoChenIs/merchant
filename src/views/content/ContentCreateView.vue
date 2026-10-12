<template>
  <div class="page content-create">
    <PageHeader :title="meta.title" :subtitle="meta.subtitle">
      <template #actions>
        <el-button :icon="ArrowLeft" @click="router.push('/content')">返回工作台</el-button>
      </template>
    </PageHeader>

    <!-- 小红书图文设计：左右布局，左侧创作输入，右侧生成结果 -->
    <ContentXhsCreator v-if="type === 'xhs'" />

    <!-- 团购套餐图文设计 / 短视频脚本生成：提示词优先创作台 -->
    <ContentPromptCreator v-else :key="type" :type="promptType" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ContentXhsCreator from '@/components/business/ContentXhsCreator.vue'
import ContentPromptCreator from '@/components/business/ContentPromptCreator.vue'
import type { ContentType } from '@/types/content'

const route = useRoute()
const router = useRouter()

const TYPE_META: Record<ContentType, { title: string; subtitle: string }> = {
  'group-buy': {
    title: '团购套餐图文设计',
    subtitle: '输入你的创意主题或提示词，AI 自动生成团购图文与卖点文案。',
  },
  xhs: {
    title: '小红书图文设计',
    subtitle: '上传商品图并填写卖点，AI 生成种草图文与高转化营销文案。',
  },
  video: {
    title: '短视频脚本生成',
    subtitle: '输入你的创意主题或提示词，AI 自动生成分镜表脚本。',
  },
}

function normalizeType(t: unknown): ContentType {
  return t === 'xhs' || t === 'video' || t === 'group-buy' ? t : 'group-buy'
}

const type = computed<ContentType>(() => normalizeType(route.params.type))
/** 非小红书类型时，传给 ContentPromptCreator 的创作类型 */
const promptType = computed<Extract<ContentType, 'group-buy' | 'video'>>(() =>
  type.value === 'video' ? 'video' : 'group-buy'
)
const meta = computed(() => TYPE_META[type.value])
</script>

<style scoped>
.content-create {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
