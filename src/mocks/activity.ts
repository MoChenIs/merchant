import type { Activity, Todo } from '@/types/common'

export const activitiesMock: Activity[] = [
  { id: 'act-1', title: '系统成功为「川渝火锅·春熙路店」生成新版诊断报告', time: '10分钟前', color: '#2a78d6' },
  { id: 'act-2', title: '用户「运营总监-张」导出了本月营销方案与短视频脚本', time: '1小时前', color: '#eb6834' },
  { id: 'act-3', title: '新增门店「江南小馆·外滩源店」档案关联成功', time: '3小时前', color: '#10b981' },
  { id: 'act-4', title: 'AI 内容工作台完成 12 篇小红书笔记批量生成', time: '昨天', color: '#8b5cf6' },
]

export const todosMock: Todo[] = [
  { id: 'todo-1', title: '审核「老成都串串香」本周短视频分镜脚本', time: '今天 17:00', done: false },
  { id: 'todo-2', title: '更新「川渝火锅·春熙路店」抖音团购套餐图片', time: '明天 12:00', done: true },
  { id: 'todo-3', title: '跟进外滩源店江浙菜新品线上曝光转化', time: '10月15日', done: false },
]
