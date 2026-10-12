import { mockRequest } from './http'
import { contentImages, groupBuyBlocks, xhsBlocks, storyboardRows } from '@/mocks/content'
import { genId, formatNow } from '@/utils/format'
import type { ContentResult, ContentType } from '@/types/content'

export interface GenerateContentInput {
  storeId: string
  type: ContentType
  prompt: string
  uploadImage?: string
}

/** 模拟 AI 生成内容（返回占位图 + 文案分块 / 分镜表） */
export function generateContent(input: GenerateContentInput): Promise<ContentResult> {
  return mockRequest(buildResult(input), 500)
}

/** 将内容结果序列化为流式输出文本（生成过程中的“进度”文案） */
export function buildContentStreamText(result: ContentResult, storeName: string): string {
  const head = `【AI 内容生成】门店：${storeName}\n类型：${typeLabel(result.type)}\n提示词：${result.prompt || '默认推荐'}\n`
  if (result.storyboard) {
    const rows = result.storyboard
      .map((r, i) => `分镜${i + 1}｜${r.shot}｜${r.scene}｜${r.narration}（${r.duration}）`)
      .join('\n')
    return `${head}\n[视频脚本分镜表已生成]\n${rows}`
  }
  const blocks = (result.blocks ?? []).map((b) => `${b.label}：${b.text}`).join('\n')
  return `${head}\n[图文与文案已生成]\n${blocks}`
}

function typeLabel(type: ContentType): string {
  if (type === 'group-buy') return '团购套餐图文设计'
  if (type === 'xhs') return '小红书图文推广设计'
  return '短视频脚本生成'
}

function buildResult(input: GenerateContentInput): ContentResult {
  const { storeId, type, prompt, uploadImage } = input
  const base: ContentResult = {
    id: genId('c'),
    storeId,
    type,
    prompt,
    createdAt: formatNow(),
  }
  if (type === 'video') {
    return { ...base, storyboard: storyboardRows }
  }
  const image = type === 'xhs' ? contentImages.xhs : contentImages['group-buy']
  const blocks = type === 'xhs' ? xhsBlocks : groupBuyBlocks
  return { ...base, image, blocks, uploadImage }
}
