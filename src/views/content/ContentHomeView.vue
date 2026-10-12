<template>
  <div class="page">
    <PageHeader title="AI 内容工作台" subtitle="三大内容创作能力，一键生成团购图文、小红书笔记与短视频脚本。" />

    <div class="cards">
      <ContentCard
        v-for="c in cards"
        :key="c.type"
        :title="c.title"
        :subtitle="c.subtitle"
        :description="c.description"
        :gradient="c.gradient"
        :badge="c.badge"
        :badge-bg="c.badgeBg"
        :tags="c.tags"
        @click="router.push(`/content/${c.type}`)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import ContentCard from '@/components/business/ContentCard.vue'

const router = useRouter()

const cards = [
  {
    type: 'group-buy',
    title: '团购套餐图文设计',
    subtitle: '团购图文',
    description: '输入门店与套餐信息，AI 自动生成团购套餐主图、价格标签与卖点文案，可直接用于团购详情页。',
    gradient: 'linear-gradient(135deg, #2a78d6 0%, #1e5cb0 100%)',
    badge: 'Group-buy',
    badgeBg: 'rgba(255,255,255,0.25)',
    tags: ['套餐主图', '价格标签', '卖点文案'],
  },
  {
    type: 'xhs',
    title: '小红书图文推广设计',
    subtitle: '小红书',
    description: '上传门店图片并输入要点，AI 生成种草笔记标题、正文与配图方向，助力小红书爆款种草。',
    gradient: 'linear-gradient(135deg, #eb6834 0%, #d95926 100%)',
    badge: 'Xiaohongshu',
    badgeBg: 'rgba(255,255,255,0.25)',
    tags: ['种草笔记', '话题建议', '配图方向'],
  },
  {
    type: 'video',
    title: '短视频脚本生成',
    subtitle: '短视频',
    description: '输入视频主题，AI 生成完整分镜表脚本：画面内容、景别、字幕、旁白与音乐音效，开拍即用。',
    gradient: 'linear-gradient(135deg, #7c5cff 0%, #5b3fd6 100%)',
    badge: 'Short-video',
    badgeBg: 'rgba(255,255,255,0.25)',
    tags: ['分镜表', '旁白解说', '音乐音效'],
  },
]
</script>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 1000px) {
  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
