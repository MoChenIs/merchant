<template>
  <div class="page dashboard">
    <PageHeader title="工作台概览" subtitle="欢迎回来，运营总监-张。今日 AI 增长引擎运行平稳。">
      <template #actions>
        <el-button type="primary" :icon="Plus" @click="router.push('/stores/new')">新增门店</el-button>
        <el-button type="success" :icon="DataAnalysis" @click="router.push('/diagnosis')">
          开始 AI 诊断
        </el-button>
      </template>
    </PageHeader>

    <div class="stats">
      <StatCard label="服务总门店数" value="24" delta-text="+3 较上月" delta-type="up" tone="blue">
        <template #icon><el-icon :size="24"><Shop /></el-icon></template>
      </StatCard>
      <StatCard label="累计经营诊断" value="168" delta-text="+12% 本周增长" delta-type="up" tone="purple">
        <template #icon><el-icon :size="24"><DataAnalysis /></el-icon></template>
      </StatCard>
      <StatCard label="待审核生成内容" value="12" delta-text="需要人工确认" delta-type="warn" tone="amber">
        <template #icon><el-icon :size="24"><Document /></el-icon></template>
      </StatCard>
      <StatCard label="本月成功交付" value="46" delta-text="交付率 98.5%" delta-type="up" tone="green">
        <template #icon><el-icon :size="24"><CircleCheck /></el-icon></template>
      </StatCard>
    </div>

    <div class="lower">
      <div class="card chart-card">
        <div class="chart-head">
          <div>
            <h3 class="chart-title">近 7 日内容生产量趋势</h3>
            <p class="chart-sub">统计团购图文、小红书笔记与短视频分镜总和</p>
          </div>
          <el-radio-group v-model="chartRange" size="small">
            <el-radio-button value="本周" />
            <el-radio-button value="上周" />
          </el-radio-group>
        </div>
        <ContentBarChart />
      </div>

      <div class="card side-card">
        <div class="side-head">
          <h3 class="side-title">待办事项</h3>
          <el-tag size="small" type="danger" effect="plain">{{ pendingCount }} 项未完成</el-tag>
        </div>
        <div class="todos">
          <div v-for="todo in appStore.todos" :key="todo.id" class="todo">
            <el-checkbox v-model="todo.done" />
            <span class="todo-title" :class="{ done: todo.done }">{{ todo.title }}</span>
            <span class="todo-time">{{ todo.time }}</span>
          </div>
        </div>

        <div class="side-head act-head">
          <h3 class="side-title">实时动态</h3>
          <span class="link" @click="router.push('/delivery')">查看全部</span>
        </div>
        <div class="activities">
          <div v-for="act in appStore.activities.slice(0, 3)" :key="act.id" class="activity">
            <span class="activity-dot" :style="{ background: act.color }"></span>
            <div class="activity-body">
              <p class="activity-title">{{ act.title }}</p>
              <span class="activity-time">{{ act.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, DataAnalysis, Shop, Document, CircleCheck } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import ContentBarChart from '@/components/chart/ContentBarChart.vue'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()

const chartRange = ref('本周')

const pendingCount = computed(() => appStore.todos.filter((t) => !t.done).length)
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.lower {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  align-items: stretch;
}
.chart-card {
  padding: 24px;
}
.chart-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}
.chart-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}
.chart-sub {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 4px 0 0;
}
.side-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
}
.side-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.act-head {
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
  margin-top: 24px;
}
.side-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}
.todos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.todo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
}
.todo-title {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
}
.todo-title.done {
  text-decoration: line-through;
  color: var(--text-secondary);
}
.todo-time {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
}
.link {
  font-size: 13px;
  color: var(--brand-500);
  cursor: pointer;
}
.link:hover {
  text-decoration: underline;
}
.activities {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.activity {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 12px;
}
.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}
.activity-title {
  margin: 0;
  font-weight: 500;
}
.activity-time {
  color: var(--text-secondary);
  font-size: 11px;
}
@media (max-width: 1100px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 900px) {
  .lower {
    grid-template-columns: 1fr;
  }
}
</style>
