export type PlanGoal = '新店开业' | '老店提升客流' | '新品推广' | '节假日大促'

export interface Stage {
  week: string
  title: string
  desc: string
  tags: string[]
  state: 'done' | 'next' | 'todo'
}

export interface Plan {
  id: string
  storeId: string
  goal: PlanGoal
  period: string
  budget: string
  keyProducts: string
  objective: string
  stages: Stage[]
  actions: string[]
  collaborations: string[]
  createdAt: string
}
