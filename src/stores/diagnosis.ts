import { defineStore } from 'pinia'
import { getDiagnosis, buildDiagnosisStreamText } from '@/services/diagnosis'
import type { Diagnosis } from '@/types/diagnosis'

export const useDiagnosisStore = defineStore('diagnosis', {
  state: () => ({
    cache: {} as Record<string, Diagnosis>,
    loading: false,
  }),
  actions: {
    async load(storeId: string): Promise<Diagnosis> {
      if (!this.cache[storeId]) {
        this.loading = true
        this.cache[storeId] = await getDiagnosis(storeId)
        this.loading = false
      }
      return this.cache[storeId]
    },
    async generateStreamText(storeId: string, storeName: string): Promise<string> {
      const data = await this.load(storeId)
      return buildDiagnosisStreamText(data, storeName)
    },
  },
})
