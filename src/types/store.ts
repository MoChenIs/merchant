import type { CustomField, StoreStatus } from './common'

export interface Store {
  id: string
  // 基础资料
  name: string
  city: string
  address: string
  category: string
  avgPrice: string
  businessHours: string
  // 经营情况
  monthlyRevenue: string
  dailyTraffic: string
  targetAudience: string
  currentProblem: string
  // 线上信息
  douyin: string
  xiaohongshu: string
  dianping: string
  // 团购 / 扩展
  groupBuy: string
  customFields: CustomField[]
  // 元数据
  status: StoreStatus
  updatedAt: string
}

/** 新增/编辑门店时的表单数据结构（不含 id/status/updatedAt 元数据） */
export type StoreFormData = Omit<Store, 'id' | 'status' | 'updatedAt'>
