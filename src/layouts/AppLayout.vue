<template>
  <div class="app-shell">
    <AppSidebar />
    <div class="app-main">
      <main class="app-content custom-scrollbar">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppSidebar from './AppSidebar.vue'
import { useStoreStore } from '@/stores/store'
import { useAppStore } from '@/stores/app'

const storeStore = useStoreStore()
const appStore = useAppStore()

onMounted(async () => {
  await storeStore.fetchStores()
  if (!storeStore.stores.some((s) => s.id === appStore.currentStoreId)) {
    appStore.setCurrentStore(storeStore.stores[0]?.id ?? '')
  }
})
</script>

<style scoped>
.app-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.app-main {
  flex: 1;
  min-width: 0;
  margin-left: 256px;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.app-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 32px;
  background: var(--bg-color);
}
</style>
