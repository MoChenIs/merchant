import type { Store, StoreFormData } from '@/types/store'

/** 新增门店时的空表单（14 个字段初始为空，由用户填写） */
export function emptyStoreForm(): StoreFormData {
  return {
    name: '',
    city: '',
    address: '',
    category: '',
    avgPrice: '',
    businessHours: '',
    monthlyRevenue: '',
    dailyTraffic: '',
    targetAudience: '',
    currentProblem: '',
    douyin: '',
    xiaohongshu: '',
    dianping: '',
    groupBuy: '',
    customFields: [],
  }
}

/** 门店数据 -> 表单数据（深拷贝自定义字段，避免直接篡改源数据） */
export function storeToForm(s: Store): StoreFormData {
  return {
    name: s.name,
    city: s.city,
    address: s.address,
    category: s.category,
    avgPrice: s.avgPrice,
    businessHours: s.businessHours,
    monthlyRevenue: s.monthlyRevenue,
    dailyTraffic: s.dailyTraffic,
    targetAudience: s.targetAudience,
    currentProblem: s.currentProblem,
    douyin: s.douyin,
    xiaohongshu: s.xiaohongshu,
    dianping: s.dianping,
    groupBuy: s.groupBuy,
    customFields: s.customFields.map((f) => ({ ...f })),
  }
}
