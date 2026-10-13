import { defineStore } from 'pinia'
import { generateContent, type GenerateContentInput } from '@/services/content'
import type { ContentResult, ContentType } from '@/types/content'

export const useContentStore = defineStore('content', {
  state: () => ({
    /** 按内容类型分别缓存生成结果，避免三个模块相互覆盖/清空 */
    results: {} as Partial<Record<ContentType, ContentResult>>,
    /** 小红书模块是否已生成（结果固定，仅持久化生成状态） */
    xhsGenerated: false,
    loading: false,
  }),
  getters: {
    resultOf: (state) => (type: ContentType) => state.results[type] ?? null,
  },
  actions: {
    async generate(input: GenerateContentInput): Promise<ContentResult> {
      this.loading = true
      const result = await generateContent(input)
      this.results[input.type] = result
      this.loading = false
      return result
    },
    setXhsGenerated(value: boolean) {
      this.xhsGenerated = value
    },
    reset(type?: ContentType) {
      if (type) {
        delete this.results[type]
        if (type === 'xhs') this.xhsGenerated = false
      } else {
        this.results = {}
        this.xhsGenerated = false
      }
    },
  },
})
