import { mockRequest } from './http'
import { planMockMap, buildFallbackPlan } from '@/mocks/plan'
import type { Plan, PlanGoal } from '@/types/plan'

export function getPlan(storeId: string, goal: PlanGoal): Promise<Plan> {
  const data = planMockMap[storeId] ?? buildFallbackPlan(storeId, goal)
  return mockRequest({ ...data, goal }, 350)
}

/** 将结构化方案序列化为用于流式输出的完整文本 */
export function buildPlanStreamText(p: Plan, storeName: string): string {
  return [
    `【AI 营销策划方案】门店：${storeName}`,
    `目标：${p.goal} · 周期：${p.period} · 预算：${p.budget}`,
    `主推产品：${p.keyProducts}`,
    '',
    `1. 核心达成目标：${p.objective}`,
    '',
    '2. 多阶段行动时间线：',
    ...p.stages.map((s) => `- ${s.week}｜${s.title}：${s.desc}`),
    '',
    '3. 执行落地关键动作：',
    ...p.actions.map((a) => `- ${a}`),
    '',
    '4. 重要配合事项：',
    ...p.collaborations.map((c) => `- ${c}`),
  ].join('\n')
}
