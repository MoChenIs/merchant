<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { useAppStore } from '@/stores/app'

const chartRef = ref<HTMLElement | null>(null)
const appStore = useAppStore()
let chart: echarts.ECharts | null = null

function render() {
  if (!chartRef.value) return
  if (!chart) chart = echarts.init(chartRef.value)

  const isDark = appStore.theme === 'dark'
  const brand = isDark ? '#3987e5' : '#2a78d6'
  const brandEnd = isDark ? '#2a78d6' : '#1e61b3'
  const ink = isDark ? '#c3c2b7' : '#898781'

  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: ink } },
      axisLabel: { color: ink },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: 'rgba(150,150,150,0.25)' } },
      axisLabel: { color: ink },
    },
    series: [
      {
        data: [18, 24, 32, 29, 45, 68, 55],
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: brand },
            { offset: 1, color: brandEnd },
          ]),
          borderRadius: [6, 6, 0, 0],
        },
      },
    ],
  })
}

function resize() {
  chart?.resize()
}

onMounted(() => {
  render()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chart?.dispose()
  chart = null
})

watch(
  () => appStore.theme,
  () => render()
)
</script>

<style scoped>
.chart {
  height: 320px;
  width: 100%;
}
</style>
