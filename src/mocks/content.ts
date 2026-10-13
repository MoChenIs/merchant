import type { ContentBlock, ContentType, StoryboardRow } from '@/types/content'

/** 三张本地图片，模拟 AI 生成的图片（位于 public/images） */
export const contentImages: Record<ContentType, string> = {
  'group-buy': '/images/food-1.jpg',
  xhs: '/images/food-2.png',
  video: '/images/food-3.png',
}

/** 团购套餐图文：文案分块 */
export const groupBuyBlocks: ContentBlock[] = [
  { label: '套餐名称', text: '🍜 【蔬八戒手擀面】双人超值欢聚套餐' },
  { label: '价格标签', text: '原价 ¥68 → 限时秒杀 ¥39.9 · 含手擀面 / 招牌凉菜 / 饮品' },
  {
    label: '卖点文案',
    text: '每日现擀手擀面筋道爽滑，招牌凉菜现拌现做爽口开胃，汤头浓郁不齁咸，分量十足超实惠！',
  },
  {
    label: '详情描述',
    text: '环境清爽干净出片率高，适合工作日午餐与朋友小聚。团购到店核销再送卤蛋，快带上饭搭子冲！',
  },
]

/** 小红书图文：文案分块 */
export const xhsBlocks: ContentBlock[] = [
  { label: '标题', text: '成都人私藏！这家火锅店连锅底都能喝光光🍲' },
  {
    label: '正文',
    text: '周末和闺蜜去了春熙路这家火锅，人均 98 就能吃到空运毛肚，氛围感直接拉满！牛油锅底越煮越香，冰汤圆解辣一绝，随手一拍都是大片，赶紧收藏起来周末冲！',
  },
  { label: '配图方向', text: '首图火锅沸腾特写，2-3 图菜品摆盘细节，4 图店内环境氛围照' },
  { label: '话题建议', text: '#成都美食 #火锅探店 #春熙路必吃 #周末去哪儿 #网红打卡' },
]

/** 短视频脚本：分镜表 */
export const storyboardRows: StoryboardRow[] = [
  {
    scene: '镜头从沸腾的九宫格红汤特写切入，热气腾腾升起',
    shot: '特写',
    subtitle: '春熙路老字号火锅',
    narration: '这口沸腾的牛油锅底，惊艳了整个成都的夜晚。',
    audio: '咕嘟咕嘟沸腾音效',
    duration: '4s',
  },
  {
    scene: '店员端出招牌鲜毛肚，冰雾缭绕，质感拉满',
    shot: '近景',
    subtitle: '空运鲜毛肚 · 七上八下',
    narration: '每日空运的鲜毛肚，七上八下，脆嫩化渣。',
    audio: '欢快节奏音乐起',
    duration: '6s',
  },
  {
    scene: '镜头扫过店内招牌与排队人群，展示人气爆棚',
    shot: '全景',
    subtitle: '排队也要吃的人气王',
    narration: '还没到饭点门口就排起了长队，这味道到底有多绝？',
    audio: '人群喧闹声',
    duration: '5s',
  },
  {
    scene: '年轻顾客在店内打卡就餐，脸上洋溢着满足的笑容',
    shot: '中景',
    subtitle: '氛围感拉满 · 聚会首选',
    narration: '和喜欢的人一起吃一顿热气腾腾的火锅，就是生活的小确幸。',
    audio: '温馨吉他伴奏',
    duration: '8s',
  },
  {
    scene: '结尾定格在套餐价格与门店定位，引导团购下单',
    shot: '特写',
    subtitle: '双人套餐 ¥198 限时抢',
    narration: '点击左下角团购链接，和 TA 一起解锁这顿沸腾的幸福。',
    audio: '轻快收尾音效',
    duration: '6s',
  },
]
