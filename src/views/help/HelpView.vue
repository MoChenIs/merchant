<template>
  <div class="page help">
    <PageHeader title="帮助中心" subtitle="常见问题解答与使用指引，帮助你更快上手食效云 AI 增长平台。" />

    <div class="layout">
      <div class="card faq">
        <h3 class="section-title">常见问题</h3>
        <el-collapse accordion>
          <el-collapse-item v-for="item in faqs" :key="item.q" :title="item.q" :name="item.q">
            <p class="faq-answer">{{ item.a }}</p>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div class="side">
        <div class="card contact">
          <h3 class="section-title">联系我们</h3>
          <div class="contact-row">
            <el-icon><Message /></el-icon>
            <div>
              <div class="contact-label">客服邮箱</div>
              <div class="contact-value">support@shixiaoyun.ai</div>
            </div>
          </div>
          <div class="contact-row">
            <el-icon><Phone /></el-icon>
            <div>
              <div class="contact-label">服务热线</div>
              <div class="contact-value">400-800-8888</div>
            </div>
          </div>
          <div class="contact-row">
            <el-icon><Document /></el-icon>
            <div>
              <div class="contact-label">产品文档</div>
              <div class="contact-value">docs.shixiaoyun.ai</div>
            </div>
          </div>
        </div>

        <div class="card shortcuts">
          <h3 class="section-title">快捷入口</h3>
          <el-button class="shortcut-btn" type="primary" plain @click="router.push('/diagnosis')">
            前往 AI 经营诊断
          </el-button>
          <el-button class="shortcut-btn" type="primary" plain @click="router.push('/plan')">
            前往 AI 营销方案
          </el-button>
          <el-button class="shortcut-btn" type="primary" plain @click="router.push('/content')">
            前往 AI 内容工作台
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Message, Phone, Document } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'

const router = useRouter()

const faqs = [
  {
    q: '如何新增一家门店档案？',
    a: '进入「门店管理系统」，点击右上角「新增门店档案」，填写门店基础资料、经营情况、线上平台信息等字段后保存即可。系统默认提供 14 个常用字段，也支持添加自定义扩展字段。',
  },
  {
    q: 'AI 经营诊断报告是如何生成的？',
    a: '在「AI 经营诊断」页面选择目标门店，点击「开始 AI 诊断」。系统基于门店档案数据模拟生成多维度的经营诊断报告，并以 SSE 流式逐字输出，帮助快速定位问题与改进方向。',
  },
  {
    q: '营销方案支持哪些经营目标？',
    a: '支持「新店开业」「老店提升客流」「新品推广」「节假日大促」四类经营目标。选择目标后，系统生成包含核心达成目标、多阶段行动时间线、执行关键动作与配合事项的完整方案。',
  },
  {
    q: 'AI 内容工作台支持哪些内容类型？',
    a: '支持三类：团购套餐图文设计（生成主图与卖点文案）、小红书图文推广设计（上传图片生成种草笔记）、短视频脚本生成（生成分镜表脚本，含画面、景别、字幕、旁白与音乐音效）。',
  },
  {
    q: '如何一键发布到抖音 / 小红书？',
    a: '在内容生成结果卡片点击「一键发布」，确认后会模拟同步发布到抖音与小红书平台。当前为前端演示环境，不进行真实的平台发布。',
  },
  {
    q: '我的数据会保存到服务器吗？',
    a: '当前项目为纯前端演示版本，所有数据仅保存在浏览器内存中，不涉及后端与数据库，刷新页面后会恢复为初始演示数据。',
  },
]
</script>

<style scoped>
.help {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.layout {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 24px;
  align-items: start;
}
.faq,
.contact,
.shortcuts {
  padding: 24px;
}
.section-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 16px;
}
.faq-answer {
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
}
.side {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.contact-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}
.contact-row:last-child {
  border-bottom: none;
}
.contact-row :deep(.el-icon) {
  color: var(--brand-500);
  margin-top: 2px;
}
.contact-label {
  font-size: 12px;
  color: var(--text-secondary);
}
.contact-value {
  font-size: 14px;
  font-weight: 600;
  margin-top: 2px;
}
.shortcuts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.shortcut-btn {
  width: 100%;
}
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
