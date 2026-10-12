export type ContentType = 'group-buy' | 'xhs' | 'video'

/** 图文 / 套餐：文案分块 */
export interface ContentBlock {
  label: string
  text: string
}

/** 短视频：分镜表行 */
export interface StoryboardRow {
  scene: string
  shot: string
  subtitle: string
  narration: string
  audio: string
  duration: string
}

export interface ContentResult {
  id: string
  storeId: string
  type: ContentType
  prompt: string
  uploadImage?: string
  image?: string
  blocks?: ContentBlock[]
  storyboard?: StoryboardRow[]
  createdAt: string
}
