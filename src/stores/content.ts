import { defineStore } from 'pinia'
import { generateContent, type GenerateContentInput } from '@/services/content'
import type { ContentResult } from '@/types/content'

export const useContentStore = defineStore('content', {
  state: () => ({
    result: null as ContentResult | null,
    loading: false,
  }),
  actions: {
    async generate(input: GenerateContentInput): Promise<ContentResult> {
      this.loading = true
      const result = await generateContent(input)
      this.result = result
      this.loading = false
      return result
    },
    reset() {
      this.result = null
    },
  },
})
