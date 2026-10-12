import type { Diagnosis } from '@/types/diagnosis'
import { formatNow } from '@/utils/format'

/** 已生成的门店诊断报告（key 为 storeId） */
export const diagnosisMockMap: Record<string, Diagnosis> = {
  's-101': {
    id: 'd-101',
    storeId: 's-101',
    version: 3,
    overview:
      '该门店位于核心商圈春熙路，客流量大但转化漏斗中上游流量偏弱。大众点评评分 4.7，抖音团购核销率 68%，整体表现健康，但线上笔记曝光增长停滞。',
    problems: [
      {
        severity: '高',
        title: '视频号与抖音短视频更新频次不足',
        desc: '近 14 天仅发布 2 条短视频，未触发平台算法流量池。',
      },
      {
        severity: '中',
        title: '团购套餐结构缺乏引流爆款',
        desc: '双人餐客单价略高，缺少 69 元限时秒杀款拉动周中客流。',
      },
      {
        severity: '低',
        title: '门店标签关键词覆盖不全',
        desc: '搜索「九宫格老火锅」排名靠后，长尾词流量流失。',
      },
    ],
    causes: '运营团队重线下接待而轻线上内容矩阵构建，未建立标准化的达人异业合作和短视频周更机制。',
    suggestions: [
      '立即策划一场“全场菜品 6.8 折”的抖音直播秒杀活动，快速积累初始核销好评。',
      '组建素人达人探店激励计划，每周邀约 5-8 位本地美食达人到店打卡。',
      '优化大众点评首页头图，增加视觉冲击力强招牌菜展示。',
    ],
    directions: ['流量爆发矩阵', '爆款团购重构', '私域转化链路'],
    createdAt: '2026-10-12 14:30',
  },
}

/** 无历史记录的门店使用兜底诊断 */
export function buildFallbackDiagnosis(storeId: string): Diagnosis {
  return {
    id: `d-${storeId}`,
    storeId,
    version: 1,
    overview: '该门店客流结构稳定，但在年轻客群抖音触达率及团购性价比上仍有提升空间。',
    problems: [
      {
        severity: '中',
        title: '周中时段上座率偏低',
        desc: '周一至周四客流仅为周末的 40%，人工与房租成本固定。',
      },
    ],
    causes: '缺少针对周中客群的专项秒杀套餐及私域社群引导。',
    suggestions: ['推出周中专享 68 折双人火锅套餐', '建立企业微信社群发放专属福利券'],
    directions: ['周中拉新', '私域沉淀'],
    createdAt: formatNow(),
  }
}
