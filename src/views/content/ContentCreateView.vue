<template>
  <div class="page content-create">
    <!-- 小红书图文设计：左右布局，左侧创作输入，右侧生成结果 -->
    <ContentXhsCreator v-if="type === 'xhs'" />

    <!-- 团购套餐图文设计 / 短视频脚本生成：提示词优先创作台 -->
    <ContentPromptCreator v-else :key="type" :type="promptType" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ContentXhsCreator from '@/components/business/ContentXhsCreator.vue'
import ContentPromptCreator from '@/components/business/ContentPromptCreator.vue'
import type { ContentType } from '@/types/content'

const route = useRoute()

function normalizeType(t: unknown): ContentType {
  return t === 'xhs' || t === 'video' || t === 'group-buy' ? t : 'group-buy'
}

const type = computed<ContentType>(() => normalizeType(route.params.type))
/** 非小红书类型时，传给 ContentPromptCreator 的创作类型 */
const promptType = computed<Extract<ContentType, 'group-buy' | 'video'>>(() =>
  type.value === 'video' ? 'video' : 'group-buy'
)
</script>

<style scoped>
.content-create {
  display: flex;
  flex-direction: column;
  /* 移除顶部标题栏后，加宽页面容器，为下方创作/展示区域腾出更多空间 */
  max-width: 1500px;
}
</style>
