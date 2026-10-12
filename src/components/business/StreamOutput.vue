<template>
  <div class="stream-box font-mono" :class="{ 'cursor-blink': streaming }">{{ output }}</div>
</template>

<script setup lang="ts">
defineProps<{ output: string; streaming: boolean }>()
</script>
