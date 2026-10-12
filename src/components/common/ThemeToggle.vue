<template>
  <el-button circle :title="isDark ? '切换亮色' : '切换暗色'" @click="appStore.toggleTheme()">
    <el-icon><component :is="isDark ? Sunny : Moon" /></el-icon>
  </el-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const isDark = computed(() => appStore.theme === 'dark')
</script>
