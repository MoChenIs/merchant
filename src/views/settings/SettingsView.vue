<template>
  <div class="page settings">
    <PageHeader title="系统设置" subtitle="管理账号信息、主题偏好、通知与本地缓存。" />

    <div class="card section">
      <h3 class="section-title">账号信息</h3>
      <div class="form-grid">
        <div class="field">
          <label class="field-label">姓名</label>
          <el-input v-model="account.name" placeholder="请输入姓名" />
        </div>
        <div class="field">
          <label class="field-label">手机号</label>
          <el-input v-model="account.phone" placeholder="请输入手机号" />
        </div>
        <div class="field">
          <label class="field-label">邮箱</label>
          <el-input v-model="account.email" placeholder="请输入邮箱" />
        </div>
        <div class="field">
          <label class="field-label">角色</label>
          <el-input :model-value="account.role" disabled />
        </div>
      </div>
      <div class="section-foot">
        <el-button type="primary" @click="saveAccount">保存账号信息</el-button>
      </div>
    </div>

    <div class="card section">
      <h3 class="section-title">主题偏好</h3>
      <div class="row">
        <div>
          <div class="row-title">界面主题</div>
          <div class="muted">切换整体界面明暗风格，自动保存到本地。</div>
        </div>
        <el-radio-group v-model="theme">
          <el-radio-button value="light">浅色模式</el-radio-button>
          <el-radio-button value="dark">深色模式</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="card section">
      <h3 class="section-title">通知偏好</h3>
      <div class="notify-list">
        <div v-for="n in notifications" :key="n.key" class="row">
          <div>
            <div class="row-title">{{ n.label }}</div>
            <div class="muted">{{ n.desc }}</div>
          </div>
          <el-switch v-model="n.value" />
        </div>
      </div>
    </div>

    <div class="card section">
      <h3 class="section-title">数据与缓存</h3>
      <div class="row">
        <div>
          <div class="row-title">清空本地演示缓存</div>
          <div class="muted">清空浏览器本地存储中的主题与缓存数据（演示）。</div>
        </div>
        <el-button type="danger" plain @click="clearCache">清空缓存</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import { useAppStore } from '@/stores/app'
import type { Theme } from '@/types/common'

const appStore = useAppStore()

const account = reactive({
  name: '运营总监-张',
  phone: '138 0000 8888',
  email: 'ops@shixiaoyun.ai',
  role: '运营总监',
})

const theme = computed<Theme>({
  get: () => appStore.theme,
  set: (v: Theme) => appStore.setTheme(v),
})

const notifications = reactive([
  { key: 'diagnosis', label: '诊断报告完成提醒', desc: 'AI 经营诊断生成完成时通知我', value: true },
  { key: 'content', label: '内容生成完成提醒', desc: 'AI 内容工作台生成完成时通知我', value: true },
  { key: 'delivery', label: '交付进度提醒', desc: '内容交付或发布状态变更时通知我', value: false },
])

function saveAccount() {
  ElMessage.success('账号信息已保存（演示）')
}

async function clearCache() {
  try {
    await ElMessageBox.confirm('确定要清空本地演示缓存吗？该操作不可撤销。', '清空缓存', {
      confirmButtonText: '确认清空',
      cancelButtonText: '取消',
      type: 'warning',
    })
    localStorage.removeItem('shixiao_theme')
    ElMessage.success('本地缓存已清空')
  } catch {
    /* 用户取消 */
  }
}
</script>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 880px;
}
.section {
  padding: 24px;
}
.section-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 20px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field-label {
  font-size: 13px;
  color: var(--text-secondary);
}
.section-foot {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.row-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}
.notify-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media (max-width: 700px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
