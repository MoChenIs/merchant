export interface Problem {
  severity: '高' | '中' | '低'
  title: string
  desc: string
}

export interface Diagnosis {
  id: string
  storeId: string
  version: number
  overview: string
  problems: Problem[]
  causes: string
  suggestions: string[]
  directions: string[]
  createdAt: string
}
