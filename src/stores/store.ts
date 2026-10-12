import { defineStore } from 'pinia'
import { listStores, createStore, updateStore, getStoreById } from '@/services/store'
import type { Store, StoreFormData } from '@/types/store'

export const useStoreStore = defineStore('store', {
  state: () => ({
    stores: [] as Store[],
    loading: false,
  }),
  getters: {
    getById: (state) => (id: string) => state.stores.find((s) => s.id === id),
  },
  actions: {
    async fetchStores() {
      this.loading = true
      this.stores = await listStores()
      this.loading = false
    },
    async fetchOne(id: string) {
      return getStoreById(id)
    },
    async create(input: StoreFormData) {
      const store = await createStore(input)
      this.stores.unshift(store)
      return store
    },
    async update(id: string, input: StoreFormData) {
      const store = await updateStore(id, input)
      if (store) {
        this.stores = this.stores.map((s) => (s.id === id ? store : s))
      }
      return store
    },
  },
})
