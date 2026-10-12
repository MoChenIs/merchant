<template>
  <header class="topbar">
    <div class="topbar-left">
      <span class="topbar-label">当前操作门店:</span>
      <el-select
        :model-value="appStore.currentStoreId"
        style="width: 220px"
        placeholder="选择门店"
        @change="handleStoreChange"
      >
        <el-option v-for="s in storeStore.stores" :key="s.id" :label="s.name" :value="s.id" />
      </el-select>
      <el-tag type="success" size="small" effect="plain" class="hidden-sm">已连接 AI 引擎</el-tag>
    </div>

    <div class="topbar-right">
      <el-input v-model="search" placeholder="搜索门店、诊断或方案..." style="width: 220px" clearable>
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-badge :value="3" class="badge">
        <el-button circle :icon="Bell" @click="appStore.openNotification()" />
      </el-badge>

      <ThemeToggle />

      <el-dropdown trigger="click">
        <span class="user">
          <el-avatar :size="32" class="user-avatar">张</el-avatar>
          <span class="user-name hidden-sm">运营总监-张</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="router.push('/settings')">账号设置</el-dropdown-item>
            <el-dropdown-item @click="router.push('/help')">帮助文档</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <el-drawer v-model="appStore.notificationVisible" title="系统通知中心" size="380px">
      <div class="notify-list">
        <div v-for="i in 3" :key="i" class="notify-item">
          <div class="notify-head">
            <span class="notify-title">AI 诊断报告已生成</span>
            <span class="notify-time">20分钟前</span>
          </div>
          <p class="notify-desc">
            您的门店「川渝火锅·春熙路店」完成了第 3 版经营优化诊断，请及时查看。
          </p>
        </div>
      </div>
    </el-drawer>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Bell, Search } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
import { useStoreStore } from '@/stores/store'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const router = useRouter()
const appStore = useAppStore()
const storeStore = useStoreStore()

const search = ref('')

function handleStoreChange(id: string) {
  appStore.setCurrentStore(id)
  const name = storeStore.stores.find((s) => s.id === id)?.name
  ElMessage.success(`已切换至门店：${name}`)
}

function handleLogout() {
  ElMessage.info('已安全登出系统（演示）')
}
</script>

<style scoped>
.topbar {
  height: 64px;
  flex-shrink: 0;
  background: var(--topbar-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 20;
}
.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.topbar-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}
.user {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  outline: none;
}
.user-name {
  font-size: 14px;
  font-weight: 500;
}
.user-avatar {
  background: linear-gradient(135deg, var(--brand-500), var(--accent-500));
  color: #fff;
  font-weight: 600;
}
.badge {
  display: inline-flex;
}

.notify-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.notify-item {
  padding: 12px;
  border-radius: 8px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
}
.notify-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.notify-title {
  font-size: 14px;
  font-weight: 500;
}
.notify-time {
  font-size: 12px;
  color: var(--text-secondary);
}
.notify-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

@media (max-width: 900px) {
  .hidden-sm {
    display: none;
  }
}
</style>
