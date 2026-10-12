<template>
  <div class="brand">
    <div class="brand-mark">食</div>
    <div class="brand-text">
      <div class="brand-name">食效云 AI</div>
      <div class="brand-sub">餐饮全链路增长平台</div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.brand {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}
.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--brand-500), var(--accent-500));
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(42, 120, 214, 0.2);
}
.brand-name {
  font-weight: 700;
  font-size: 16px;
  line-height: 1.2;
}
.brand-sub {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
