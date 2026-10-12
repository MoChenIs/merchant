import { mockRequest, clone } from './http'
import { storesMock } from '@/mocks/stores'
import { genId, formatNow } from '@/utils/format'
import type { Store, StoreFormData } from '@/types/store'

// 内存数据库：模拟后端存储（页面刷新即还原为种子数据）
let db: Store[] = clone(storesMock)

export function listStores(): Promise<Store[]> {
  return mockRequest(clone(db), 300)
}

export function getStoreById(id: string): Promise<Store | undefined> {
  return mockRequest(clone(db.find((s) => s.id === id)), 200)
}

export function createStore(input: StoreFormData): Promise<Store> {
  const store: Store = {
    id: genId('s'),
    ...clone(input),
    customFields: (input.customFields ?? []).filter((f) => f.name || f.value),
    status: 'pending',
    updatedAt: formatNow(),
  }
  db.unshift(store)
  return mockRequest(clone(store), 300)
}

export function updateStore(id: string, input: StoreFormData): Promise<Store | undefined> {
  const index = db.findIndex((s) => s.id === id)
  if (index < 0) return mockRequest(undefined, 200)
  const updated: Store = {
    ...db[index],
    ...clone(input),
    customFields: (input.customFields ?? []).filter((f) => f.name || f.value),
    updatedAt: formatNow(),
  }
  db[index] = updated
  return mockRequest(clone(updated), 300)
}
