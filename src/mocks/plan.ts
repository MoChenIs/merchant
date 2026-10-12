import type { Plan, PlanGoal } from '@/types/plan'
import { formatNow } from '@/utils/format'

/** 已生成的营销方案（key 为 storeId） */
export const planMockMap: Record<string, Plan> = {
  's-101': {
    id: 'p-101',
    storeId: 's-101',
    goal: '新店开业',
    period: '4 周增长冲刺计划',
    budget: '约 ¥5,000 / 月',
    keyProducts: '招牌毛肚、九宫格鲜牛肉、红糖糍粑',
    objective: '实现抖音团购月销突破 500 单，大众点评晋升商圈火锅榜前三。',
    stages: [
      {
        week: '第 1 周',
        title: '账号冷启动与基础基建完善',
        desc: '完善抖音、小红书、大众点评三端视觉与团购链接上架。',
        tags: ['账号装修', '团购上架'],
        state: 'done',
      },
      {
        week: '第 2 周',
        title: '达人探店引爆与小红书种草',
        desc: '定向邀约本地美食达人 10 人，产出高质图文与短视频笔记。',
        tags: ['达人合作', '图文种草'],
        state: 'next',
      },
      {
        week: '第 3 周',
        title: '直播矩阵搭建与转化收割',
        desc: '开启每周 3 场店长直播，主推 88 元双人超值欢聚套餐。',
        tags: ['直播秒杀', '转化收割'],
        state: 'todo',
      },
      {
        week: '第 4 周',
        title: '老客复购裂变与口碑固化',
        desc: '上线会员积分体系与离店二次触达券，拉高复购。',
        tags: ['会员裂变', '复盘优化'],
        state: 'todo',
      },
    ],
    actions: ['每周固定产出 3 条高完播率短视频', '设立达人专属佣金激励机制', '每日监控核销数据并动态调整投流'],
    collaborations: [
      '需门店配合提供每周 5 份免费试吃名额给探达人',
      '需前厅经理培训服务员引导用户扫码好评',
    ],
    createdAt: '2026-10-10 10:15',
  },
}

/** 无历史方案的门店使用兜底方案 */
export function buildFallbackPlan(storeId: string, goal: PlanGoal): Plan {
  return {
    id: `p-${storeId}`,
    storeId,
    goal,
    period: '4 周增长冲刺计划',
    budget: '约 ¥5,000 / 月',
    keyProducts: '招牌菜品、引流套餐',
    objective: '通过精准达人种草与直播秒杀，实现月营业额环比提升 35%。',
    stages: [
      {
        week: '第 1 周',
        title: '线上基建与团购套餐包装',
        desc: '上架全新引流双人套餐并完成抖音 POI 认领。',
        tags: ['团购上架'],
        state: 'done',
      },
      {
        week: '第 2 周',
        title: '同城达人探店引爆',
        desc: '邀约 10 位本地生活达人到店打卡。',
        tags: ['达人种草'],
        state: 'next',
      },
    ],
    actions: ['每周固定产出 3 条短视频', '设立专属佣金机制'],
    collaborations: ['需门店配合提供免费试吃名额'],
    createdAt: formatNow(),
  }
}
