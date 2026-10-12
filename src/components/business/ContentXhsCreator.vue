<template>
  <div class="xhs-creator">
    <div class="split">
      <!-- ============ LEFT: 创作输入 ============ -->
      <section class="left">
        <div class="card left-card">
          <!-- 上传商品图 -->
          <div class="block">
            <div class="block-head">
              <label class="block-label">
                <span class="req">*</span> 上传商品图
                <span class="hint-icon" title="上传高清商品多视角图片">?</span>
              </label>
              <span class="block-tip">支持多图（最多 10 张）</span>
            </div>

            <!-- 上传框 -->
            <div class="upload-zone" :class="{ 'has-img': uploadImages.length }">
              <input
                ref="fileInput"
                type="file"
                class="file-input"
                multiple
                accept="image/*"
                @change="onFileChange"
              />
              <template v-if="!uploadImages.length">
                <div class="upload-empty" @click="fileInput?.click()">
                  <div class="upload-cloud">
                    <el-icon :size="20"><UploadFilled /></el-icon>
                  </div>
                  <div class="upload-btns">
                    <span class="up-btn" @click.stop="fileInput?.click()">+ 本地上传</span>
                    <span class="up-btn" @click.stop="loadMaterialLibrary">从素材库导入</span>
                  </div>
                  <p class="upload-tip">支持 JPG、PNG、WEBP 格式，点击上传商品原图</p>
                </div>
              </template>
              <template v-else>
                <div class="upload-grid">
                  <div v-for="(img, i) in uploadImages" :key="i" class="up-cell">
                    <img :src="img" alt="上传预览" />
                    <button class="up-remove" @click="removeImage(i)">
                      <el-icon :size="10"><Delete /></el-icon>
                    </button>
                  </div>
                  <div class="up-add" @click="fileInput?.click()">
                    <el-icon :size="20"><UploadFilled /></el-icon>
                  </div>
                </div>
              </template>
            </div>

            <!-- 推荐示例 -->
            <div class="sample-row">
              <span class="sample-label">推荐示例：</span>
              <button
                v-for="s in SAMPLES"
                :key="s.key"
                class="sample-btn"
                :class="{ active: selectedSample === s.key }"
                @click="selectSample(s.key)"
              >
                <img :src="s.img" :alt="s.label" />
                <span class="sample-name">{{ s.label }}</span>
              </button>
            </div>

            <div class="tips">
              <span>💡 Tips：请上传清晰且能展示商品全貌的照片</span>
            </div>
          </div>

          <!-- 商品卖点 & 要求 -->
          <div class="block">
            <div class="block-head">
              <label class="block-label">商品卖点 & 要求 <span class="req">(*必填)</span></label>
              <button class="ai-help" @click="aiHelpFill">
                <el-icon><MagicStick /></el-icon>
                <span>AI 帮写</span>
              </button>
            </div>

            <div class="textarea-wrap">
              <el-input
                v-model="sellingPoints"
                type="textarea"
                :rows="6"
                :maxlength="2000"
                show-word-limit
                :placeholder="textareaPlaceholder"
              />
              <button class="clear-btn" @click="clearTextarea">
                <el-icon><Delete /></el-icon>
              </button>
            </div>

            <div class="extra-row">
              <span class="extra-label">上传其他图 <span class="muted">(非必填)</span></span>
              <span class="extra-tip">支持多图（最多 4 张）</span>
            </div>
          </div>

          <!-- 生成按钮 -->
          <button class="generate-btn" :disabled="generating" @click="onGenerate">
            <el-icon><MagicStick /></el-icon>
            <span>开始生成 3 张</span>
            <span class="cost-badge">12 点数</span>
          </button>
        </div>
      </section>

      <!-- ============ RIGHT: 生成结果 ============ -->
      <section class="right card">
        <div class="right-head">
          <div class="right-tabs">
            <span class="tab active">
              <el-icon><MagicStick /></el-icon> AI创作结果
            </span>
            <span class="tab"><el-icon><Picture /></el-icon> 创作案例</span>
          </div>
          <div class="right-help">对结果不满意？可尝试调整卖点描述后重新生成</div>
        </div>

        <div class="right-body">
          <!-- 空状态 -->
          <div v-if="!generating && !generated" class="empty-state">
            <div class="empty-icon">
              <el-icon :size="34"><Picture /></el-icon>
              <span class="ping"></span>
            </div>
            <h3 class="empty-title">小红书图文设计</h3>
            <p class="empty-desc">
              暂无生成结果。请在左侧上传商品主体图片、填写核心卖点与要求，点击
              <strong class="text-brand">【开始生成】</strong>，AI 将为您生成图文与高转化营销文案。
            </p>
            <div class="empty-preview">
              <div class="preview-title">
                <span>示例生成效果 preview</span>
                <a class="load-sample" @click="loadDefaultSample">快速加载示例 ›</a>
              </div>
              <div class="preview-grid">
                <img v-for="(img, i) in RESULT_IMAGES" :key="i" :src="img.src" alt="示例图" />
              </div>
            </div>
          </div>

          <!-- 加载中 -->
          <div v-else-if="generating" class="loading-state">
            <div class="spinner">
              <div class="spin-ring"></div>
              <div class="spin-core"><el-icon><MagicStick /></el-icon></div>
            </div>
            <h4 class="loading-title">AI 深度思考与图文渲染中...</h4>
            <p class="loading-desc">正在分析商品特征、生成配图方向及高转化种草文案，请稍候</p>
            <div class="progress">
              <div class="progress-bar" :style="{ width: progress + '%' }"></div>
            </div>
          </div>

          <!-- 结果 -->
          <div v-else class="result">
            <div class="result-bar">
              <div class="result-status">
                <span class="dot"></span>
                <span class="status-text">生成成功</span>
                <span class="status-meta">| 共 3 张套图 + 营销文案包</span>
              </div>
              <div class="result-actions">
                <button class="ghost-btn" @click="downloadAll">
                  <el-icon><Download /></el-icon> 下载全套打包图
                </button>
                <button class="ghost-btn" @click="onGenerate">
                  <el-icon><Refresh /></el-icon> 重新生成
                </button>
              </div>
            </div>

            <!-- 套图 -->
            <div class="result-card">
              <div class="result-card-head">
                <h3 class="result-title">
                  <el-icon class="brand"><MagicStick /></el-icon>
                  <span>{{ RESULT.title }}</span>
                </h3>
                <span class="result-hint">支持点击单张图片放大预览</span>
              </div>
              <div class="img-grid">
                <div v-for="img in RESULT_IMAGES" :key="img.src" class="img-cell">
                  <el-image
                    :src="img.src"
                    :preview-src-list="RESULT_IMAGES.map((i) => i.src)"
                    fit="cover"
                    class="img"
                  />
                </div>
              </div>
            </div>

            <!-- 文案 -->
            <div class="result-card">
              <div class="result-card-head">
                <h3 class="result-title">
                  <el-icon class="brand"><MagicStick /></el-icon>
                  <span>AI 高转化营销文案包</span>
                </h3>
                <button class="ghost-btn" @click="copyAll">
                  <el-icon><CopyDocument /></el-icon> 一键复制全文案
                </button>
              </div>

              <div class="copy-block">
                <span class="copy-label">【爆款标题】</span>
                <p class="copy-title">{{ RESULT.title }}</p>
              </div>
              <div class="copy-block">
                <span class="copy-label">【核心卖点】</span>
                <ul class="copy-points">
                  <li v-for="p in RESULT.points" :key="p">{{ p }}</li>
                </ul>
              </div>
              <div class="copy-block">
                <span class="copy-label">【种草文案正文】</span>
                <p class="copy-body">{{ RESULT.body }}</p>
              </div>
              <div class="copy-block">
                <span class="copy-label">【话题建议】</span>
                <p class="copy-topics">{{ RESULT.topics }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadFilled, MagicStick, Delete, Download, Refresh, CopyDocument, Picture } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

/** 系统默认三张图片（位于 public/images） */
const RESULT_IMAGES = [
  { src: '/images/food-1.jpg' },
  { src: '/images/food-2.png' },
  { src: '/images/food-3.png' },
]

/** 本地 Mock 文案 */
const RESULT = {
  title: '成都人私藏！这家火锅店连锅底都能喝光光🍲',
  points: [
    '空运鲜毛肚 · 七上八下脆嫩化渣',
    '牛油锅底越煮越香 · 冰汤圆解辣一绝',
    '人均 ¥98 氛围感拉满 · 随手一拍都是大片',
  ],
  body: '周末和闺蜜去了春熙路这家火锅，人均 98 就能吃到空运毛肚，氛围感直接拉满！\n牛油锅底越煮越香，冰汤圆解辣一绝，随手一拍都是大片，赶紧收藏起来周末冲！',
  topics: '#成都美食 #火锅探店 #春熙路必吃 #周末去哪儿 #网红打卡',
}

const SAMPLES = [
  {
    key: 'hotpot',
    img: '/images/food-1.jpg',
    label: '火锅',
    text: '【商品名称】爆款九宫格火锅双人超值套餐\n【核心卖点】\n• 空运鲜毛肚 七上八下脆嫩化渣\n• 牛油锅底越煮越香 冰汤圆解辣一绝\n【风格要求】小红书种草风，突出沸腾特写与食欲氛围。',
  },
  {
    key: 'dish',
    img: '/images/food-2.png',
    label: '菜品',
    text: '【商品名称】招牌手打柠檬茶系列\n【核心卖点】\n• 现点现打 酸甜清爽不齁甜\n• 清新绿意包装 拍照自带滤镜\n【风格要求】突出清爽夏日感，画面明亮通透。',
  },
  {
    key: 'scene',
    img: '/images/food-3.png',
    label: '环境',
    text: '【商品名称】网红打卡餐厅环境氛围\n【核心卖点】\n• 复古工业风 出片率极高\n• 暖黄灯光 氛围感直接拉满\n【风格要求】突出环境氛围照，适合情侣约会与聚会。',
  },
]

const textareaPlaceholder =
  '请输入商品信息包括：商品名称、商品描述、核心卖点、目标受众。您也可以在上传商品图后点击【AI帮写】一键智能分析。'

const fileInput = ref<HTMLInputElement>()
const uploadImages = ref<string[]>([])
const sellingPoints = ref('')
const selectedSample = ref('hotpot')
const generating = ref(false)
const generated = ref(false)
const progress = ref(0)

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  for (const file of Array.from(files).slice(0, 10)) {
    const reader = new FileReader()
    reader.onload = () => uploadImages.value.push(reader.result as string)
    reader.readAsDataURL(file)
  }
  ;(e.target as HTMLInputElement).value = ''
}

function removeImage(i: number) {
  uploadImages.value.splice(i, 1)
}

function loadMaterialLibrary() {
  uploadImages.value = RESULT_IMAGES.map((i) => i.src)
  ElMessage.success('已从素材库中拉取最新高清底图')
}

function selectSample(key: string) {
  selectedSample.value = key
  const s = SAMPLES.find((x) => x.key === key)
  if (s) sellingPoints.value = s.text
  ElMessage.success('已选中示例模版')
}

function aiHelpFill() {
  sellingPoints.value = `【商品名称】爆款九宫格火锅双人超值套餐\n【核心卖点】\n• 空运鲜毛肚 七上八下脆嫩化渣\n• 牛油锅底越煮越香 冰汤圆解辣一绝\n• 人均 ¥98 氛围感拉满 随手出大片\n【目标受众】18-35 岁 情侣与朋友聚餐\n【风格要求】小红书种草风，首图沸腾特写，突出食欲与氛围感。`
  ElMessage.success('AI 已自动生成并填充商品卖点')
}

function clearTextarea() {
  sellingPoints.value = ''
  ElMessage.success('已清空内容')
}

function loadDefaultSample() {
  selectSample('hotpot')
  onGenerate()
}

async function onGenerate() {
  if (!sellingPoints.value.trim()) {
    aiHelpFill()
  }
  generated.value = false
  generating.value = true
  progress.value = 0
  await new Promise<void>((resolve) => {
    const timer = setInterval(() => {
      progress.value = Math.min(100, progress.value + 20)
      if (progress.value >= 100) {
        clearInterval(timer)
        resolve()
      }
    }, 250)
  })
  generating.value = false
  generated.value = true
  ElMessage.success('AI 图文与文案生成完毕！')
}

function downloadAll() {
  ElMessage.success('正在打包全套 3 张高质海报及文案 TXT...')
}

async function copyAll() {
  const full = `【爆款标题】\n${RESULT.title}\n\n【核心卖点】\n${RESULT.points.map((p) => '• ' + p).join('\n')}\n\n【种草文案正文】\n${RESULT.body}\n\n【话题建议】\n${RESULT.topics}`
  try {
    await navigator.clipboard.writeText(full)
    ElMessage.success('文案已一键复制到剪贴板！')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}
</script>

<style scoped>
.xhs-creator {
  display: flex;
  flex-direction: column;
}
.split {
  display: grid;
  grid-template-columns: 460px 1fr;
  gap: 24px;
  align-items: start;
}
/* ---------- LEFT ---------- */
.left-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.block-label {
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
}
.req {
  color: var(--danger);
}
.hint-icon {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid var(--text-muted);
  color: var(--text-muted);
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: help;
}
.block-tip,
.extra-tip {
  font-size: 12px;
  color: var(--text-muted);
}
.upload-zone {
  position: relative;
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  background: var(--bg-color);
  transition: border-color 0.2s;
  overflow: hidden;
}
.upload-zone:hover {
  border-color: var(--brand-500);
}
.upload-zone.has-img {
  border-style: solid;
  padding: 12px;
}
.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}
.upload-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 22px 16px;
  text-align: center;
}
.upload-cloud {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: var(--brand-50);
  color: var(--brand-500);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}
.upload-btns {
  display: flex;
  gap: 10px;
}
.up-btn {
  padding: 4px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-color);
}
.up-btn:hover {
  border-color: var(--brand-500);
}
.upload-tip {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}
.upload-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.up-cell {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}
.up-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.up-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.up-add {
  aspect-ratio: 1;
  border-radius: 8px;
  border: 1px dashed var(--border-color);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.up-add:hover {
  border-color: var(--brand-500);
  color: var(--brand-500);
}
.sample-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 4px;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
}
.sample-label {
  font-size: 12px;
  color: var(--text-muted);
  flex-shrink: 0;
}
.sample-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  background: none;
}
.sample-btn.active {
  border-color: var(--brand-500);
}
.sample-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.sample-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 9px;
  text-align: center;
  padding: 1px 0;
}
.tips {
  font-size: 11px;
  color: var(--text-muted);
}
.ai-help {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 8px;
  border: none;
  background: var(--brand-50);
  color: var(--brand-500);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.ai-help:hover {
  background: var(--brand-100);
}
.textarea-wrap {
  position: relative;
}
.textarea-wrap :deep(.el-textarea__inner) {
  background: var(--bg-color);
}
.clear-btn {
  position: absolute;
  bottom: 8px;
  left: 8px;
  border: none;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  z-index: 2;
}
.clear-btn:hover {
  color: var(--danger);
}
.extra-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
  border-top: 1px solid var(--border-color);
  font-size: 12px;
}
.extra-label {
  font-weight: 500;
}
.muted {
  color: var(--text-muted);
  font-weight: 400;
}
.generate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(90deg, var(--brand-600), #5a67d8);
  box-shadow: var(--shadow-card);
  transition: opacity 0.2s;
}
.generate-btn:hover {
  opacity: 0.92;
}
.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.cost-badge {
  font-size: 12px;
  font-weight: 400;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 999px;
}
/* ---------- RIGHT ---------- */
.right {
  min-height: 620px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.right-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
}
.right-tabs {
  display: flex;
  align-items: center;
  gap: 24px;
}
.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  padding-bottom: 2px;
}
.tab.active {
  color: var(--brand-500);
  font-weight: 700;
  border-bottom: 2px solid var(--brand-500);
}
.right-help {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-color);
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}
.right-body {
  flex: 1;
  padding: 24px;
  background: var(--bg-color);
  overflow-y: auto;
}
/* 空状态 */
.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 460px;
  margin: 0 auto;
}
.empty-icon {
  position: relative;
  width: 88px;
  height: 88px;
  border-radius: 24px;
  background: var(--brand-50);
  border: 1px solid var(--brand-100);
  color: var(--brand-500);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.ping {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--brand-500);
  opacity: 0.5;
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
.empty-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px;
}
.empty-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0 0 20px;
}
.empty-preview {
  width: 100%;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 14px;
}
.preview-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 12px;
}
.load-sample {
  color: var(--brand-500);
  cursor: pointer;
}
.preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.preview-grid img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}
/* 加载中 */
.loading-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.spinner {
  position: relative;
  width: 72px;
  height: 72px;
  margin-bottom: 20px;
}
.spin-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 4px solid var(--brand-100);
  border-top-color: var(--brand-500);
  animation: spin 1s linear infinite;
}
.spin-core {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-500);
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.loading-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 8px;
}
.loading-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0 0 16px;
  max-width: 320px;
}
.progress {
  width: 240px;
  height: 6px;
  border-radius: 999px;
  background: var(--border-color);
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--brand-500), var(--brand-600));
  transition: width 0.25s;
}
/* 结果 */
.result {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 16px;
  flex-wrap: wrap;
}
.result-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--success);
}
.status-meta {
  color: var(--text-muted);
  font-weight: 400;
}
.result-actions {
  display: flex;
  gap: 8px;
}
.ghost-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.ghost-btn:hover {
  background: var(--bg-color);
}
.result-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.result-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.result-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}
.result-title .brand {
  color: var(--brand-500);
}
.result-hint {
  font-size: 12px;
  color: var(--text-muted);
}
.img-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.img-cell {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
}
.img-cell .img {
  width: 100%;
  height: 100%;
  display: block;
}
.copy-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.copy-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-500);
}
.copy-title,
.copy-points,
.copy-body,
.copy-topics {
  margin: 0;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px;
  font-size: 13px;
  line-height: 1.7;
}
.copy-title {
  font-weight: 700;
}
.copy-points {
  list-style: disc;
  padding-left: 28px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.copy-body {
  white-space: pre-line;
}
.copy-topics {
  color: var(--brand-500);
  font-weight: 600;
}
/* ---------- RESPONSIVE ---------- */
@media (max-width: 1100px) {
  .split {
    grid-template-columns: 1fr;
  }
  .right {
    min-height: 520px;
  }
}
@media (max-width: 640px) {
  .img-grid,
  .preview-grid {
    grid-template-columns: 1fr;
  }
}
</style>
