<template>
  <aside class="sidebar">
    <BrandLogo />

    <nav class="nav custom-scrollbar">
      <div v-for="group in groups" :key="group.title" class="nav-group">
        <div class="nav-group-title">{{ group.title }}</div>
        <RouterLink
          v-for="item in group.items"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item) }"
        >
          <el-icon :size="18"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </RouterLink>
      </div>
    </nav>

    <div class="sidebar-footer">
      <el-avatar :size="36" class="user-avatar">张</el-avatar>
      <div class="user-meta">
        <div class="user-name">运营总监-张</div>
        <div class="user-role">VIP 旗舰版</div>
      </div>
      <ThemeToggle />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  Odometer,
  Shop,
  DataAnalysis,
  TrendCharts,
  EditPen,
  DocumentChecked,
  Setting,
  Help,
} from '@element-plus/icons-vue'
import BrandLogo from '@/components/layout/BrandLogo.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

interface NavItem {
  path: string
  label: string
  icon: unknown
  prefix?: boolean
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const route = useRoute()

const groups: NavGroup[] = [
  {
    title: '核心看板',
    items: [{ path: '/dashboard', label: '工作台', icon: Odometer }],
  },
  {
    title: '门店与运营',
    items: [
      { path: '/stores', label: '门店管理', icon: Shop, prefix: true },
      { path: '/diagnosis', label: 'AI 经营诊断', icon: DataAnalysis },
      { path: '/plan', label: 'AI 营销方案', icon: TrendCharts },
    ],
  },
  {
    title: '内容中心',
    items: [
      { path: '/content', label: 'AI 内容工作台', icon: EditPen, prefix: true },
      { path: '/delivery', label: '交付中心', icon: DocumentChecked },
    ],
  },
  {
    title: '系统与帮助',
    items: [
      { path: '/settings', label: '系统设置', icon: Setting },
      { path: '/help', label: '帮助与反馈', icon: Help },
    ],
  },
]

function isActive(item: NavItem): boolean {
  if (item.prefix) {
    return route.path === item.path || route.path.startsWith(item.path + '/')
  }
  return route.path === item.path
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 256px;
  height: 100vh;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  z-index: 30;
  user-select: none;
}
.nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
}
.nav-group {
  margin-bottom: 20px;
}
.nav-group-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0 12px;
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  transition: all 0.15s;
  margin-bottom: 4px;
  cursor: pointer;
}
.nav-item:hover {
  background: var(--brand-50);
  color: var(--brand-600);
}
.nav-item.active {
  background: var(--brand-500);
  color: #fff;
  box-shadow: 0 2px 6px rgba(42, 120, 214, 0.25);
  font-weight: 500;
}
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.user-avatar {
  background: linear-gradient(135deg, var(--brand-500), var(--accent-500));
  color: #fff;
  font-weight: 600;
}
.user-meta {
  overflow: hidden;
  flex: 1;
}
.user-name {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-role {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
