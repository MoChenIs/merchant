export type Theme = 'light' | 'dark'

export type StoreStatus = 'diagnosed' | 'pending' | 'incomplete'

export interface CustomField {
  id: string
  name: string
  value: string
}

export interface Activity {
  id: string
  title: string
  time: string
  color: string
}

export interface Todo {
  id: string
  title: string
  time: string
  done: boolean
}

export interface StatItem {
  label: string
  value: string
  deltaType: 'up' | 'warn'
  deltaText: string
  icon: string
}
