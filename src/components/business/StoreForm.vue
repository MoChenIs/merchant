<template>
  <div class="card store-form">
    <div class="section">
      <h3 class="form-section-title">1. 基础资料</h3>
      <div class="grid-3">
        <div class="field">
          <label class="field-label">门店名称</label>
          <el-input v-model="form.name" placeholder="请输入门店全称" />
        </div>
        <div class="field">
          <label class="field-label">所在城市</label>
          <el-cascader
            v-model="cityValue"
            :options="regionOptions"
            placeholder="请选择省 / 市 / 区"
            clearable
            style="width: 100%"
          />
        </div>
        <div class="field">
          <label class="field-label">详细地址</label>
          <el-input v-model="form.address" placeholder="请输入详细街道门牌号" />
        </div>
        <div class="field">
          <label class="field-label">品类</label>
          <el-input v-model="form.category" placeholder="如：川渝火锅、日料、烘焙" />
        </div>
        <div class="field">
          <label class="field-label">客单价</label>
          <el-input v-model="form.avgPrice" placeholder="如：¥98 / 人" />
        </div>
        <div class="field">
          <label class="field-label">营业时间</label>
          <el-input v-model="form.businessHours" placeholder="如：10:00 – 22:00" />
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="form-section-title">2. 经营情况</h3>
      <div class="grid-3">
        <div class="field">
          <label class="field-label">月营业额评估</label>
          <el-input v-model="form.monthlyRevenue" placeholder="如：约 ¥45 万" />
        </div>
        <div class="field">
          <label class="field-label">日常客流</label>
          <el-input v-model="form.dailyTraffic" placeholder="如：工作日 180 / 周末 320" />
        </div>
        <div class="field">
          <label class="field-label">主要客群</label>
          <el-input v-model="form.targetAudience" placeholder="如：18–35 岁 · 情侣与朋友聚餐" />
        </div>
        <div class="field span-3">
          <label class="field-label">当前主要问题</label>
          <el-input
            v-model="form.currentProblem"
            type="textarea"
            :rows="3"
            placeholder="描述当前面临的获客、转化或复购瓶颈..."
          />
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="form-section-title">3. 线上平台信息</h3>
      <div class="grid-3">
        <div class="field">
          <label class="field-label">抖音主页链接</label>
          <el-input v-model="form.douyin" placeholder="douyin.com/..." />
        </div>
        <div class="field">
          <label class="field-label">小红书账号</label>
          <el-input v-model="form.xiaohongshu" placeholder="xiaohongshu.com/..." />
        </div>
        <div class="field">
          <label class="field-label">大众点评商户</label>
          <el-input v-model="form.dianping" placeholder="dianping.com/shop/..." />
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="form-section-title">4. 团购套餐概要</h3>
      <div class="field">
        <label class="field-label">现有团购套餐概要</label>
        <el-input v-model="form.groupBuy" placeholder="如：已上架双人餐、四人餐..." />
      </div>
    </div>

    <div class="section">
      <h3 class="form-section-title">5. 自定义动态扩展字段</h3>
      <CustomFieldEditor v-model="form.customFields" />
    </div>

    <div class="form-actions">
      <el-button @click="emit('cancel')">取消</el-button>
      <el-button type="primary" size="large" @click="emit('submit', form)">{{ submitLabel }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { regionData, codeToText } from 'element-china-area-data'
import type { CascaderOption } from 'element-plus'
import CustomFieldEditor from '@/components/common/CustomFieldEditor.vue'
import type { StoreFormData } from '@/types/store'

// element-china-area-data 的 DataItem 结构与 el-cascader 的 options 结构一致，此处做一次边界类型转换
const regionOptions = regionData as unknown as CascaderOption[]

const props = withDefaults(
  defineProps<{ initial: StoreFormData; submitLabel?: string }>(),
  { submitLabel: '保存' }
)

const emit = defineEmits<{
  (e: 'submit', form: StoreFormData): void
  (e: 'cancel'): void
}>()

const form = reactive<StoreFormData>({
  ...props.initial,
  customFields: (props.initial.customFields ?? []).map((f) => ({ ...f })),
})

/** 根据已存储的城市文本，反查省市区级联选项的 value 数组 */
function findRegionCodes(text: string): string[] {
  if (!text) return []
  for (const p of regionData) {
    if (text.startsWith(p.label)) {
      const restCity = text.slice(p.label.length)
      for (const c of p.children ?? []) {
        if (restCity.startsWith(c.label)) {
          const restDistrict = restCity.slice(c.label.length)
          for (const d of c.children ?? []) {
            if (restDistrict === d.label) return [p.value, c.value, d.value]
          }
          return [p.value, c.value]
        }
      }
      return [p.value]
    }
  }
  return []
}

const cityValue = ref<string[]>(findRegionCodes(props.initial.city))

watch(cityValue, (codes) => {
  form.city = (codes ?? []).map((c) => codeToText[c] ?? '').join('')
})
</script>

<style scoped>
.store-form {
  padding: 32px;
}
.section {
  margin-bottom: 32px;
}
.section:last-of-type {
  margin-bottom: 0;
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field.span-2 {
  grid-column: span 2;
}
.field.span-3 {
  grid-column: span 3;
}
.field-label {
  font-size: 13px;
  color: var(--text-secondary);
}
.form-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
@media (max-width: 1200px) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
  .field.span-3 {
    grid-column: span 2;
  }
}
@media (max-width: 900px) {
  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }
  .field.span-2,
  .field.span-3 {
    grid-column: span 1;
  }
}
</style>
