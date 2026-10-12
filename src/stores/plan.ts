import { defineStore } from 'pinia'
import { getPlan, buildPlanStreamText } from '@/services/plan'
import type { Plan, PlanGoal } from '@/types/plan'

export const usePlanStore = defineStore('plan', {
  state: () => ({
    goal: '新店开业' as PlanGoal,
    cache: {} as Record<string, Plan>,
    loading: false,
  }),
  actions: {
    setGoal(goal: PlanGoal) {
      this.goal = goal
    },
    async load(storeId: string, goal: PlanGoal): Promise<Plan> {
      const key = `${storeId}:${goal}`
      if (!this.cache[key]) {
        this.loading = true
        this.cache[key] = await getPlan(storeId, goal)
        this.loading = false
      }
      return this.cache[key]
    },
    async generateStreamText(storeId: string, storeName: string, goal: PlanGoal): Promise<string> {
      const data = await this.load(storeId, goal)
      return buildPlanStreamText(data, storeName)
    },
  },
})
