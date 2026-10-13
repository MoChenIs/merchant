<template>
  <div class="prompt-creator">
    <!-- Toolbar: version tabs + AI helper actions -->
    <div class="creator-toolbar">
      <div class="version-tabs">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="tab-btn"
          :class="{ active: activeTab === t.key }"
          @click="switchTab(t.key)"
        >
          {{ t.label }}
          <span v-if="t.badge" class="tab-badge" :class="t.key">{{ t.badge }}</span>
        </button>
      </div>

      <div class="ai-actions">
        <button class="ai-btn" @click="triggerAi('帮写')">
          <el-icon class="amber"><MagicStick /></el-icon>
          AI帮写文案
        </button>
        <button class="ai-btn" @click="triggerAi('仿写')">
          <el-icon class="indigo"><CopyDocument /></el-icon>
          AI仿写文案
        </button>
        <button class="ai-btn" @click="triggerAi('复刻')">
          <el-icon class="rose"><Lightning /></el-icon>
          AI复刻同款
        </button>
      </div>
    </div>

    <!-- Main input card -->
    <div class="card creator-card">
      <!-- Notice -->
      <div class="notice">
        <span class="notice-icon">💡</span>
        <div class="notice-body">
          <span class="notice-title">创作小贴士：</span>写得越贴近真实情况，AI 生成的内容会越自然、越贴你的需要。
          <p v-if="showNotice" class="notice-sub">
            请勿引导 AI 编造未发生的事实或虚构他人体验；您是内容的最终发布者，真实性请自行核对并负责。
          </p>
        </div>
        <button class="notice-toggle" @click="showNotice = !showNotice">
          <el-icon><component :is="showNotice ? ArrowUp : ArrowDown" /></el-icon>
        </button>
      </div>

      <!-- Store selector -->
      <div class="store-row">
        <label class="store-label">关联门店</label>
        <el-select v-model="appStore.currentStoreId" style="width: 260px">
          <el-option v-for="s in storeStore.stores" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </div>

      <!-- Textarea -->
      <div class="textarea-wrap">
        <el-input
          v-model="prompt"
          type="textarea"
          :rows="8"
          :maxlength="2000"
          show-word-limit
          :placeholder="placeholder"
        />
        <div class="float-actions">
          <button class="float-btn" @click="handlePaste">粘贴</button>
          <button class="float-btn import" @click="handleImport">导入</button>
        </div>
      </div>

      <!-- Footer -->
      <div class="creator-footer">
        <div class="footer-opts">
          <el-checkbox v-model="assocInfo">关联创作信息 <span class="opt-hint">(建议填)</span></el-checkbox>
          <el-checkbox v-model="personaInfo">绑定人设信息 <span class="opt-hint">(建议填)</span></el-checkbox>
          <div class="tone">
            <el-icon><ChatDotRound /></el-icon>
            <span>常规语气</span>
            <el-icon :size="10"><ArrowDown /></el-icon>
          </div>
        </div>

        <button class="generate-btn" :disabled="contentStore.loading" @click="onGenerate">
          <el-icon><Lightning /></el-icon>
          一键生成
          <span class="cost-badge">(消耗1)</span>
        </button>
      </div>
    </div>

    <!-- 团购：左侧文案 / 右侧图片 -->
    <div v-if="!isVideo && contentStore.result" class="card gb-result">
      <div class="gb-head">
        <h3 class="gb-head-title">生成结果</h3>
        <div class="gb-actions">
          <el-button type="success" :icon="Promotion" @click="onPublish">一键发布</el-button>
          <el-button type="info" :icon="Download" @click="onExport">导出</el-button>
        </div>
      </div>
      <div class="gb-body">
        <div class="gb-copy">
          <div v-for="b in contentStore.result.blocks" :key="b.label" class="gb-block">
            <span class="gb-label">{{ b.label }}</span>
            <p class="gb-text">{{ b.text }}</p>
          </div>
        </div>
        <div class="gb-images">
          <div class="gb-img-grid">
            <div v-for="img in GROUP_BUY_IMAGES" :key="img" class="gb-img">
              <el-image :src="img" :preview-src-list="GROUP_BUY_IMAGES" fit="cover" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频：分镜表 -->
    <ContentResultPanel v-else :result="contentStore.result" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { MagicStick, CopyDocument, Lightning, ArrowUp, ArrowDown, ChatDotRound, Promotion, Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ContentResultPanel from '@/components/business/ContentResultPanel.vue'
import { useAppStore } from '@/stores/app'
import { useStoreStore } from '@/stores/store'
import { useContentStore } from '@/stores/content'
import type { ContentType } from '@/types/content'

const props = defineProps<{ type: Extract<ContentType, 'group-buy' | 'video'> }>()

const appStore = useAppStore()
const storeStore = useStoreStore()
const contentStore = useContentStore()

const prompt = ref(
  props.type === 'video'
    ? '春熙路老火锅：新店开业引流短视频，突出沸腾牛油锅底、空运鲜毛肚七上八下脆嫩化渣、门店排队人气爆棚，引导到店核销团购优惠。'
    : '蔬八戒手擀面：每日现擀手擀面筋道爽滑，招牌凉菜现拌现做爽口开胃，突出限时秒杀高性价比，画面诱人。'
)
const activeTab = ref('common')
const showNotice = ref(true)
const assocInfo = ref(true)
const personaInfo = ref(false)

const isVideo = computed(() => props.type === 'video')
const currentStore = computed(() => storeStore.getById(appStore.currentStoreId))

/** 团购套餐：默认素材图（仅第一张） */
const GROUP_BUY_IMAGES = ['/images/food-1.jpg']

const tabs = computed(() =>
  isVideo.value
    ? [
        { key: 'common', label: '普通版 (脚本)', badge: '' },
        { key: 'pro', label: '高级版 (单分镜)', badge: 'Pro' },
        { key: 'max', label: '高级版 (多分镜)', badge: 'Max' },
      ]
    : [
        { key: 'common', label: '普通版 (大字报)', badge: '' },
        { key: 'pro', label: '高级版 (单封面)', badge: 'Pro' },
        { key: 'max', label: '高级版 (多图集)', badge: 'Max' },
      ]
)

const placeholder = computed(() =>
  isVideo.value
    ? '输入主题即可生成完整短视频脚本（分镜表），适合探店、引流、上新、活动促销等场景。\n例：新店开业引流短视频，突出爆款菜品特写与团购优惠，引导到店核销。\n可写明：视频风格、目标受众、核心卖点、镜头节奏、配音语气等。'
    : '输入主题即可生成完整图文（标题·正文·配图），适合种草、攻略、日常分享等各种内容。\n例：为特色餐饮店生成团购套餐图文，突出招牌菜品与限时秒杀价，画面诱人。\n可写明：内容类型、目标受众、文案风格、配图氛围、要突出的卖点或故事场景。'
)

const AI_PRESETS: Record<string, string> = {
  帮写: '为特色餐饮店策划一篇爆款内容，突出招牌菜品色香味俱全、环境拍照打卡好看，吸引年轻人前来消费。',
  仿写: '参考近期热门餐饮爆款结构：惊艳开场 + 核心招牌推荐 + 真实口感评价 + 门店福利指引。',
  复刻: '一键复刻同款高赞餐饮内容模板，自动匹配美食滤镜、标题党痛点文案及精美封面。',
}

function switchTab(key: string) {
  activeTab.value = key
  const t = tabs.value.find((x) => x.key === key)
  ElMessage.success(`已切换至：${t?.label ?? ''}`)
}

function triggerAi(action: '帮写' | '仿写' | '复刻') {
  prompt.value = AI_PRESETS[action]
  ElMessage.success(`已触发：AI${action}文案助手`)
}

async function handlePaste() {
  try {
    const text = await navigator.clipboard.readText()
    if (text) {
      prompt.value += text
      ElMessage.success('已成功粘贴剪贴板内容')
    }
  } catch {
    ElMessage.warning('粘贴失败，请手动粘贴')
  }
}

function handleImport() {
  prompt.value = '【餐饮上新】主打手打柠檬茶与招牌暴打系列，适合夏日街头营销，吸睛文案与清新绿意配图。'
  ElMessage.success('打开创意素材库，导入成功！')
}

async function onGenerate() {
  if (!prompt.value.trim()) {
    ElMessage.warning('请先输入你的创意主题或提示词哦！')
    return
  }
  const store = currentStore.value
  if (!store) {
    ElMessage.warning('请先选择门店')
    return
  }
  ElMessage.info('正在为您调用 AI 引擎生成优质内容...')
  await contentStore.generate({
    storeId: store.id,
    type: props.type,
    prompt: prompt.value.trim(),
  })
  ElMessage.success('内容生成完成')
}

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
.prompt-creator {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.creator-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.version-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border-radius: 16px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
}
.tab-btn {
  position: relative;
  padding: 8px 16px;
  border-radius: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.tab-btn:hover {
  color: var(--text-color);
}
.tab-btn.active {
  background: #7c3aed;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(124, 58, 237, 0.3);
}
.tab-badge {
  position: absolute;
  top: -10px;
  right: -4px;
  padding: 1px 6px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
}
.tab-badge.pro {
  background: #f59e0b;
}
.tab-badge.max {
  background: #f43f5e;
}
.ai-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.ai-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.ai-btn:hover {
  border-color: var(--brand-500);
}
.ai-btn .amber {
  color: #f59e0b;
}
.ai-btn .indigo {
  color: #6366f1;
}
.ai-btn .rose {
  color: #f43f5e;
}
.creator-card {
  padding: 24px 28px;
  border: 2px solid var(--border-color);
}
.notice {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #b45309;
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 20px;
}
html.dark .notice {
  color: #fbbf24;
}
.notice-icon {
  font-size: 16px;
  flex-shrink: 0;
}
.notice-body {
  flex: 1;
}
.notice-title {
  font-weight: 700;
}
.notice-sub {
  margin: 6px 0 0;
  opacity: 0.75;
  font-size: 12px;
}
.notice-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  padding: 2px;
  flex-shrink: 0;
}
.notice-toggle:hover {
  opacity: 1;
}
.store-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.store-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
}
.textarea-wrap {
  position: relative;
  margin-bottom: 16px;
}
.textarea-wrap :deep(.el-textarea__inner) {
  padding-top: 20px;
}
.float-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 8px;
  z-index: 2;
}
.float-btn {
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-color);
  transition: all 0.2s;
}
.float-btn:hover {
  border-color: var(--brand-500);
}
.float-btn.import {
  background: #6366f1;
  color: #fff;
  border-color: #6366f1;
}
.float-btn.import:hover {
  background: #4f46e5;
}
.creator-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}
.footer-opts {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--text-secondary);
}
.opt-hint {
  color: #f43f5e;
  font-size: 11px;
  font-weight: 500;
}
.tone {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.tone:hover {
  color: var(--brand-500);
}
.generate-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
  box-shadow: 0 8px 18px -6px rgba(234, 88, 12, 0.4);
  transition: all 0.3s;
}
.generate-btn:hover {
  opacity: 0.95;
  box-shadow: 0 10px 20px -5px rgba(234, 88, 12, 0.5);
}
.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.cost-badge {
  font-size: 12px;
  background: rgba(0, 0, 0, 0.2);
  padding: 2px 8px;
  border-radius: 999px;
}
/* 团购结果：左文案 / 右图片 */
.gb-result {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.gb-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.gb-head-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}
.gb-actions {
  display: flex;
  gap: 12px;
}
.gb-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}
.gb-copy {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.gb-block {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 14px 16px;
}
.gb-label {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-500);
  margin-bottom: 6px;
}
.gb-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-color);
}
.gb-images {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.gb-img-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
.gb-img {
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
}
.gb-img :deep(.el-image) {
  width: 100%;
  height: 100%;
}
@media (max-width: 900px) {
  .gb-body {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 640px) {
  .generate-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
