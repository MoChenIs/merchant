# 食效云 · AI 餐饮增长平台 —— 前端开发文档

> 版本：V2（根据功能调整重写）
> 日期：2026-10-12
> 性质：纯前端 UI 项目（无后端、无数据库、无真实登录/发布），以「页面实现」为交付目标
> 参考蓝本：`C:\Users\MOCHEN\Desktop\杂件\code\2.html`（静态原型）

---

## 0. 文档约定

- 「演示」标记的动作表示仅做前端交互反馈（toast / 弹窗），不落地任何真实数据或请求。
- 所有「AI 生成」均为前端**模拟**：文案来自本地 mock 数据，用定时器模拟 SSE 流式输出。
- 文中代码片段为**规格说明性质的示意**，用于统一理解，不代表最终实现文件。

---

## 1. 项目概述

### 1.1 背景与目标

把一份静态 HTML 原型（`2.html`）升级为一个更贴近真实工程的 **Vue 3 单页应用**：

- 具备规范的工程结构（路由、状态、服务分层、类型、组件拆分）。
- 保留原型的定制视觉与亮/暗主题。
- 用 **Mock 服务层 + SSE 流式模拟** 呈现"真实 AI 产品"的交互体验。
- 不接数据库、不接后端，**只实现页面**，为将来替换真实接口预留清晰边界。

### 1.2 本期范围（做什么）

1. 全局布局（侧边栏 + 顶栏）与主题切换。
2. 工作台（统计卡 + ECharts 柱状图 + 待办/动态）。
3. 门店管理：门店列表、门店详情、**新增门店**、**编辑门店信息**。
4. AI 经营诊断（**SSE 流式输出**）。
5. AI 营销方案（**SSE 流式输出**）。
6. AI 内容工作台（**三卡片 + 下钻生成 + 一键发布/导出**）。
7. 交付中心、设置、帮助中心。

### 1.3 非目标（不做什么）

- 不接数据库、不写后端接口。
- 不做真实登录鉴权（仅保留假账号展示）。
- 不真实发布到抖音 / 小红书等平台。
- 不做文生视频、视频剪辑、广告投放、达人/客户关系管理、团购自动上架、复杂权限（对应 PRD「暂不包含」）。
- 「导出」默认仅提示，不做真实文件流（可预留 Blob 下载扩展点）。

### 1.4 术语

| 术语 | 含义 |
|---|---|
| 门店 | 一家被代运营的餐饮门店（核心实体） |
| 诊断 | AI 门店经营诊断报告 |
| 方案 | AI 营销方案 / 行动计划 |
| 内容 | 团购套餐图文 / 小红书图文 / 短视频脚本 |
| SSE 模拟 | 前端用定时器逐字吐出文案，模拟服务端流式推送 |

---

## 2. 技术选型

| 类别 | 选型 | 版本 | 理由 |
|---|---|---|---|
| 框架 | Vue | 3.5.x | 组合式 API、生态成熟 |
| 构建 | Vite | 5.x/6.x | 快、开箱即用、插件丰富 |
| 语言 | TypeScript | 5.x | 类型约束利于多页面/组件协作 |
| 路由 | Vue Router | 4.x | 标准 SPA 路由 |
| 状态 | Pinia | 2.x/3.x | Vue3 官方推荐、轻量 |
| UI 组件库 | Element Plus | 2.x | 组件齐全、中文文档、可深度定制主题；与你 eladmin 的 Element 生态一脉相承 |
| 图表 | ECharts | 5.x | 你 eladmin 用过；功能强、后续可扩展 |
| 规范 | ESLint + Prettier | 9.x / 3.x | 统一代码风格 |

### 2.1 关键取舍

1. **UI 组件库参与度**：保留原型的设计令牌（CSS 变量）与定制布局外壳；Element Plus 只承担交互型组件（表格、表单、下拉、弹窗、消息、按钮等），并用 CSS 变量覆盖其主题色，保证视觉统一。
2. **图表**：柱状图由手写 SVG 改为 ECharts，主题色对齐品牌蓝。
3. **流式输出**：统一封装一个 `useStreaming` 组合式函数，诊断/方案/内容三处复用。
4. **目录按领域划分**（feature-first），而非按 `views/components` 一刀切堆积。

---

## 3. 总体架构与数据流

### 3.1 分层

```
视图层（.vue 页面 + 组件）
   │  调用组合式函数 / store
   ▼
状态层（Pinia stores）
   │  调用 service
   ▼
服务层（services/*，Mock 实现）
   │  读取静态数据 + 定时器模拟异步/SSE
   ▼
数据层（mocks/*，类型化静态数据  +  types/*）
```

单向数据流：**页面 → store → service → mock 数据**；service 返回 Promise（普通请求）或流式回调（SSE 模拟）。

### 3.2 流式输出数据流（SSE 模拟）

```
点击「生成」
  → 组件进入 streaming 状态，调用 useStreaming
  → useStreaming 将 mocks 中的完整文案按块切割，setInterval 逐个吐出
  → 组件 ref 累积文本 → 渲染到输出框（带闪烁光标，自动滚底）
  → 全部吐完 → 状态置 done，「重新生成」可用
```

---

## 4. 目录结构

```
merchart/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ eslint.config.js
├─ .prettierrc
├─ .env.development
├─ .env.production
└─ src/
   ├─ main.ts                     # 入口：注册 router / pinia / Element Plus
   ├─ App.vue                     # 根组件：<router-view>
   ├─ router/
   │  └─ index.ts
   ├─ layouts/
   │  ├─ AppLayout.vue            # 侧边栏 + 顶栏 + 内容区
   │  ├─ AppSidebar.vue
   │  └─ AppTopbar.vue
   ├─ views/
   │  ├─ dashboard/DashboardView.vue
   │  ├─ stores/
   │  │  ├─ StoreListView.vue
   │  │  ├─ StoreDetailView.vue
   │  │  ├─ StoreCreateView.vue    # 新增门店
   │  │  └─ StoreEditView.vue      # 编辑门店信息
   │  ├─ diagnosis/DiagnosisView.vue
   │  ├─ plan/PlanView.vue
   │  ├─ content/
   │  │  ├─ ContentHomeView.vue    # 三卡片
   │  │  └─ ContentCreateView.vue  # 下钻生成（type 参数驱动）
   │  ├─ delivery/DeliveryView.vue
   │  ├─ settings/SettingsView.vue
   │  └─ help/HelpView.vue
   ├─ components/
   │  ├─ layout/BrandLogo.vue
   │  ├─ common/          # PageHeader / StatCard / StatusTag / EmptyState / InfoBanner / ThemeToggle / CustomFieldEditor
   │  ├─ business/        # StoreTable / DiagnosisReport / PlanTimeline / GoalChips / ContentCard / ContentCreatePanel / StreamOutput
   │  └─ chart/ContentBarChart.vue
   ├─ stores/             # app.ts / store.ts / diagnosis.ts / plan.ts / content.ts
   ├─ services/           # http.ts(模拟请求+流式) / store.ts / diagnosis.ts / plan.ts / content.ts
   ├─ mocks/              # 静态数据源（门店/诊断/方案/内容/动态）
   ├─ types/              # store.ts / diagnosis.ts / plan.ts / content.ts / common.ts
   ├─ composables/        # useStreaming.ts / useTheme.ts
   ├─ styles/             # tokens.css / global.css / element-theme.css / dark.css
   └─ utils/
```

---

## 5. 路由设计

| 路径 | 名称 | 页面 | 备注 |
|---|---|---|---|
| `/` | redirect | → `/dashboard` | |
| `/dashboard` | dashboard | 工作台 | |
| `/stores` | store-list | 门店列表 | |
| `/stores/new` | store-create | 新增门店 | **新增** |
| `/stores/:id` | store-detail | 门店详情 | |
| `/stores/:id/edit` | store-edit | 编辑门店信息 | **改名自「编辑资料」** |
| `/diagnosis` | diagnosis | AI 经营诊断 | SSE 流式 |
| `/plan` | plan | AI 营销方案 | SSE 流式 |
| `/content` | content-home | 内容工作台（三卡片） | |
| `/content/:type` | content-create | 内容下钻生成 | type ∈ `group-buy` \| `xhs` \| `video` |
| `/delivery` | delivery | 交付中心 | |
| `/settings` | settings | 设置 | |
| `/help` | help | 帮助中心 | |

- `/stores/:id` 与 `/stores/:id/edit` 为嵌套路由，共享 `StoreDetail` 上下文。
- `/content/:type` 由 `ContentHomeView` 卡片点击下钻进入。

---

## 6. 数据模型（TypeScript）

### 6.1 门店 `Store`

固定 14 字段 + 可扩展自定义字段。

```ts
export interface CustomField {
  id: string;
  name: string;   // 字段名，如「停车场」「WIFI」
  value: string;  // 字段内容
}

export interface Store {
  id: string;
  // —— 基础资料 ——
  name: string;            // 门店名称
  city: string;            // 城市
  address: string;         // 地址
  category: string;        // 品类
  avgPrice: string;        // 客单价
  businessHours: string;   // 营业时间
  // —— 经营情况 ——
  monthlyRevenue: string;  // 月营业额
  dailyTraffic: string;    // 日常客流
  targetAudience: string;  // 主要客群
  currentProblem: string;  // 当前问题
  // —— 线上信息 ——
  douyin: string;          // 抖音主页
  xiaohongshu: string;     // 小红书账号
  dianping: string;        // 大众点评
  // —— 团购 / 扩展 ——
  groupBuy: string;        // 团购套餐
  customFields: CustomField[]; // 自定义字段（可增删）
  // —— 元数据 ——
  status: StoreStatus;     // 已诊断 | 待诊断 | 资料待补充
  updatedAt: string;
}
```

### 6.2 诊断 `Diagnosis`

```ts
export interface Problem { severity: '高' | '中' | '低'; title: string; desc: string; }
export interface Diagnosis {
  id: string;
  storeId: string;
  version: number;
  overview: string;              // 现状概述
  problems: Problem[];           // 主要问题
  causes: string;                // 可能原因
  suggestions: string[];         // 优先改进建议
  directions: string[];          // 分析方向
  createdAt: string;
}
```

### 6.3 方案 `Plan`

```ts
export interface Stage { week: string; title: string; desc: string; tags: string[]; state: 'done' | 'next' | 'todo'; }
export interface Plan {
  id: string;
  storeId: string;
  goal: '新店开业' | '老店提升客流' | '新品推广';
  period: string;
  budget: string;
  keyProducts: string;
  objective: string;
  stages: Stage[];
  actions: string[];
  collaborations: string[];
  createdAt: string;
}
```

### 6.4 内容 `Content`

```ts
export type ContentType = 'group-buy' | 'xhs' | 'video';

// 图文/套餐：文案分块
export interface ContentBlock { label: string; text: string; }

// 短视频：分镜表行
export interface StoryboardRow {
  scene: string;      // 场景 / 画面内容
  shot: string;       // 景别（远景 / 近景 / 特写…）
  subtitle: string;   // 字幕
  narration: string;  // 旁白解说
  audio: string;      // 音乐 / 音效
  duration: string;   // 时长（如 6s）
}

export interface ContentResult {
  id: string;
  storeId: string;
  type: ContentType;
  prompt: string;              // 用户输入提示词
  uploadImage?: string;        // 小红书：用户上传图（前端 FileReader 预览，不真实上传）
  image?: string;              // 生成的图片（本地占位图，模拟 AI 出图）
  blocks?: ContentBlock[];     // 团购/小红书：文案分块
  storyboard?: StoryboardRow[];// 短视频：分镜表
  createdAt: string;
}
```

### 6.5 其他

```ts
export type StoreStatus = 'diagnosed' | 'pending' | 'incomplete';
export interface Activity { id: string; title: string; time: string; color: string; }
export interface Todo { id: string; title: string; time: string; done: boolean; }
export interface StatItem { label: string; value: string; unit: string; delta?: { type: 'up'|'down'|'warn'; text: string }; icon: string; }
```

---

## 7. 页面规格

> 每页给出：路由、布局、功能、交互、关键实现点。

### 7.1 工作台 `/dashboard`

- **布局**：顶部问候 + 操作按钮；4 个统计卡一行；左 2/3 柱状图，右 1/3 待办 + 最近动态。
- **统计卡**（`StatCard`）：服务门店 24 / 累计诊断 168 / 待审核内容 12 / 本月交付 46，含 delta 标签。
- **图表**：`ContentBarChart`（ECharts 柱状图），数据为近 7 日内容生产量（周一~周日），单系列品牌蓝，含 hover tooltip。
- **待办/动态**：来自 `mocks/activity`。
- 交互：按钮跳转「导出交付 / 开始诊断」。

### 7.2 门店列表 `/stores`

- 表格列：门店名称（logo + 名称）/ 城市 / 品类 / 客单价 / 诊断状态 / 更新时间 / 操作。
- 顶部：搜索框 + 城市/品类/状态筛选下拉；「新建门店」按钮 → `/stores/new`。
- 行点击 → `/stores/:id`；操作列：复制链接、进入详情。
- 实现：`el-table` + `StoreTable` 封装，数据来自 `store store`。

### 7.3 门店详情 `/stores/:id`

- 顶部：返回列表 + 门店名 + 状态标签 + 地址/品类/更新时间 + 「编辑门店信息」+「开始新任务」。
- 「编辑门店信息」→ `/stores/:id/edit`。
- 中部：门店档案（14 字段 + 自定义字段只读展示）。
- 底部：三个 Tab（诊断报告 / 营销方案 / 内容素材），各列出历史结果。

### 7.4 新增门店 `/stores/new`（重点）

- **目标**：录入一家门店资料。默认展示 14 个字段，并允许添加自定义字段。
- **布局**：`el-form` 分区展示，底部「保存 / 取消」。

**14 个默认字段及默认值（展示用）：**

| 分区 | 字段 | 默认值 | 控件 |
|---|---|---|---|
| 基础资料 | 门店名称 | 川渝火锅·春熙路店 | input |
| 基础资料 | 城市 | 四川省成都市 | input |
| 基础资料 | 地址 | 春熙路步行街 12 号 2F | input |
| 基础资料 | 品类 | 川渝火锅 | input |
| 基础资料 | 客单价 | ¥98 / 人 | input |
| 基础资料 | 营业时间 | 10:00 – 22:00 | input |
| 经营情况 | 月营业额 | 约 ¥45 万 | input |
| 经营情况 | 日常客流 | 工作日 180 / 周末 320 | input |
| 经营情况 | 主要客群 | 18–35 岁 · 情侣与朋友聚餐 | input |
| 经营情况 | 当前问题 | 新店开业 2 个月，线上曝光不足，到店转化低 | textarea |
| 线上信息 | 抖音主页 | douyin.com/@chuanyu-hotpot | input |
| 线上信息 | 小红书账号 | xiaohongshu.com/chuanyu | input |
| 线上信息 | 大众点评 | dianping.com/shop/chuanyu | input |
| 团购/其他 | 团购套餐 | 已上架 3 款（双人餐 / 四人餐 / 午市单人） | input |

- **自定义字段**（`CustomFieldEditor` 组件）：
  - 列表每行 = 字段名 input + 内容 input + 删除按钮。
  - 「+ 添加字段」按钮追加一行空字段。
  - 保存时并入 `customFields`。
- **交互**：
  - 「保存」→ 校验门店名称非空 → 写入 `store` store（内存）→ toast「门店已保存（演示）」→ 跳回 `/stores`。
  - 「取消」→ 返回 `/stores`。

### 7.5 编辑门店信息 `/stores/:id/edit`（重点）

- 与「新增门店」同构：14 字段 + 自定义字段，**预填**当前门店数据。
- 顶部标题「编辑门店信息」，底部「保存 / 取消」。
- 保存 → 更新 `store` store → toast → 返回 `/stores/:id`。

### 7.6 AI 经营诊断 `/diagnosis`（SSE 流式）

- 顶部：选择门店（下拉）+「重新生成」「复制」「导出」。
- 报告区：现状概述 → 主要问题（问题列表）→ 可能原因 → 优先改进建议 → 分析方向。
- **生成流程（SSE 模拟）**：
  1. 点击「生成诊断」→ 按钮进入 streaming 状态（禁用 + 「AI 生成中…」）。
  2. 调用 `diagnosis` service 的流式方法，`useStreaming` 逐块输出报告文本。
  3. 输出框展示累计文本 + 闪烁光标；完成后置「重新生成」。
- 资料不足提示条：当线上信息不全时展示「判断依据有限，请人工核实」。
- 历史版本列表（右侧）可回看。

### 7.7 AI 营销方案 `/plan`（SSE 流式）

- 顶部：营销目标芯片（新店开业 / 老店提升客流 / 新品推广）+ 活动时间/预算/重点产品输入 +「生成方案」。
- 方案区：目标说明 → 阶段安排（时间线）→ 建议动作 → 所需配合事项。
- **生成流程**：同诊断，SSE 流式输出方案文本。
- 重要提醒条：「方案以建议为主，价格/利润/平台政策请人工核实」。

### 7.8 AI 内容工作台 `/content` + `/content/:type`（重点重构）

#### 7.8.1 首页三卡片 `/content`

三张**渐变卡片**并排（视觉参考用户提供的渐变卡片结构），各有：右上角 HOT 角标、副标签、标题、描述、若干功能标签按钮、底部「立即使用 →」。

| 卡片 | 标题 | 副标签 | 渐变背景 | 功能标签按钮 | 下钻路由 |
|---|---|---|---|---|---|
| 1 | 团购套餐图文设计 | 套餐提效 | `linear-gradient(135deg,#ffb347,#ffcc33)`（橙黄） | 套餐主图 / 价格标签 / 卖点文案 / 头图设计 | `/content/group-buy` |
| 2 | 小红书图文推广设计 | 种草推广 | `linear-gradient(135deg,#a18cd1,#fbc2eb)`（紫粉） | 上传图片 / 正文种草 / 配图方向 / 话题标签 | `/content/xhs` |
| 3 | 短视频脚本生成 | 视频脚本 | `linear-gradient(135deg,#4facfe,#00f2fe)`（蓝青） | 分镜 / 景别 / 字幕 / 旁白 / 时长 | `/content/video` |

- 功能标签按钮点击 = 将对应标签填入下钻页的提示词（快捷填充），也可仅作装饰。

#### 7.8.2 下钻生成页 `/content/:type`

顶部：返回内容工作台 + 当前类型标题。三种类型的**输入方式与输出形态不同**：

**① 团购套餐图文设计 `/content/group-buy`（纯文本框）**
- 输入：单一文本输入区（纯文本框），占位「输入套餐名称 / 卖点 / 目标人群…」。
- 「一键生成」→ 流式生成，输出 **图片 + 文案**：上方一张生成图（占位图模拟），下方文案分块（套餐名称 / 价格标签 / 卖点文案 / 详情描述）。

**② 小红书图文推广设计 `/content/xhs`（上传图片 + 文本）**
- 布局：**左上角上传图片区**（点击上传 → 前端 FileReader 预览，不真实上传），**左下角文本输入区**（输入种草主题/卖点）。
- 「一键生成」→ 输出 **图片 + 文案**：以用户上传图为头图（未上传则用占位图），下方文案分块（标题 / 正文 / 配图方向 / 话题建议）。

**③ 短视频脚本生成 `/content/video`（纯文本框 → 分镜表）**
- 输入：单一文本输入区，占位「输入视频主题 / 门店活动 / 品牌故事…」。
- 「一键生成」→ 输出 **视频脚本分镜表**（`StoryboardTable`），列为 `场景/画面内容 | 景别 | 字幕 | 旁白解说 | 音乐/音效 | 时长`，逐行对应一个镜头。示例：

| 场景/画面内容 | 景别 | 字幕 | 旁白解说 | 音乐/音效 | 时长 |
|---|---|---|---|---|---|
| 镜头从地球仪的画面出发，不断加速穿梭云层，直至公司总部大楼。 | 远景 | 创业三十载，拾梦再出发 | 我们的故事是这样开始 | 时空穿梭音效 | 6s |
| 员工A从家里出发，坐上地铁，在地铁上打开了公司的APP，查看今天的会议和重要事项。 | 近景 | 早上7:30是我一天的开始 | — | 人群声音、地铁声音 | 12s |

**通用操作（三种类型均含）：**
- 输出框下方两个按钮：
  1. **一键发布**：点击弹 `ElMessageBox.confirm("是否同步发布到抖音/小红书？")` → 确认 → `ElMessage.success("已提交发布（演示）")`；取消 → 关闭。
  2. **导出**：点击 → `ElMessage.success("已导出txt文件")`（演示；预留真实下载扩展点）。
- 生成过程沿用 `useStreaming` 流式输出。

> 说明：因无后端、无 AI 出图能力，「生成图片」均用本地占位图（渐变色块/占位图）模拟；「上传图片」仅前端预览，不做真实上传。

#### 7.8.3 内容类型与输入/输出定义

| type | 输入方式 | 输出 |
|---|---|---|
| `group-buy`（团购套餐图文） | 纯文本框 | 图片（占位）+ 文案（套餐名称/价格标签/卖点文案/详情描述） |
| `xhs`（小红书图文） | 左上上传图 + 左下文本 | 图片（上传图或占位）+ 文案（标题/正文/配图方向/话题建议） |
| `video`（短视频脚本） | 纯文本框 | 分镜表（场景/画面内容、景别、字幕、旁白解说、音乐音效、时长） |

### 7.9 交付中心 `/delivery`

- 表格：门店 / 交付内容 / 状态 / 更新时间 / 操作（复制、导出）。
- 「导出交付包」→ toast「已导出交付包（演示）」。

### 7.10 设置 `/settings`

- 账号信息（只读展示）+ 偏好设置（默认平台、语言风格下拉）。

### 7.11 帮助中心 `/help`

- 三张问答卡片：如何开始诊断 / 资料不足怎么办 / 生成内容能直接发布吗。

---

## 8. 共享组件清单

| 组件 | 职责 |
|---|---|
| `AppLayout` / `AppSidebar` / `AppTopbar` | 全局布局、导航、搜索、主题切换、通知 |
| `BrandLogo` | 品牌标识 |
| `PageHeader` | 页面标题 + 副标题 + 操作区 |
| `StatCard` | 统计瓦片 |
| `StatusTag` | 状态/类型标签（颜色变体） |
| `EmptyState` | 空状态 |
| `InfoBanner` | 提示/提醒横幅 |
| `ThemeToggle` | 亮/暗主题切换 |
| `CustomFieldEditor` | 动态自定义字段编辑器（新增/编辑门店复用） |
| `StoreTable` | 门店表格 |
| `DiagnosisReport` | 诊断报告展示 |
| `PlanTimeline` | 方案阶段时间线 |
| `GoalChips` | 营销目标选择芯片 |
| `ContentCard` | 内容工作台渐变卡片 |
| `ContentCreatePanel` | 下钻生成面板（输入 + 生成 + 输出 + 发布/导出，按 type 切换布局） |
| `ImageUpload` | 图片上传/预览（小红书左上，前端 FileReader 预览） |
| `GeneratedImageCard` | 生成图片占位展示（模拟 AI 出图） |
| `StoryboardTable` | 短视频分镜表 |
| `StreamOutput` | 流式输出框（闪烁光标、自动滚底） |
| `ContentBarChart` | ECharts 柱状图封装 |

---

## 9. Mock 数据与模拟异步方案

### 9.1 普通请求模拟

```ts
// services/http.ts
export function mockRequest<T>(data: T, delay = 400): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
}
```

所有 service（store/diagnosis/plan/content）返回 `Promise`，内部走 `mockRequest` 模拟网络延迟。

### 9.2 SSE 流式模拟（核心）

```ts
// composables/useStreaming.ts
export function useStreaming() {
  const output = ref('');
  const streaming = ref(false);

  function streamText(fullText: string, opts?: {
    chunkSize?: number;   // 每块字符数，默认 2
    interval?: number;    // 每块间隔 ms，默认 30
    onDone?: () => void;
  }) {
    streaming.value = true;
    output.value = '';
    let i = 0;
    const { chunkSize = 2, interval = 30, onDone } = opts ?? {};
    const timer = setInterval(() => {
      i += chunkSize;
      output.value = fullText.slice(0, i);
      if (i >= fullText.length) {
        clearInterval(timer);
        streaming.value = false;
        onDone?.();
      }
    }, interval);
    return () => clearInterval(timer); // 返回停止函数
  }

  return { output, streaming, streamText };
}
```

- 诊断/方案/内容三处复用该组合式函数，文案来自 `mocks/` 中的完整文本。
- 生成按钮状态机：`idle → streaming → done`。
- 「停止生成」可调用返回的停止函数。

### 9.3 数据来源

`mocks/` 目录集中存放：门店列表（含示例「川渝火锅·春熙路店」14 字段）、诊断全文、方案全文、三类型内容模板、待办、动态。全部经 `types/` 类型化。

---

## 10. 视觉与主题

### 10.1 设计令牌（`styles/tokens.css`）

沿用原型的 CSS 变量体系，核心色值：

| 角色 | 亮色 | 暗色 |
|---|---|---|
| 页面背景 | `#f6f7f9` | `#0d0d0d` |
| 卡片表面 | `#ffffff` | `#1a1a19` |
| 主文本 | `#0b0b0b` | `#ffffff` |
| 次文本 | `#52514e` | `#c3c2b7` |
| 品牌蓝 | `#2a78d6` | `#3987e5` |
| 强调橙 | `#eb6834` | `#d95926` |
| 成功/警告/危险 | `#0ca30c` / `#fab219` / `#d03b3b` | 同色系暗色步进 |

### 10.2 Element Plus 主题覆盖（`styles/element-theme.css`）

用 CSS 变量把 EP 的 `--el-color-primary` 等映射到品牌蓝，按钮/输入框/标签/下拉统一风格；暗色下同步覆盖。

### 10.3 内容卡片渐变

| 卡片 | 渐变 |
|---|---|
| 团购套餐图文设计 | `linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)` |
| 小红书图文推广设计 | `linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)` |
| 短视频脚本生成 | `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` |

卡片结构（HOT 角标 / 副标签 / 标题 / 描述 / 功能标签按钮 / 「立即使用 →」）参照用户提供参考样式，但适配三卡片文案与颜色。

### 10.4 暗色主题

`data-theme="dark"` 切换，覆盖背景/表面/文本/边框/状态色，图表与渐变卡片保持可读性。

---

## 11. 图表规格（ECharts）

- 工作台柱状图 `ContentBarChart`：近 7 日内容生产量。
- 单系列品牌蓝 `#2a78d6`（暗色 `#3987e5`），柱宽合理、圆角 4px、含 hover tooltip。
- 响应式：监听容器尺寸，`resize` 更新。
- 后续可扩展：趋势折线、品类分布饼图（本期不做）。

---

## 12. 工程化

### 12.1 脚本命令

```json
{
  "dev": "vite",
  "build": "vue-tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "format": "prettier --write src/"
}
```

### 12.2 关键配置

- `vite.config.ts`：`@vitejs/plugin-vue` + `@` 别名指向 `src`。
- `tsconfig.json`：`strict: true`，`paths` 对齐别名。
- `.env.development` / `.env.production`：`VITE_APP_TITLE` 等（演示用，不接真实接口）。

### 12.3 规范

- 组件命名：`PascalCase`，文件与组件同名。
- 目录：页面放 `views/<模块>/`，可复用组件放 `components/`。
- 类型集中在 `types/`，不散落在组件内。
- 状态只经 Pinia；页面不直接读 mock 文件（经 service）。

---

## 13. 实施里程碑

| 阶段 | 内容 | 产出 |
|---|---|---|
| M1 骨架 | Vite 初始化、目录、布局、主题、路由、EP 主题覆盖 | 可运行空壳 + 导航 |
| M2 门店 | 门店列表/详情/新增/编辑（含自定义字段） | 门店完整闭环 |
| M3 AI 能力 | `useStreaming` + 诊断/方案 SSE 流式 | 两页流式生成 |
| M4 内容工作台 | 三卡片 + 下钻 + 生成 + 发布/导出 | 内容生成闭环 |
| M5 收尾 | 工作台图表、交付、设置、帮助、打磨 | 全量页面 |

> 每阶段均可独立验收，顺序依赖见上。

---

## 14. 验收标准

对应 PRD 验收 + 本次新增功能：

1. 用户可新增门店：默认展示 14 字段，可**添加/删除自定义字段**并保存（演示）。
2. 用户可进入「编辑门店信息」修改 14 字段与自定义字段（演示）。
3. 诊断与方案点击生成后，文案以 **SSE 流式**逐字输出，完成后可「重新生成」。
4. 内容工作台展示三张渐变卡片：团购套餐（纯文本框 → 图片+文案）、小红书（上传图+文本 → 图片+文案）、短视频（纯文本框 → 分镜表），一键生成后结果展示在输出框。
5. 「一键发布」弹出「是否同步发布到抖音/小红书？」确认框（演示）。
6. 「导出」提示「已导出txt文件」（演示）。
7. 门店列表/详情/交付可按门店查找历史结果。
8. 信息不足时页面能提示「补充资料 / 人工核实」。
9. 亮/暗主题可切换，整体视觉与原型一致。
