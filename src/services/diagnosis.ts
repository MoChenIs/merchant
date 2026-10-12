import { mockRequest } from './http'
import { diagnosisMockMap, buildFallbackDiagnosis } from '@/mocks/diagnosis'
import type { Diagnosis } from '@/types/diagnosis'

export function getDiagnosis(storeId: string): Promise<Diagnosis> {
  const data = diagnosisMockMap[storeId] ?? buildFallbackDiagnosis(storeId)
  return mockRequest(data, 350)
}

/** 将结构化诊断序列化为用于流式输出的完整文本 */
export function buildDiagnosisStreamText(d: Diagnosis, storeName: string): string {
  return [
    `【AI 经营诊断报告】门店：${storeName}`,
    '',
    `1. 现状概述：${d.overview}`,
    '',
    '2. 主要发现的问题与风险：',
    ...d.problems.map((p) => `- [${p.severity}级风险] ${p.title}：${p.desc}`),
    '',
    `3. 核心根因分析：${d.causes}`,
    '',
    '4. 优先改进建议：',
    ...d.suggestions.map((s) => `- ${s}`),
    '',
    `5. 分析方向：${d.directions.join(' / ')}`,
  ].join('\n')
}
