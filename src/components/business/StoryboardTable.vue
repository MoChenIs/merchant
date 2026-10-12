<template>
  <div class="storyboard">
    <el-table :data="rows" border size="small" style="width: 100%">
      <el-table-column prop="scene" label="场景 / 画面内容" min-width="180" />
      <el-table-column prop="shot" label="景别" width="80" />
      <el-table-column prop="subtitle" label="字幕" width="130" />
      <el-table-column prop="narration" label="旁白解说" min-width="160" />
      <el-table-column prop="audio" label="音乐 / 音效" width="110" />
      <el-table-column prop="duration" label="时长" width="70" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import type { StoryboardRow } from '@/types/content'

defineProps<{ rows: StoryboardRow[] }>()
</script>

<style scoped>
.storyboard {
  overflow-x: auto;
}
</style>
